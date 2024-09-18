const en = {
  notYetTranslated:
    "This has not yet been translated. We are working to get it finished soon.",
  search: "Search...",
  requiredIndicator: "indicates required field",
  contactNameInput: "Name (optional)",
  contactNamePlaceholder: "Name",
  contactEmailInput: "Email",
  contactEmailPlaceholder: "Email",
  contactMessageInput: "Your Message",
  contactMessagePlaceholder: "Your message here...",
  successHtml: `<p>Your email was successfully submitted to our tech support team. We will contact you as soon as possible.</p><p>You may also reach us on our English | Français | 普通话 中文 | Portuguese Telegram channels.</p>`,
  contactSuccessTitle: "Thank you!",
  contactSuccessBody: `<p>Thank you for your message. We will get back to you as soon as possible.</p><p>You may also reach us on our English |(francés) | 普通话 (中文) | Portuguese Telegram channels.</p>`,
  contactSuccessButtonText: "Go Home",
  formFailed:
    "Something went wrong.  Please contact us through phone or email.",
  backToHome: "Go Home",
  submitForm: "Submit",
  ls_ResourceType: "Resource Type",
  ls_Loading: "Loading...",
  ls_LoadingPercent: "Loading ",
  ls_DownloadButton: "Download",
  ls_StartDownlaod: "Start Download",
  ls_OpenInDoc: "Open in DOC (external)",
  ls_DownloadOptionsTitle: "Download Options",
  ls_SourceZipOption: "Source (zip)",
  ls_SelectFormat: "Select a format",
  ls_FileType: "File Type",
  ls_IncludeAllBooks: "Include all books",
  ls_IncludeTranslationNotes: "Include Translation Notes",
  ls_GeneratingDocMessage: "Generating your file, please wait",
  ls_Cancel: "Cancel",
  ls_DocErredMsg:
    "Something went wrong. Your file couldn't be generated. You may try again or contact us",
  ls_AvailableForDownload: "Available for download",
  // todo: push a verison to prod that just maps resource type to a string here?
} as const;
export type i18nKeysType = keyof typeof en;
const ptbr: Record<i18nKeysType, string> = {
  ...en,
  notYetTranslated:
    "Isso ainda não foi traduzido. Estamos trabalhando para concluí-la em breve.",
  search: "Pesquisar...",
  ls_ResourceType: "Tipo de recurso",
  ls_Loading: "Carregando...",
  ls_LoadingPercent: "Carregando ",
  ls_DownloadButton: "Baixar",
  ls_StartDownlaod: "Baixar",
  ls_OpenInDoc: "Abrir em DOC (externo)",
  ls_DownloadOptionsTitle: "Opções de baixar",
  ls_SourceZipOption: "Fonte (zip)",
  ls_SelectFormat: "Selecione um formato",
  ls_FileType: "Tipo de arquivo",
  ls_IncludeAllBooks: "Incluir todos os livros",
  ls_IncludeTranslationNotes: "Incluir notas de tradução",
  ls_GeneratingDocMessage: "Gerando seu arquivo, aguarde",
  ls_Cancel: "Cancelar",
  ls_DocErredMsg:
    "Algo deu errado. Seu arquivo não pôde ser gerado. Você pode tentar novamente ou entrar em contato conosco",
  ls_AvailableForDownload: "Disponível para Download",
};
const es: Record<i18nKeysType, string> = {
  ...en,
  notYetTranslated:
    "No se ha traducido todavía. Estamos trabajando para finalizarlo pronto.",
  search: "Busca...",
};
const fr: Record<i18nKeysType, string> = {
  ...en,
  notYetTranslated:
    "Cet article n'a pas encore été traduit. Nous travaons pour le terminer à bientot.",
  search: "Recherche...",
};
const id: Record<i18nKeysType, string> = {
  ...en,
  notYetTranslated:
    "Ini belum diterjemahkan. Kami sedang berupaya untuk segera menyelesaikannya.",
  search: "Cari...",
};

export function getDict(lang: string, returnDefaultEn = false) {
  switch (lang) {
    case "es":
      return es;
    case "pt-br":
      return ptbr;
    case "fr":
      return fr;
    case "id":
      return id;
    case "en":
      return en;
    default:
      return returnDefaultEn ? en : undefined;
  }
}
export function getDictByAcceptHeader(acceptHeader: string) {
  const acceptHeaderLangs = acceptHeader
    .split(",")
    .map((str) => {
      const [lang, weight] = str.split(";").map((item) => item.trim());
      let weightNum = 1;
      if (weight) {
        let weightNumArr = weight.split("=");
        if (weightNumArr[1]) {
        }
      }
      // const weightNum = weight ? parseFloat(weight.split("=")[1]) : 1;
      return {lang, weight: isNaN(weightNum) ? 1 : weightNum};
    })
    .filter((item) => !!item.lang)
    .sort((a, b) => b.weight - a.weight)
    .map((item) => item.lang);

  const dict = acceptHeaderLangs.reduce(
    (prev: undefined | i18nDict, current, index, acceptHeaderLangs) => {
      return (
        prev || getDict(current || "", index === acceptHeaderLangs.length - 1)
      );
    },
    undefined
  );

  return dict;
}
export type i18nDict = Record<i18nKeysType, string>;
