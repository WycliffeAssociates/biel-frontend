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
  formFailed: "Something went wrong.  Please contact us.",
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
export function getDict(lang: string) {
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
      return en;
  }
}
export type i18nDict = Record<i18nKeysType, string>;
