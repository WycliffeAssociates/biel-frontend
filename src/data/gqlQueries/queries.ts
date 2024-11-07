const bielFilter = `show_on_biel: {_eq: true},status: {_eq: "Primary"}`;
const hasRenderings = "count: {predicate: {_gt: 0}}";

export const getLanguagesWithContentForBielQuery = (
	siteLanguageException: string,
) => `
query MyQuery {
  localization(
    where: {category: {_eq: "resource_type"}, ietf_code: {_eq: "${siteLanguageException}"}}
  ) {
    resourceTypeKey:key
    value
  }
  language(
    where: {
      contents_aggregate: {
      count: {
      predicate: {_gt: 0},
      filter: {
        wa_content_metadata: {
        ${bielFilter}
        },
        rendered_contents_aggregate: {
        ${hasRenderings}
        }
      }
    }
  }
}
    order_by: {english_name: asc}
  ) {
    english_name
    ietf_code
    national_name
    wa_language_metadata {
      is_gateway
    }
    contents(
      where: {wa_content_metadata: {${bielFilter}}}
      distinct_on: resource_type
    ) {
      resource_type
      name
    }
  }
}
`;

export type GetLanguagesWithContentForBielQueryReturn = {
	data: {
		localization: Localization[];
		language: Array<PubDataLanguageWithContents>;
	};
};

export const getLanguageContentsQuery = ({
	lang,
	siteLang,
}: {
	lang: string;
	siteLang: string;
}) => {
	return `
  query LangContents {
  localization(
    where: {category: {_eq: "resource_type"}, ietf_code: {_eq: "${siteLang}"}}
  ) {
    resourceTypeKey:key
    value
  }
  language(where: {ietf_code: {_eq: "${lang}"}}) {
    national_name
    english_name
    direction
    ietf_code
    wa_language_metadata {
      is_gateway
    }
    contents(
      where: {wa_content_metadata: {status: {_eq: "Primary"}, show_on_biel: {_eq: true}}, rendered_contents_aggregate: {count: {predicate: {_gt: 0}}}}
    ) {
      name
      type
      domain
      title
      resource_type
      gitRepo:git_repo {
      url:repo_url
    }
      rendered_contents {
        hash
        url
        scriptural_rendering_metadata {
          chapter
          book_slug
          book_name
        }
        file_type
        file_size_bytes
      }
    }
  }
}
  `;
};

export type GetLanguageContentsQueryReturn = {
	data: {
		localization: Omit<Localization, "ietf_code">[];
		language: PubDataLanguageWithContents[];
	};
};
export type PubDataLanguage = {
	national_name: string;
	english_name: string;
	direction: string;
	ietf_code: string;
	wa_language_metadata: {
		is_gateway: boolean;
	};
	resourceTypesAvailable: string[];
};
export type PubDataLanguageWithContents = PubDataLanguage & {
	contents: ContentRow[];
};
export type PubDataLanguageWithContentNames = PubDataLanguage & {
	contents: {
		name: string;
		resource_type: string;
	}[];
};
//=============== GetLangWithContentNames  =============
export const getLangWithContentNamesQuery = () => {
	return `
  
		query MyQuery {
    localization(
    where: {category: {_eq: "resource_type"}}
    ) {
    resourceTypeKey:key
    value
    ietf_code
     }
    language(
				where: {
					contents_aggregate: {
					count: {
					predicate: {_gt: 0},
					filter: {
						wa_content_metadata: {
						${bielFilter}
						},
						rendered_contents_aggregate: {
						${hasRenderings}
						}
					}
				}
			}
		}
				order_by: {english_name: asc}
			) {
				english_name
				ietf_code
				national_name
				wa_language_metadata {
					is_gateway
				}
				contents ( where: {wa_content_metadata: {status: {_eq: "Primary"}, show_on_biel: {_eq: true}}, rendered_contents_aggregate: {count: {predicate: {_gt: 0}}}}) {
					name
					type
					domain
					title
					resource_type
				}
			}
		}
  `;
};
export type getLangWithContentNamesQueryReturn = {
	data: {
		localization: Localization[];
		language: {
			english_name: string;
			ietf_code: string;
			national_name: string;
			wa_language_metadata: {
				is_gateway: boolean;
			};
			contents: Array<ContentRow & { displayName: string }>;
		}[];
	};
};

//=============== Shared query Rerturn types  =============
type Localization = {
	resourceTypeKey: string;
	value: string;
	ietf_code: string;
};
type ScripturalRenderingMeta = {
	chapter: string;
	book_slug: string;
	book_name: string;
};

export type ContentRow = {
	name: string;
	type: string;
	domain: string;
	title: string | undefined;
	resource_type: string;
	gitRepo?: {
		url: string;
	};
	rendered_contents: RenderedContentRow[];
};

export type RenderedContentRow = {
	hash: string;
	url: string;
	scriptural_rendering_metadata: ScripturalRenderingMeta | null;
	file_type: string;
	file_size_bytes: number;
};

export type RenderedContentRowsByType = {
	wholeChapterUrls: { [key: string]: RenderedContentRow };
	htmlChapters: RenderedContentRow[];
	wholeResourceRow: RenderedContentRow | null;
	usfmSources: RenderedContentRow[];
	otherFiles: RenderedContentRow[];
};

export type ContentCommon = {
	name: string;
	type: string;
	resource_type: string;
	// title comes from db directly and is manifest.yaml|json derived. DisplayName is form manually curated localization of resource types
	title: string | undefined;
	displayName: string;
	gitRepo?: {
		url: string;
	};
	rendered_contents: RenderedContentRowsByType;
};
export type domainScripture = ContentCommon & {
	domain: "scripture" | "gloss" | "parascriptural";
};
export type domainPeripheral = ContentCommon & {
	domain: "peripheral";
	// rendered_contents: RenderedContentRow[];
};

export type ContentsForLang = domainScripture | domainPeripheral;

export type LanguageForClient = {
	direction: "ltr" | "rtl";
	isGateway: boolean;
	code: string;
	englishName: string;
};
export type LangWithContent = {
	language: LanguageForClient;
	contents: ContentsForLang[];
};
