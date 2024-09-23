export async function getBielFiles() {
  try {
    const USER = "wa-biel";
    const REPO = "biel-files";
    const endpoint = `https://api.github.com/repos/${USER}/${REPO}/git/trees/master?recursive=1`;
    const res = await fetch(endpoint);

    if (!res.ok) throw new Error("couldn't fetch biel files on github");
    const json = (await res.json()) as githubReponse;
    const supportedLanguages = Object.keys(reviewersGuideMeta);
    const supportedFormats = ["zip", "pdf", "docx"];
    const formatted = json.tree.reduce((acc: shaped, current) => {
      if (current.type === "blob") {
        const parts = current.path.split("/");
        const langPart = parts?.[0];
        if (langPart && supportedLanguages.includes(langPart)) {
          const matchingMeta =
            reviewersGuideMeta[langPart as keyof typeof reviewersGuideMeta];
          if (
            current.path.includes(matchingMeta.dir_name) &&
            supportedFormats.some((format) =>
              current.path.endsWith(`.${format}`)
            )
          ) {
            const extensionsDelimiterIdx = current.path.lastIndexOf(".");
            const extension = current.path.slice(extensionsDelimiterIdx);
            const nameParts = current.path
              .slice(0, extensionsDelimiterIdx)
              .split("/");
            const name = nameParts[nameParts.length - 1]!;
            const url = current.url;
            const book = Object.entries(matchingMeta.books).find(
              ([bookName]) => {
                return current.path.includes(bookName);
              }
            );
            //
            const category = book ? book[1].anth : "topics";
            const sort = book ? book[1].num : null;
            const resourceType = matchingMeta.dir_label;
            if (!acc[langPart]) acc[langPart] = {};
            if (!acc[langPart]![resourceType]) {
              acc[langPart]![resourceType] = {};
            }
            if (!acc[langPart]![resourceType]![category]) {
              acc[langPart]![resourceType]![category] = [];
            }
            const curEntry = acc[langPart]![resourceType]![category]!.find(
              (entry) => entry.name === name
            );
            if (curEntry) {
              curEntry.links.push({
                format: extension,
                url,
              });
            } else {
              acc[langPart]![resourceType]![category]!.push({
                name,
                sort,
                links: [
                  {
                    format: extension,
                    url,
                    download: `https://github.com/${USER}/${REPO}/raw/master/${current.path}`,
                    // https://github.com/wa-biel/biel-files/raw/master/en/review-guide/Reviewers%27%20Guide%20PDF%20documents/Mark.pdf
                  },
                ],
              });
            }
            acc[langPart]![resourceType]![category]!.sort((a, b) => {
              if (a.sort && b.sort) {
                return a.sort - b.sort;
              }
              return 0;
            });
          }
        }
      }
      return acc;
    }, {});
    return formatted;
  } catch (error) {
    console.error(error);
    return;
  }
}
export async function getTsFiles(language: string | undefined) {
  if (!language) return;
  // const USER = "wkelly17";
  // const REPO = "biel-tk-example";
  const USER = "wa-biel";
  const REPO = "biel-files";
  const endpoint = `https://api.github.com/repos/${USER}/${REPO}/git/trees/master?recursive=1`;

  let cachedRes: Response | undefined;
  let cachedEtag: string | undefined | null;
  // cloudflare production cache
  if (globalThis.caches) {
    const cache = globalThis.caches.default;
    const cacheMatch = await cache.match(endpoint);
    if (cacheMatch) {
      cachedRes = cacheMatch;
      cachedEtag = cacheMatch.headers.get("etag");
    }
  }

  // Etag fetches still hit the origin (i.e github) but they avoid the request body, so there will always be the fetch here to check for newest, but there will be no response body if the etag is the same, which lightens up the fetch considerably
  const res = await fetch(endpoint, {
    headers: {
      "User-Agent": "wkelly17",
      ...(cachedEtag && {"If-None-Match": cachedEtag}),
    },
    // @ts-ignore
    cf: {
      headers: {
        "Cache-Control": "max-age=20",
      },
    },
  });
  // unmodified is ok. We handle below. This is an etag check
  if (!res.ok && res.status != 304) throw new Error(res.statusText);

  if (globalThis.caches && res.status !== 304) {
    // CF: Our implementation of the Cache API respects the following HTTP headers on the response passed to put(): ETAG, Expires, Last-Modified.  ETAG Allows cache.match() to evaluate conditional requests with If-None-Match.
    globalThis.caches.default.put(endpoint, res.clone());
  }
  const json =
    res.status === 304 && !!cachedRes
      ? ((await cachedRes!.json()) as githubReponse)
      : ((await res.json()) as githubReponse);
  const formatted = json.tree.reduce(
    (
      acc: Record<
        string,
        {
          [category: string]: {
            url: string;
            files: githubReponse["tree"];
          };
        }
      >,
      current
    ) => {
      // reduce into lang/category:::
      // do everything from the blobs:
      if (current.type === "blob") {
        const parts = current.path.split("/");
        const langPart = parts?.[0];
        const category = parts?.[1] == current.path ? null : parts?.[1];
        if (langPart) {
          if (!acc[langPart]) acc[langPart] = {};
          if (category) {
            if (!acc[langPart][category])
              acc[langPart][category] = {
                url: `https://github.com/${USER}/${REPO}/tree/master/${encodeURIComponent(
                  langPart
                )}/${encodeURIComponent(category)}`,
                files: [],
              };
            current.url = `https://raw.githubusercontent.com/${USER}/${REPO}/master/${encodeURIComponent(
              current.path
            )}`;
            acc[langPart][category].files.push(current);
          } else {
            if (!acc[langPart]["default"])
              acc[langPart]["default"] = {
                url: `https://github.com/${USER}/${REPO}/tree/master`,
                files: [],
              };
            current.url = `https://raw.githubusercontent.com/${USER}/${REPO}/master/${encodeURIComponent(
              current.path
            )}`;
            acc[langPart]["default"].files.push(current);
          }
        }
        return acc;
      }
      return acc;
    },
    {}
  );
  if (!formatted[language]) return;
  const asArr = Object.entries(formatted[language]);
  return asArr;
}

type shaped = {
  [lang_code: string]: {
    [resourceType: string]: {
      [category: string]: Array<{
        name: string;
        sort: number | null;
        links: Array<{
          format: string;
          url: string;
          download?: string;
        }>;
      }>;

      // {
      //   [name: string]: {
      //     sort: number | null;
      //     format: string;
      //     url: string;
      //   }
      // };
    };
  };
};
/* 
topics: []
ot: [{
    name: 'Genesis',
    sort: 1,
    links: []
  }]
*/
export type ghFile = {
  path: string;
  type: "blob";
  sha: string;
  url: string;
  size?: number;
};
type githubReponse = {
  tree: Array<ghFile>;
};
// resource type -> reviewers guides
// category -> ot, nt, other

const reviewersGuideMeta = {
  en: {
    lang_code: "en",
    dir_name: "review-guide",
    dir_label: "Reviewers' Guide",
    books: {
      Genesis: {num: 1, anth: "ot"},
      Exodus: {num: 2, anth: "ot"},
      Leviticus: {num: 3, anth: "ot"},
      Numbers: {num: 4, anth: "ot"},
      Deuteronomy: {num: 5, anth: "ot"},
      Joshua: {num: 6, anth: "ot"},
      Judges: {num: 7, anth: "ot"},
      Ruth: {num: 8, anth: "ot"},
      "1 Samuel": {num: 9, anth: "ot"},
      "2 Samuel": {num: 10, anth: "ot"},
      "1 Kings": {num: 11, anth: "ot"},
      "2 Kings": {num: 12, anth: "ot"},
      "1 Chronicles": {num: 13, anth: "ot"},
      "2 Chronicles": {num: 14, anth: "ot"},
      Ezra: {num: 15, anth: "ot"},
      Nehemiah: {num: 16, anth: "ot"},
      Esther: {num: 17, anth: "ot"},
      Job: {num: 18, anth: "ot"},
      Psalms: {num: 19, anth: "ot"},
      Proverbs: {num: 20, anth: "ot"},
      Ecclesiastes: {num: 21, anth: "ot"},
      "Song of Songs": {num: 22, anth: "ot"},
      Isaiah: {num: 23, anth: "ot"},
      Jeremiah: {num: 24, anth: "ot"},
      Lamentations: {num: 25, anth: "ot"},
      Ezekiel: {num: 26, anth: "ot"},
      Daniel: {num: 27, anth: "ot"},
      Hosea: {num: 28, anth: "ot"},
      Joel: {num: 29, anth: "ot"},
      Amos: {num: 30, anth: "ot"},
      Obadiah: {num: 31, anth: "ot"},
      Jonah: {num: 32, anth: "ot"},
      Micah: {num: 33, anth: "ot"},
      Nahum: {num: 34, anth: "ot"},
      Habakkuk: {num: 35, anth: "ot"},
      Zephaniah: {num: 36, anth: "ot"},
      Haggai: {num: 37, anth: "ot"},
      Zechariah: {num: 38, anth: "ot"},
      Malachi: {num: 39, anth: "ot"},
      Matthew: {num: 41, anth: "nt"},
      Mark: {num: 42, anth: "nt"},
      Luke: {num: 43, anth: "nt"},
      John: {num: 44, anth: "nt"},
      Acts: {num: 45, anth: "nt"},
      Romans: {num: 46, anth: "nt"},
      "1 Corinthians": {num: 47, anth: "nt"},
      "2 Corinthians": {num: 48, anth: "nt"},
      Galatians: {num: 49, anth: "nt"},
      Ephesians: {num: 50, anth: "nt"},
      Philippians: {num: 51, anth: "nt"},
      Colossians: {num: 52, anth: "nt"},
      "1 Thessalonians": {num: 53, anth: "nt"},
      "2 Thessalonians": {num: 54, anth: "nt"},
      "1 Timothy": {num: 55, anth: "nt"},
      "2 Timothy": {num: 56, anth: "nt"},
      Titus: {num: 57, anth: "nt"},
      Philemon: {num: 58, anth: "nt"},
      Hebrews: {num: 59, anth: "nt"},
      James: {num: 60, anth: "nt"},
      "1 Peter": {num: 61, anth: "nt"},
      "2 Peter": {num: 62, anth: "nt"},
      "1 John": {num: 63, anth: "nt"},
      "2 John": {num: 64, anth: "nt"},
      "3 John": {num: 65, anth: "nt"},
      Jude: {num: 66, anth: "nt"},
      Revelation: {num: 67, anth: "nt"},
    },
  },
  fr: {
    lang_code: "fr",
    dir_name: "guide-des-réviseurs",
    dir_label: "Guide des Réviseurs",
    books: {
      Genèse: {num: 1, anth: "ot"},
      Exode: {num: 2, anth: "ot"},
      Lévitique: {num: 3, anth: "ot"},
      Nombres: {num: 4, anth: "ot"},
      Deutéronome: {num: 5, anth: "ot"},
      Josué: {num: 6, anth: "ot"},
      Juges: {num: 7, anth: "ot"},
      Ruth: {num: 8, anth: "ot"},
      "1 Samuel": {num: 9, anth: "ot"},
      "2 Samuel": {num: 10, anth: "ot"},
      "1 Rois": {num: 11, anth: "ot"},
      "2 Rois": {num: 12, anth: "ot"},
      "1 Chroniques": {num: 13, anth: "ot"},
      "2 Chroniques": {num: 14, anth: "ot"},
      Esdras: {num: 15, anth: "ot"},
      Néhémie: {num: 16, anth: "ot"},
      Esther: {num: 17, anth: "ot"},
      Job: {num: 18, anth: "ot"},
      Psaumes: {num: 19, anth: "ot"},
      Proverbes: {num: 20, anth: "ot"},
      Ecclésiaste: {num: 21, anth: "ot"},
      "Cantique des Cantiques": {num: 22, anth: "ot"},
      Ésaïe: {num: 23, anth: "ot"},
      Jérémie: {num: 24, anth: "ot"},
      Lamentations: {num: 25, anth: "ot"},
      Ézéchiel: {num: 26, anth: "ot"},
      Daniel: {num: 27, anth: "ot"},
      Osée: {num: 28, anth: "ot"},
      Joel: {num: 29, anth: "ot"},
      Amos: {num: 30, anth: "ot"},
      Abdias: {num: 31, anth: "ot"},
      Jonas: {num: 32, anth: "ot"},
      Michée: {num: 33, anth: "ot"},
      Nahum: {num: 34, anth: "ot"},
      Habacuc: {num: 35, anth: "ot"},
      Sophonie: {num: 36, anth: "ot"},
      Aggée: {num: 37, anth: "ot"},
      Zacharie: {num: 38, anth: "ot"},
      Malachie: {num: 39, anth: "ot"},
      Matthieu: {num: 41, anth: "nt"},
      Marc: {num: 42, anth: "nt"},
      Luc: {num: 43, anth: "nt"},
      Jean: {num: 44, anth: "nt"},
      Actes: {num: 45, anth: "nt"},
      Romains: {num: 46, anth: "nt"},
      "1 Corinthiens": {num: 47, anth: "nt"},
      "2 Corinthiens": {num: 48, anth: "nt"},
      Galates: {num: 49, anth: "nt"},
      Éphésiens: {num: 50, anth: "nt"},
      Philippiens: {num: 51, anth: "nt"},
      Colossiens: {num: 52, anth: "nt"},
      "1 Thessaloniciens": {num: 53, anth: "nt"},
      "2 Thessaloniciens": {num: 54, anth: "nt"},
      "1 Timothée": {num: 55, anth: "nt"},
      "2 Timothée": {num: 56, anth: "nt"},
      Tite: {num: 57, anth: "nt"},
      Philémon: {num: 58, anth: "nt"},
      Hébreux: {num: 59, anth: "nt"},
      Jacques: {num: 60, anth: "nt"},
      "1 Pierre": {num: 61, anth: "nt"},
      "2 Pierre": {num: 62, anth: "nt"},
      "1 Jean": {num: 63, anth: "nt"},
      "2 Jean": {num: 64, anth: "nt"},
      "3 Jean": {num: 65, anth: "nt"},
      Jude: {num: 66, anth: "nt"},
      Apocalypse: {num: 67, anth: "nt"},
    },
  },
  "es-419": {
    lang_code: "es-419",
    dir_name: "guía-de-los-revisores",
    dir_label: "Guía de los Revisores",
    books: {
      Génesis: {num: 1, anth: "ot"},
      Éxodo: {num: 2, anth: "ot"},
      Levítico: {num: 3, anth: "ot"},
      Números: {num: 4, anth: "ot"},
      Deuteronomio: {num: 5, anth: "ot"},
      Josué: {num: 6, anth: "ot"},
      Jueces: {num: 7, anth: "ot"},
      Rut: {num: 8, anth: "ot"},
      "1 Samuel": {num: 9, anth: "ot"},
      "2 Samuel": {num: 10, anth: "ot"},
      "1 Reyes": {num: 11, anth: "ot"},
      "2 Reyes": {num: 12, anth: "ot"},
      "1 Crónicas": {num: 13, anth: "ot"},
      "2 Crónicas": {num: 14, anth: "ot"},
      Esdras: {num: 15, anth: "ot"},
      Nehemías: {num: 16, anth: "ot"},
      Ester: {num: 17, anth: "ot"},
      Job: {num: 18, anth: "ot"},
      Salmos: {num: 19, anth: "ot"},
      Proverbios: {num: 20, anth: "ot"},
      Eclesiastés: {num: 21, anth: "ot"},
      "Cantar de los Cantares": {num: 22, anth: "ot"},
      Isaías: {num: 23, anth: "ot"},
      Jeremías: {num: 24, anth: "ot"},
      Lamentaciones: {num: 25, anth: "ot"},
      Ezequiel: {num: 26, anth: "ot"},
      Daniel: {num: 27, anth: "ot"},
      Oseas: {num: 28, anth: "ot"},
      Joel: {num: 29, anth: "ot"},
      Amós: {num: 30, anth: "ot"},
      Abdías: {num: 31, anth: "ot"},
      Jonás: {num: 32, anth: "ot"},
      Miqueas: {num: 33, anth: "ot"},
      Nahún: {num: 34, anth: "ot"},
      Habacuc: {num: 35, anth: "ot"},
      Sofonías: {num: 36, anth: "ot"},
      Ageo: {num: 37, anth: "ot"},
      Zacarías: {num: 38, anth: "ot"},
      Malaquías: {num: 39, anth: "ot"},
      Mateo: {num: 41, anth: "nt"},
      Marcos: {num: 42, anth: "nt"},
      Lucas: {num: 43, anth: "nt"},
      Juan: {num: 44, anth: "nt"},
      "Hechos de los Apóstoles": {num: 45, anth: "nt"},
      Romanos: {num: 46, anth: "nt"},
      "1 Corintios": {num: 47, anth: "nt"},
      "2 Corintios": {num: 48, anth: "nt"},
      Gálatas: {num: 49, anth: "nt"},
      Efesios: {num: 50, anth: "nt"},
      Filipenses: {num: 51, anth: "nt"},
      Colosenses: {num: 52, anth: "nt"},
      "1 Tesalonicenses": {num: 53, anth: "nt"},
      "2 Tesalonicenses": {num: 54, anth: "nt"},
      "1 Timoteo": {num: 55, anth: "nt"},
      "2 Timoteo": {num: 56, anth: "nt"},
      Tito: {num: 57, anth: "nt"},
      Filemón: {num: 58, anth: "nt"},
      Hebreos: {num: 59, anth: "nt"},
      Santiago: {num: 60, anth: "nt"},
      "1 Pedro": {num: 61, anth: "nt"},
      "2 Pedro": {num: 62, anth: "nt"},
      "1 Juan": {num: 63, anth: "nt"},
      "2 Juan": {num: 64, anth: "nt"},
      "3 Juan": {num: 65, anth: "nt"},
      Judas: {num: 66, anth: "nt"},
      Apocalipsis: {num: 67, anth: "nt"},
    },
  },
  ne: {
    lang_code: "ne",
    dir_name: "समीक्षकहरूको_गाईड",
    dir_label: "समीक्षकहरूको_गाईड",
    books: {
      "उत्पत्तिको पुस्तक": {num: 1, anth: "ot"},
      "प्रस्थानको पुस्तक": {num: 2, anth: "ot"},
      "लेवीहरूको पुस्तक": {num: 3, anth: "ot"},
      "गन्तीको पुस्तक": {num: 4, anth: "ot"},
      "व्यवस्थाको पुस्तक": {num: 5, anth: "ot"},
      "यहोशूको पुस्तक": {num: 6, anth: "ot"},
      "न्यायकर्ताहरूको पुस्तक": {num: 7, anth: "ot"},
      "रूथको पुस्तक": {num: 8, anth: "ot"},
      "१ शमूएलको पुस्तक": {num: 9, anth: "ot"},
      "२ शमूएलको पुस्तक": {num: 10, anth: "ot"},
      "१ राजाहरूको पुस्तक": {num: 11, anth: "ot"},
      "२ राजाहरूको पुस्तक": {num: 12, anth: "ot"},
      "१ इतिहासको पुस्तक": {num: 13, anth: "ot"},
      "२ इतिहासको पुस्तक": {num: 14, anth: "ot"},
      "एज्राको पुस्तक": {num: 15, anth: "ot"},
      "नहेम्याहको पुस्तक": {num: 16, anth: "ot"},
      "एस्तरको पुस्तक": {num: 17, anth: "ot"},
      "अय्यूबको पुस्तक": {num: 18, anth: "ot"},
      "भजनसंग्रहको पुस्तक": {num: 19, anth: "ot"},
      "हितोपदेशको पुस्तक": {num: 20, anth: "ot"},
      "उपदेशकको पुस्तक": {num: 21, anth: "ot"},
      "श्रेष्‍ठगीतको पुस्तक": {num: 22, anth: "ot"},
      "यशैयाको पुस्तक": {num: 23, anth: "ot"},
      "यर्मियाको पुस्तक": {num: 24, anth: "ot"},
      "विलापको पुस्तक": {num: 25, anth: "ot"},
      "इजकिएलको पुस्तक": {num: 26, anth: "ot"},
      "दानिएलको पुस्तक": {num: 27, anth: "ot"},
      "होशेको पुस्तक": {num: 28, anth: "ot"},
      "योएलको पुस्तक": {num: 29, anth: "ot"},
      "आमोसको पुस्तक": {num: 30, anth: "ot"},
      "ओबदियाको पुस्तक": {num: 31, anth: "ot"},
      "योनाको पुस्तक": {num: 32, anth: "ot"},
      "मिकाको पुस्तक": {num: 33, anth: "ot"},
      "नहूमको पुस्तक": {num: 34, anth: "ot"},
      "हबकूकको पुस्तक": {num: 35, anth: "ot"},
      "सपन्याहको पुस्तक": {num: 36, anth: "ot"},
      "हाग्‍गैको पुस्तक": {num: 37, anth: "ot"},
      "जकरियाको पुस्तक": {num: 38, anth: "ot"},
      "मलाकीको पुस्तक": {num: 39, anth: "ot"},
      "मत्तीले लेखेको सुसमाचार": {num: 41, anth: "nt"},
      "मर्कूसले लेखेको सुसमाचार": {num: 42, anth: "nt"},
      "लुकाले लेखेको सुसमाचार": {num: 43, anth: "nt"},
      "यूहन्‍नाले लेखेको सुसमाचार": {num: 44, anth: "nt"},
      "प्रेरितहरूका काम": {num: 45, anth: "nt"},
      "रोमीहरूलाई पावलको पत्र": {num: 46, anth: "nt"},
      "कोरिन्थीहरूलाई पावलको पहिलो पत्र": {num: 47, anth: "nt"},
      "कोरिन्थीहरूलाई पावलको दोस्रो पत्र": {num: 48, anth: "nt"},
      "गलातीहरूलाई पावलको पत्र": {num: 49, anth: "nt"},
      "एफिसिहरूलाई पावलको पत्र": {num: 50, anth: "nt"},
      "फिलिप्पीहरूलाई पावलको पत्र": {num: 51, anth: "nt"},
      "कलस्सीहरूलाई पावलको पत्र": {num: 52, anth: "nt"},
      "थेसलोनिकीहरूलाई पावलको पहिलो पत्र": {num: 53, anth: "nt"},
      "थेसलोनिकीहरूलाई पावलको दोस्रो पत्र": {num: 54, anth: "nt"},
      "तिमोथीलाई पावलको पाहिलो पत्र": {num: 55, anth: "nt"},
      "तिमोथीलाई पावलको दोस्रो पत्र": {num: 56, anth: "nt"},
      "तीतसलाई पावलको पत्र": {num: 57, anth: "nt"},
      "फिलेमोनलाई पावलको पत्र": {num: 58, anth: "nt"},
      "हिब्रूहरूका निम्ति पत्र": {num: 59, anth: "nt"},
      "याकूबको पत्र": {num: 60, anth: "nt"},
      "पत्रुसको पाहिलो पत्र": {num: 61, anth: "nt"},
      "पत्रुसको दोस्रो पत्र": {num: 62, anth: "nt"},
      "यूहन्‍नाको पहिलो पत्र": {num: 63, anth: "nt"},
      "यूहन्‍नाको दोस्रो पत्र": {num: 64, anth: "nt"},
      "यूहन्‍नाको तेस्रो पत्र": {num: 65, anth: "nt"},
      "यहूदाको पत्र": {num: 66, anth: "nt"},
      "यूहन्‍नालाई भएको प्रकाश": {num: 67, anth: "NT"},
    },
  },
  ru: {
    lang_code: "ru",
    dir_name: "Руководство-для-Рецензентов",
    dir_label: "Руководство для Рецензентов",
    books: {
      Бытие: {num: 1, anth: "ot"},
      Исход: {num: 2, anth: "ot"},
      Левит: {num: 3, anth: "ot"},
      Числа: {num: 4, anth: "ot"},
      Второзаконие: {num: 5, anth: "ot"},
      "Иисуса Навина": {num: 6, anth: "ot"},
      Судей: {num: 7, anth: "ot"},
      Руфь: {num: 8, anth: "ot"},
      "1-я Царств": {num: 9, anth: "ot"},
      "2-я Царств": {num: 10, anth: "ot"},
      "3-я Царств": {num: 11, anth: "ot"},
      "4-я Царств": {num: 12, anth: "ot"},
      "1-я Паралипоменон": {num: 13, anth: "ot"},
      "2-я Паралипоменон": {num: 14, anth: "ot"},
      Ездры: {num: 15, anth: "ot"},
      Неемии: {num: 16, anth: "ot"},
      Есфирь: {num: 17, anth: "ot"},
      Иова: {num: 18, anth: "ot"},
      Псалтырь: {num: 19, anth: "ot"},
      Притчи: {num: 20, anth: "ot"},
      Екклесиаст: {num: 21, anth: "ot"},
      "Песнь Песней": {num: 22, anth: "ot"},
      Исаии: {num: 23, anth: "ot"},
      Иеремии: {num: 24, anth: "ot"},
      "Плач Иеремии": {num: 25, anth: "ot"},
      Иезекииля: {num: 26, anth: "ot"},
      Даниила: {num: 27, anth: "ot"},
      Осии: {num: 28, anth: "ot"},
      Иоиля: {num: 29, anth: "ot"},
      Амоса: {num: 30, anth: "ot"},
      Авдия: {num: 31, anth: "ot"},
      Ионы: {num: 32, anth: "ot"},
      Михея: {num: 33, anth: "ot"},
      Наума: {num: 34, anth: "ot"},
      Аввакума: {num: 35, anth: "ot"},
      Софонии: {num: 36, anth: "ot"},
      Аггея: {num: 37, anth: "ot"},
      Захарии: {num: 38, anth: "ot"},
      Малахии: {num: 39, anth: "ot"},
      Матфея: {num: 41, anth: "nt"},
      Марка: {num: 42, anth: "nt"},
      Луки: {num: 43, anth: "nt"},
      Иоанна: {num: 44, anth: "nt"},
      Деяния: {num: 45, anth: "nt"},
      Римлянам: {num: 46, anth: "nt"},
      "1-е Коринфянам": {num: 47, anth: "nt"},
      "2-е Коринфянам": {num: 48, anth: "nt"},
      Галатам: {num: 49, anth: "nt"},
      Ефесянам: {num: 50, anth: "nt"},
      Филлипийцам: {num: 51, anth: "nt"},
      Колоссянам: {num: 52, anth: "nt"},
      "1-е Фессалоникийцам": {num: 53, anth: "nt"},
      "2-е Фессалоникийцам": {num: 54, anth: "nt"},
      "1-е Тимофею": {num: 55, anth: "nt"},
      "2-е Тимофею": {num: 56, anth: "nt"},
      Титу: {num: 57, anth: "nt"},
      Филимону: {num: 58, anth: "nt"},
      Евреям: {num: 59, anth: "nt"},
      Иакова: {num: 60, anth: "nt"},
      "1-е Петра": {num: 61, anth: "nt"},
      "2-е Петра": {num: 62, anth: "nt"},
      "1-е Иоанна": {num: 63, anth: "nt"},
      "2-е Иоанна": {num: 64, anth: "nt"},
      "3-е Иоанна": {num: 65, anth: "nt"},
      Иуды: {num: 66, anth: "nt"},
      Откровение: {num: 67, anth: "nt"},
    },
  },
};
