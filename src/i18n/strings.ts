const en = {
  notYetTranslated:
    "This has not yet been translated. We are working to get it finished soon.",
  search: "Search...",
  goToSearch: "Search",
  localizeTo: "Search in",
  requiredIndicator: "indicates required field",
  contactNameInput: "Name (optional)",
  contactNamePlaceholder: "Name",
  contactEmailInput: "Email",
  contactEmailPlaceholder: "Email",
  contactMessageInput: "Your Message",
  contactMessagePlaceholder: "Your message here...",
  successHtml:
    "<p>Your email was successfully submitted to our tech support team. We will contact you as soon as possible.</p><p>You may also reach us on our English | Français | 普通话 中文 | Portuguese Telegram channels.</p>",
  contactSuccessTitle: "Thank you!",
  contactSuccessBody:
    "<p>Thank you for your message. We will get back to you as soon as possible.</p><p>You may also reach us on our English |(francés) | 普通话 (中文) | Portuguese Telegram channels.</p>",
  contactSuccessButtonText: "Go Home",
  formFailed:
    "Something went wrong.  Please contact us through phone or email.",
  backToHome: "Go Home",
  submitForm: "Submit",
  resource: "Resource",
  resources: "Resources",
  page: "Page",
  pages: "Pages",
  software: "Software",
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
  ls_Navigate: "Navigate",
  ls_AvailableForDownload: "Available for download",
  rl_ChooseALanguage: "Choose a language",
  rl_SearchPlaceholder: "Search by Name, Code, etc...",
  rl_Filter: "Filter",
  rl_GatewayLanguage: "Gateway Language",
  rl_HeartLanguage: "Heart Language",
  rl_Sort: "Sort",
  rl_A_Z: "A - Z",
  rl_Z_A: "Z - A",
  rl_IeftCode: "Code",
  rl_LangName: "Language Name",
  rl_Anglicized: "Anglicized Name",
} as const;
export type i18nKeysType = keyof typeof en;
const ptbr: Record<i18nKeysType, string> = {
  ...en,
  notYetTranslated:
    "Isso ainda não foi traduzido. Estamos trabalhando para concluí-la em breve.",
  search: "Pesquisar...",
  resource: "Recurso",
  resources: "Recursos",
  page: "Página",
  pages: "Páginas",
  software: "Software",
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
  ls_Navigate: "Navegar",
  ls_DocErredMsg:
    "Algo deu errado. Seu arquivo não pôde ser gerado. Você pode tentar novamente ou entrar em contato conosco",
  ls_AvailableForDownload: "Disponível para Download",
  rl_ChooseALanguage: "Escolha um idioma",
  rl_SearchPlaceholder: "Pesquisar por Nome, Código, etc...",
  rl_Filter: "Filtros",
  rl_GatewayLanguage: "Idioma do gateway",
  rl_HeartLanguage: "Linguagem do coração",
  rl_Sort: "Classificar",
  rl_A_Z: "A - Z",
  rl_Z_A: "Z - A",
  rl_IeftCode: "Código",
  rl_LangName: "Nome do idioma",
  rl_Anglicized: "Nome anglicizado",
};
const es: Record<i18nKeysType, string> = {
  ...en,
  notYetTranslated:
    "This aún no se ha traducido. Estamos trabajando para terminarlo pronto",
  search: "Buscar...",
  requiredIndicator: "indica campo obligatorio",
  contactNameInput: "Nombre (opcional)",
  contactNamePlaceholder: "Nombre",
  contactEmailInput: "Email",
  contactEmailPlaceholder: "Email",
  contactMessageInput: "Su Mensaje",
  contactMessagePlaceholder: "Su mensaje aquí...",
  successHtml:
    "<p>Su correo electrónico fue enviado con éxito a nuestro equipo de soporte técnico. Nos pondremos en contacto contigo lo antes posible.</p><p>También puedes ponerte en contacto con nosotros en nuestros canales de Telegram en inglés | Français | 普通话 中文 | portugués.</p>",
  contactSuccessTitle: "¡Gracias!",
  contactSuccessBody:
    "<p>Gracias por tu mensaje. Nos pondremos en contacto contigo lo antes posible.</p><p>También puedes contactar con nosotros en nuestros canales de Telegram en inglés |(francés) | 普通话 (中文) | portugués.</p>",
  contactSuccessButtonText: "Go Home",
  formFailed:
    "Something ha ido mal.  Por favor, ponte en contacto con nosotros a través del teléfono o correo electrónico.",
  backToHome: "Volver a casa",
  submitForm: "Enviar",
  resource: "Recurso",
  resources: "Recursos",
  page: "Página",
  pages: "Páginas",
  software: "Software",
  ls_ResourceType: "Tipo de recurso",
  ls_Loading: "Cargando",
  ls_LoadingPercent: "Cargando",
  ls_DownloadButton: "Descargando",
  ls_StartDownlaod: "Iniciar descarga",
  ls_OpenInDoc: "Abrir en DOC (externo)",
  ls_DownloadOptionsTitle: "Opciones de descarga",
  ls_SourceZipOption: "Fuente (zip)",
  ls_SelectFormat: "Selecciona un formato",
  ls_FileType: "Tipo de archivo",
  ls_IncludeAllBooks: "Incluir todos los libros",
  ls_IncludeTranslationNotes: "Incluir notas de traducción",
  ls_GeneratingDocMessage: "Generando su archivo, por favor espere",
  ls_Cancel: "Cancelar",
  ls_DocErredMsg:
    "Something ha ido mal. No se ha podido generar su archivo. Puede intentarlo de nuevo o ponerse en contacto con nosotros",
  ls_Navigate: "Navegar",
  ls_AvailableForDownload: "Disponible para descarga",
  rl_ChooseALanguage: "Elige un idioma",
  rl_SearchPlaceholder: "Buscar por nombre, código, etc...",
  rl_Filter: "Filtro",
  rl_GatewayLanguage: "Idioma de la puerta de enlace",
  rl_HeartLanguage: "Idioma del Corazón",
  rl_Sort: "Ordenar",
  rl_A_Z: "A - Z",
  rl_Z_A: "Z - A",
  rl_IeftCode: "Código",
  rl_LangName: "Nombre del idioma",
  rl_Anglicized: "Nombre anglicismo",
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
      const weightNum = 1;
      if (weight) {
        const weightNumArr = weight.split("=");
        if (weightNumArr[1]) {
        }
      }
      // const weightNum = weight ? parseFloat(weight.split("=")[1]) : 1;
      return {lang, weight: Number.isNaN(weightNum) ? 1 : weightNum};
    })
    .filter((item) => !!item.lang)
    .sort((a, b) => b.weight - a.weight)
    .map((item) => item.lang);

  const dict = acceptHeaderLangs.reduce(
    (prev: undefined | i18nDictType, current, index, acceptHeaderLangs) => {
      return (
        prev || getDict(current || "", index === acceptHeaderLangs.length - 1)
      );
    },
    undefined
  );

  return dict;
}
export type i18nDictType = Record<i18nKeysType, string>;

// NOTE: MANUAL MAINTENANCE
export const nonHiddenLanguageCodes = ["en", "es", "pt-br", "fr", "id"];
