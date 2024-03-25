const en = {
  notYetTranslated:
    "This has not yet been translated. We are working to get it finished soon.",
  search: "Search...",
} as const;
type i18nKeysType = keyof typeof en;
const ptbr: Record<i18nKeysType, string> = {
  notYetTranslated:
    "Isso ainda não foi traduzido. Estamos trabalhando para concluí-la em breve.",
  search: "Pesquisar...",
};
const es: Record<i18nKeysType, string> = {
  notYetTranslated:
    "No se ha traducido todavía. Estamos trabajando para finalizarlo pronto.",
  search: "Busca...",
};
const fr: Record<i18nKeysType, string> = {
  notYetTranslated:
    "Cet article n'a pas encore été traduit. Nous travaons pour le terminer à bientot.",
  search: "Recherche...",
};
const id: Record<i18nKeysType, string> = {
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
