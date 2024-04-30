export type MenuItem = {
  ID: number;
  post_author: string;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: string;
  comment_status: string;
  ping_status: string;
  post_password: string;
  post_name: string;
  to_ping: string;
  pinged: string;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_type: string;
  post_mime_type: string;
  comment_count: string;
  filter: string;
  db_id: number;
  menu_item_parent: string;
  object_id: string;
  object: string;
  type: string;
  type_label: string;
  url: string;
  title: string;
  target: string;
  attr_title: string;
  description: string;
  classes: string[];
  xfn: string;
  children?: MenuItem[];
  attached_post: {
    post_id: string;
    post_title: string;
    post_name: string;
    post_parent: number;
    uri: string;
  } | null;
  slug?: string;
  icon?: string;
  featured_description?: string;
  is_featured?: boolean;
  parent_description?: string;
};

export type Menu = {
  term_id: number;
  name: string;
  slug: string;
  term_group: number;
  term_taxonomy_id: number;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
  filter: string;
  items: MenuItem[];
  featured_items: MenuItem[];
  non_featured_items: MenuItem[];
};

export type WPMLMenu = {
  [language: string]: Record<string, Menu>;
};
export type languageType = {
  code: string;
  country_flag_url: string;
  default_locale: string;
  id: string;
  language_code: string;
  native_name: string;
  translated_name: string;
  localizedUrl?: string;
};

export type WpPage = {
  databaseId: number;
  slug: string;
  title: string;
  modified: string;
  status: string;
  parentDatabaseId: number | null;
  link: string;
  languageCode: string;
  pageOptions: {
    topBlurb?: string;
  };
  uri: string;
  editorBlocks: EditorBlock[];
  translations: Translation[];
  otherVersions: Record<string, string>;
  inlineStyles?: string[];
  translationOfId: number;
  isHomePage: boolean;
  isTranslationPage: boolean;
};
type EditorBlock = {
  parentClientId: null | string;
  name: string;
  renderedHtml: string;
};

type Translation = {
  title: string;
  databaseId: number;
  slug: string;
  status: string;
  link: string;
  languageCode: string;
  uri: string;
  translationOfId: number;
  otherVersions: Record<string, string>;
  modified: string;
  parentDatabaseId: number | null;
  isTranslationPage: boolean;
  isHomePage: boolean;
  editorBlocks: EditorBlock[];
};

export type footerType = {
  global: {
    content: string;
    link: string;
    translations: Array<{languageCode: string; content: string}>;
  };
};

export type ScriptureLink = {
  format: string;
  url: string;
};

export type Subcontent = {
  category: string;
  code: string;
  sort: number;
  name: string;
  links: ScriptureLink[];
};

export type Content = {
  subcontents: Subcontent[];
  code: string;
  subject: string;
  name: string;
  links: any[];
  checkingLevel: number;
};

export type Language = {
  name: string;
  code: string;
  direction: string;
  contents: Content[];
  englishName: string;
};
export type translationPageOldEntry = {
  code: string;
  name: string;
  englishName: string;
  direction: string | null;
  contents: Content[];
};
