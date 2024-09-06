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
} as const;
type i18nKeysType = keyof typeof en;
const ptbr: Record<i18nKeysType, string> = {
  ...en,
  notYetTranslated:
    "Isso ainda não foi traduzido. Estamos trabalhando para concluí-la em breve.",
  search: "Pesquisar...",
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
