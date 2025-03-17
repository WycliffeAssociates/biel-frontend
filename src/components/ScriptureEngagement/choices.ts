import type { NonHiddenLanguageCodesType } from "@src/i18n/strings";

type LabelsType = Partial<Record<NonHiddenLanguageCodesType, string>>;

export type InputChoicesType = {
	[key: string]: {
		value: string; //always english?
		labels: LabelsType;
	}[];
};
const projectStatus = [
	{
		value: "neverWorked",
		labels: {
			en: "I have never worked on a translation with Wycliffe Associates",
			ptbr: "Nunca trabalhei em uma tradução com a Wycliffe Associates",
			es: "Nunca trabaje en una traducción con Wycliffe Associates",
			fr: "Je n'ai jamais travaillé sur une traduction avec Wycliffe Associates",
			id: "Saya belum pernah mengerjakan terjemahan dengan Wycliffe Associates",
		},
	},
	{
		value: "currentlyWorking",
		labels: {
			en: "I am currently working on a translation with Wycliffe Associates",
			ptbr: "Atualmente, estou trabalhando em uma tradução com a Wycliffe Associates",
			es: "Ahora estoy trabajando en una traducción con Wycliffe Associates",
			fr: "Me travaille actuellement sur une traduction avec Wycliffe Associates",
			id: "Saat ini saya sedang mengerjakan terjemahan dengan Wycliffe Associates",
		},
	},
	{
		value: "completed",
		labels: {
			en: "I have completed a translation with Wycliffe Associates",
			ptbr: "Ja fiz uma tradução com a Wycliffe Associates",
			es: "Ya he realizado una traducción con Wycliffe Associates",
			fr: "J'ai terminé une traduction avec Wycliffe Associates",
			id: "Saya telah menyelesaikan penerjemahan dengan Wycliffe Associates",
		},
	},
];
const languagesBibleReadIn = [
	{
		value: "In their gateway language",
		labels: {
			en: "In their gateway language",
			ptbr: "Em seu idioma de entrada",
			es: "En su idioma de entrada",
			fr: "Dans leur langue d'entrée",
			id: "Dalam bahasa gerbang mereka",
		},
	},
	{
		value: "In their mother-tongue language",
		labels: {
			en: "In their mother-tongue language",
			ptbr: "Em seu idioma materno",
			es: "En su idioma materno",
			fr: "Dans leur langue maternelle",
			id: "Dalam bahasa ibu mereka",
		},
	},
];
const commonReadingMethod = [
	{
		value: "Random Bible Verses",
		labels: {
			en: "Random Bible Verses",
			ptbr: "Versículos bíblicos aleatórios",
			es: "Versiculos aleatorios",
			fr: "Versets bibliques au hasard",
			id: "Ayat Alkitab Acak",
		},
	},
	{
		value: "Random Chapters",
		labels: {
			en: "Random Chapters",
			ptbr: "Capítulos aleatórios",
			es: "Capitulos aleatorios",
			fr: "Chapitres aléatoires",
			id: "Bab Acak",
		},
	},
	{
		value: "Start and Finish 1 Book",
		labels: {
			en: "Start and Finish 1 Book",
			ptbr: "Comece e termine 1 livro",
			es: "Empezar y terminar 1 libro",
			fr: "Commencer et finir 1 livre",
			id: "Mulai dan Selesai 1 Buku",
		},
	},
];
const toGuideLeadersWith = [
	{
		value: "Preaching",
		labels: {
			en: "Preaching",
			ptbr: "Pregação",
			es: "Predicación",
			fr: "Prédication",
			id: "Khotbah",
		},
	},
	{
		value: "Evangelism",
		labels: {
			en: "Evangelism",
			ptbr: "Evangelismo",
			es: "Evangelismo",
			fr: "Évangélisme",
			id: "Penginjilan",
		},
	},
	{
		value: "Church planting",
		labels: {
			en: "Church planting",
			ptbr: "Implantação de igrejas",
			es: "Plantación de iglesias",
			fr: "Implantation d'eglises",
			id: "Penanaman gereja",
		},
	},
	{
		value: "Bible study groups",
		labels: {
			en: "Bible study groups",
			ptbr: "Grupos de estudo bíblicos",
			es: "Grupos de estudio bíblico",
			fr: "Groupes d'étude biblique",
			id: "Kelompok belajar Alkitab",
		},
	},
	{
		value: "Leadership skills",
		labels: {
			en: "Leadership skills",
			ptbr: "Habilidades de liderança",
			es: "Habilidades de liderazgo",
			fr: "Compétences en leadership",
			id: "Keterampilan kepemimpinan",
		},
	},
	{
		value: "Discipleship",
		labels: {
			en: "Discipleship",
			ptbr: "Discipulado",
			es: "Discipulado",
			fr: "Discipulat",
			id: "Pemuridan",
		},
	},
];
const toGuideMembersWith = [
	{
		value: "Read the Bible more often",
		labels: {
			en: "Read the Bible more often",
			ptbr: "Ler o Bíblio mais vezes",
			es: "Lea la Biblia con más frecuencia",
			fr: "Lisez la Bible plus souvent",
			id: "Bacalah Alkitab lebih sering",
		},
	},
	{
		value: "Pray more",
		labels: {
			en: "Pray more",
			ptbr: "Orar mais",
			es: "Orar más",
			fr: "Priez davantage",
			id: "Berdoa lebih banyak",
		},
	},
	{
		value: "Study / Understand the Bible",
		labels: {
			en: "Study / Understand the Bible",
			ptbr: "Estudar / Compreender o Bíblio",
			es: "Estudiar / Entender la Biblia",
			fr: "Étudier / Comprendre la Bible",
			id: "Pelajari / Pahami Alkitab",
		},
	},
	{
		value: "Apply the Bible to transform lives",
		labels: {
			en: "Apply the Bible to transform lives",
			ptbr: "Aplicar o Bíblio para transformar vidas",
			es: "Aplicar la Biblia para transformar vidas",
			fr: "Appliquer la Bible pour transformer des vies",
			id: "Appliquer la Bible pour transformer des vies",
		},
	},
	{
		value: "Share the Gospel",
		labels: {
			en: "Share the Gospel",
			ptbr: "Compartilhe o Evangelho",
			es: "Comparte el Evangelio",
			fr: "Partagez l'Évangile",
			id: "Bagikan Injil",
		},
	},
];
export const whyNotReadBibleOutsideChurch = [
	{
		value: "Due to a lack of Bibles",
		labels: {
			en: "Due to a lack of Bibles",
			ptbr: "Devido à falta de Bíblias",
			es: "Debido a la falta de Biblias",
			fr: "En raison d'un manque de Bibles",
			id: "Karena kekurangan Alkitab",
		},
	},

	{
		value: "Due to a lack of guidance (no understanding, feeling overwhelmed)",
		labels: {
			en: "Due to a lack of guidance (no understanding, feeling overwhelmed)",
			ptbr: "Devido à falta de orientação (falta de compreensão, sensação de sobrecarga)",
			es: "Debido a la falta de orientación (falta de comprensión, sensación de estar abrumado)",
			fr: "En raison d'un manque de guidance (absence de compréhension, sentiment d'être dépassé)",
			id: "Karena kurangnya bimbingan (tidak memahami, merasa kewalahan)",
		},
	},
	{
		value: "Due to dependence on the pastor",
		labels: {
			en: "Due to dependence on the pastor",
			ptbr: "Devido à dependência do pastor",
			es: "Debido a la dependencia del pastor",
			fr: "En raison de la dépendance au pasteur",
			id: "Karena ketergantungan pada pendeta",
		},
	},
	{
		value: "Due to distractions or not enough time",
		labels: {
			en: "Due to distractions or not enough time",
			ptbr: "Devido a distrações ou falta de tempo",
			es: "Debido a distracciones o falta de tiempo",
			fr: "En raison des distractions ou du manque de temps",
			id: "Karena gangguan atau kurangnya waktu",
		},
	},
	{
		value: "Due to safety or concerns or persecution",
		labels: {
			en: "Due to safety or concerns or persecution",
			ptbr: "Devido à segurança, preocupações ou perseguição",
			es: "Debido a preocupaciones de seguridad o persecución",
			fr: "En raison de préoccupations de sécurité ou de persécution",
			id: "Karena masalah keamanan atau penganiayaan",
		},
	},
];
export const maturityLevels = [
	{
		value:
			"Spiritual Babies - They are new to Christianity and need to learn the basic truths of the Bible and to learn about Christian habits (disciplines) from a more mature Christian leader.",
		labels: {
			en: {
				main: "Spiritual Babies",
				explainer:
					"They are new to Christianity and need to learn the basic truths of the Bible and to learn about Christian habits (disciplines) from a more mature Christian leader.",
			},
			ptbr: {
				main: "Bebês Espirituais",
				explainer:
					"Eles são novos no Cristianismo e precisam aprender as verdades básicas da Bíblia e os hábitos cristãos (disciplinas) com um líder cristão mais maduro.",
			},
			es: {
				main: "Bebés Espirituales",
				explainer:
					"Son nuevos en el cristianismo y necesitan aprender las verdades básicas de la Biblia y los hábitos cristianos (disciplinas) de un líder cristiano más maduro.",
			},
			fr: {
				main: "Bébés Spirituels",
				explainer:
					"Ils sont nouveaux dans le christianisme et ont besoin d'apprendre les vérités fondamentales de la Bible et les habitudes chrétiennes (disciplines) auprès d'un leader chrétien plus mature.",
			},
			id: {
				main: "Bayi Rohani",
				explainer:
					"Mereka baru mengenal Kekristenan dan perlu belajar kebenaran dasar Alkitab serta kebiasaan Kristen (disiplin) dari pemimpin Kristen yang lebih matang.",
			},
		},
	},
	{
		value:
			"Spiritual Children - They know the basic truths but need help to regularly practice Christian habits (disciplines), be in a relationship with Christ, and learn how to personally increase their Biblical knowledge / familiarity (need less dependence on leadership).",
		labels: {
			en: {
				main: "Spiritual Children",
				explainer:
					"They know the basic truths but need help to regularly practice Christian habits (disciplines), be in a relationship with Christ, and learn how to personally increase their Biblical knowledge / familiarity (need less dependence on leadership).",
			},
			ptbr: {
				main: "Crianças Espirituais",
				explainer:
					"Eles conhecem as verdades básicas, mas precisam de ajuda para praticar regularmente os hábitos cristãos (disciplinas), ter um relacionamento com Cristo e aprender a aumentar pessoalmente seu conhecimento bíblico (menos dependência da liderança).",
			},
			es: {
				main: "Niños Espirituales",
				explainer:
					"Conocen las verdades básicas, pero necesitan ayuda para practicar regularmente los hábitos cristianos (disciplinas), tener una relación con Cristo y aprender a aumentar personalmente su conocimiento bíblico (menos dependencia del liderazgo).",
			},
			fr: {
				main: "Enfants Spirituels",
				explainer:
					"Ils connaissent les vérités fondamentales mais ont besoin d'aide pour pratiquer régulièrement les habitudes chrétiennes (disciplines), être en relation avec Christ et apprendre à accroître personnellement leur connaissance biblique (moins de dépendance à la direction).",
			},
			id: {
				main: "Anak-Anak Rohani",
				explainer:
					"Mereka mengetahui kebenaran dasar tetapi perlu bantuan untuk secara teratur menjalankan kebiasaan Kristen (disiplin), memiliki hubungan dengan Kristus, dan belajar meningkatkan pengetahuan Alkitab secara pribadi (kurang bergantung pada kepemimpinan).",
			},
		},
	},
	{
		value:
			"Spiritual Young Adults - They regularly practice Christian habits (disciplines), and they have a good understanding of what the Bible teaches. They are ready to either start their personal in-depth Bible studies, apply Scripture no matter what it commands, or help assist in ministry work.",
		labels: {
			en: {
				main: "Spiritual Young Adults",
				explainer:
					"They regularly practice Christian habits (disciplines), and they have a good understanding of what the Bible teaches. They need to (or are ready to) start their personal in-depth Bible studies, apply Scripture no matter what it commands, and help assist in ministry work.",
			},
			ptbr: {
				main: "Jovens Adultos Espirituais",
				explainer:
					"Eles praticam regularmente os hábitos cristãos (disciplinas) e têm um bom entendimento do que a Bíblia ensina. Eles precisam (ou estão prontos para) iniciar seus estudos bíblicos aprofundados, aplicar as Escrituras independentemente do que elas ordenam e ajudar no trabalho ministerial.",
			},
			es: {
				main: "Jóvenes Adultos Espirituales",
				explainer:
					"Practican regularmente los hábitos cristianos (disciplinas) y tienen un buen entendimiento de lo que enseña la Biblia. Necesitan (o están listos para) comenzar sus estudios bíblicos profundos, aplicar las Escrituras sin importar lo que manden y ayudar en el trabajo ministerial.",
			},
			fr: {
				main: "Jeunes Adultes Spirituels",
				explainer:
					"Ils pratiquent régulièrement les habitudes chrétiennes (disciplines) et ont une bonne compréhension de ce que la Bible enseigne. Ils doivent (ou sont prêts à) commencer leurs études bibliques approfondies, appliquer les Écritures quoi qu'elles commandent et aider dans le travail du ministère.",
			},
			id: {
				main: "Dewasa Muda Rohani",
				explainer:
					"Mereka secara teratur menjalankan kebiasaan Kristen (disiplin) dan memiliki pemahaman yang baik tentang ajaran Alkitab. Mereka perlu (atau siap untuk) memulai studi Alkitab yang mendalam, menerapkan Kitab Suci tanpa syarat, dan membantu dalam pekerjaan pelayanan.",
			},
		},
	},
	{
		value:
			"Spiritual Parents - They are fully mature in their faith and can lead others through teaching or discipling. They can answer questions about faith or find answers, correct error in love, and reflect Jesus well.",
		labels: {
			en: {
				main: "Spiritual Parents",
				explainer:
					"They are fully mature in their faith and can lead others through teaching or discipling. They can answer questions about faith or find answers, correct error in love, and reflect Jesus well.",
			},
			ptbr: {
				main: "Pais Espirituais",
				explainer:
					"Eles são totalmente maduros na fé e podem liderar outros por meio do ensino ou discipulado. Eles podem responder perguntas sobre a fé ou encontrar respostas, corrigir erros com amor e refletir bem a Jesus.",
			},
			es: {
				main: "Padres Espirituales",
				explainer:
					"Son completamente maduros en su fe y pueden guiar a otros a través de la enseñanza o el discipulado. Pueden responder preguntas sobre la fe o encontrar respuestas, corregir errores con amor y reflejar bien a Jesús.",
			},
			fr: {
				main: "Parents Spirituels",
				explainer:
					"Ils sont pleinement matures dans leur foi et peuvent guider les autres par l'enseignement ou le discipulat. Ils peuvent répondre aux questions sur la foi ou trouver des réponses, corriger les erreurs avec amour et bien refléter Jésus.",
			},
			id: {
				main: "Orang Tua Rohani",
				explainer:
					"Mereka sepenuhnya dewasa dalam iman dan dapat membimbing orang lain melalui pengajaran atau pemuridan. Mereka dapat menjawab pertanyaan tentang iman atau menemukan jawaban, mengoreksi kesalahan dengan kasih, dan mencerminkan Yesus dengan baik.",
			},
		},
	},
];
export const preferredContact = [
	{
		value: "email",
		labels: {
			en: "Email",
			ptbr: "E-mail",
			es: "Correo electrónico",
			fr: "E-mail",
			id: "Email",
		},
	},
	{
		value: "WhatsApp",
		labels: {
			en: "WhatsApp",
			ptbr: "WhatsApp",
			es: "WhatsApp",
			fr: "WhatsApp",
			id: "WhatsApp",
		},
	},
];
export const contactFallbackHelpMethods = [
	{
		value: "Translation Support",
		labels: {
			en: "Translation Support",
			ptbr: "Suporte à Tradução",
			es: "Soporte de Traducción",
			fr: "Support de Traduction",
			id: "Dukungan Terjemahan",
		},
	},
	{
		value: "Tech Support",
		labels: {
			en: "Tech Support",
			ptbr: "Suporte Técnico",
			es: "Soporte Técnico",
			fr: "Support Technique",
			id: "Dukungan Teknologi",
		},
	},
	{
		value: "Other",
		labels: {
			en: "Other",
			ptbr: "Outro",
			es: "Otro",
			fr: "Autre",
			id: "Lainnya",
		},
	},
];

export const inputChoices: InputChoicesType = {
	projectStatus: projectStatus,
	languagesBibleReadIn: languagesBibleReadIn,
	commonReadingMethod: commonReadingMethod,
	toGuideLeadersWith: toGuideLeadersWith,
	toGuideMembersWith: toGuideMembersWith,
	whyNotReadBibleOutsideChurch: whyNotReadBibleOutsideChurch,
	preferredContact: preferredContact,
	contactFallbackHelpMethods: contactFallbackHelpMethods,
} as const;

export const binaryChoiceLabels: Partial<
	Record<NonHiddenLanguageCodesType, { yes: string; no: string }>
> = {
	en: {
		yes: "Yes",
		no: "No",
	},
	es: {
		yes: "Si",
		no: "No",
	},
	"pt-br": {
		yes: "Sim",
		no: "Não",
	},
	fr: {
		yes: "Oui",
		no: "Non",
	},
	id: {
		yes: "Ya",
		no: "Tidak",
	},
};
export const getBinaryChoiceLabelsLocalized = (key: string) => {
	return (
		binaryChoiceLabels[key as NonHiddenLanguageCodesType] ||
		binaryChoiceLabels.en!
	);
};

export const questionLabels: Record<string, Record<string, string>> = {
	en: {
		currentlyWorking:
			"What is the current status of your translation project with Wycliffe Associates?",
		nearlyDoneRefining:
			"Are you nearly done with the refinement stage of your translation?",
		hasContactedScriptureAccessiblity:
			"Have you contacted the Scripture Accessibility department to arrange publication of your translation?",
		ideaOfUse:
			"Do you have an idea on how you would like to see your community use the translated Bible?",
		ideaOfUseSubLabel:
			"When you answer this question, think about your entire language group who will use this translated Bible.",
		namesOfAssessors: "Name of the person to contact",
		namesOfAssessorsSubLabel: "Separate names with commas (,)",
		langNameAndCode: "Language name and code",
		prefferredContact: "How do you prefer to be contacted?",
		email: "Email Address",
		phone: "WhatsApp Number",
		phoneSubLabel: "What is the best number for contacting you?",
		managerName: "Name of Project Manager",
		expectedLaunchDate: "Expected Bible launch date",
		expectedLaunchDateSubLabel:
			"Choose the date you expect to begin distributing your Bible",
		communityReligion: "What is the main religion in your community?",
		haveReadBibleOutsideChurch:
			"Do believers in your community read the Bible outside of church?",
		haveReadBibleOutsideChurchSubLabel:
			"Choose what is true for the majority of believers in your community.",
		languagesBibleReadIn:
			"In what language(s) has your community read the Bible?",
		languagesBibleReadInSubLabel: "Select all that apply",
		whyNotReadBibleOutsideChurch:
			"Please choose a reason why most believers in your community do not read the Bible outside of church.",
		whyNotReadBibleOutsideChurchSubLabel: "Select all that apply",
		commonReadingMethod: "What is a common reading method used?",
		commonReadingMethodSubLabel: "Select all that apply",
		whyReadThisWay: "Why do you think they read in this way?",
		desireToUse: "How do you desire for your community to use the Bible?",
		desireToUseSubLabel:
			"What would help your community better use their Bible?",
		wouldHelpBetterUse: "To guides pastors and leaders with:",
		toGuideLeadersWith:
			"Please indicate categories where resources would be helpful to guide pastors and leaders",
		toGuideLeadersWithSubLabel: "Select all that apply",
		toGuideMembersWith:
			"Please indicate categories where resources would be helpful to guide church members",
		toGuideMembersWithSubLabel: "Select all that apply",
		churchMembersToSelect: "For the church members to:",
		churchMembersToSelectSubLabel: "Select all that apply",
		questionsFromCommunity:
			"What questions about God or the Bible do you hear from your community?",
		questionsFromCommunitySubLabel:
			"We may have specific resources to share based on your answer",
		averageMaturity: "What is the average maturity level of believers?",
		inChargePrinting: "Who could be in charge of printing digital resources?",
		planToDistribute:
			"How do you plan to distribute the resources and to whom?",
		planToDistributeSubLabel:
			"Examples include digital copies, photocopies, printouts, etc.",
		otherLabel: "Other",
		contactFallbackMessage: "Your Message",
		contactFallbackHelpMethod: "How Can We Help You?",
	},
	ptbr: {
		currentlyWorking:
			"Qual é o status atual do seu projeto de tradução com a Wycliffe Associates?",
		nearlyDoneRefining:
			"Você está quase terminando a etapa de refinamento da sua tradução?",
		hasContactedScriptureAccessiblity:
			"Você entrou em contato com o departamento de Acessibilidade das Escrituras para organizar a publicação da sua tradução?",
		ideaOfUse:
			"Você tem uma ideia de como gostaria que sua comunidade usasse a Bíblia traduzida?",
		ideaOfUseSubLabel:
			"Quando responder a esta pergunta, pense em todo o grupo linguístico que usará essa Bíblia traduzida.",
		namesOfAssessors: "Nome da pessoa para contato",
		namesOfAssessorsSubLabel: "Separe os nomes com vírgulas (,)",
		langNameAndCode: "Nome e código da língua",
		prefferredContact: "Como prefere ser contatado?",
		email: "Endereço de E-mail",
		phone: "Número do WhatsApp",
		phoneSubLabel: "Qual é o melhor número para entrar em contato com você?",
		managerName: "Nome do Gerente de Projeto",
		expectedLaunchDate: "Data esperada de lançamento da Bíblia",
		expectedLaunchDateSubLabel:
			"Escolha a data em que você espera começar a distribuir a sua Bíblia",
		communityReligion: "Qual é a principal religião em sua comunidade?",
		haveReadBibleOutsideChurch:
			"Os crentes em sua comunidade leem a Bíblia fora da igreja?",
		haveReadBibleOutsideChurchSubLabel:
			"Escolha o que é verdade para a maioria dos crentes em sua comunidade.",
		languagesBibleReadIn: "Em qual(is) língua(s) sua comunidade leu a Bíblia?",
		languagesBibleReadInSubLabel: "Selecione todas as opções que se aplicam",
		whyNotReadBibleOutsideChurch:
			"Por favor, escolha uma razão pela qual a maioria dos crentes em sua comunidade não lê a Bíblia fora da igreja.",
		whyNotReadBibleOutsideChurchSubLabel:
			"Selecione todas as opções que se aplicam",
		commonReadingMethod: "Qual é o método comum de leitura utilizado?",
		commonReadingMethodSubLabel: "Selecione todos os métodos que se aplicam",
		whyReadThisWay: "Por que você acha que eles leem dessa maneira?",
		desireToUse: "Como você deseja que sua comunidade use a Bíblia?",
		desireToUseSubLabel:
			"O que ajudaria sua comunidade a usar melhor a Bíblia?",
		wouldHelpBetterUse: "Para guiar pastores e líderes com:",
		toGuideLeadersWith:
			"Por favor, indique as categorias onde recursos seriam úteis para guiar pastores e líderes",
		toGuideLeadersWithSubLabel: "Selecione todas as opções que se aplicam",
		toGuideMembersWith:
			"Por favor, indique as categorias onde recursos seriam úteis para guiar os membros da igreja",
		toGuideMembersWithSubLabel: "Selecione todas as opções que se aplicam",
		churchMembersToSelect: "Para os membros da igreja:",
		churchMembersToSelectSubLabel: "Selecione todas as opções que se aplicam",
		questionsFromCommunity:
			"Quais perguntas sobre Deus ou a Bíblia você ouve de sua comunidade?",
		questionsFromCommunitySubLabel:
			"Podemos ter recursos específicos para compartilhar com base na sua resposta",
		averageMaturity: "Qual é o nível médio de maturidade dos crentes?",
		inChargePrinting:
			"Quem poderia ficar responsável pela impressão dos recursos digitais?",
		planToDistribute: "Como você planeja distribuir os recursos e para quem?",
		planToDistributeSubLabel:
			"Exemplos incluem cópias digitais, fotocópias, impressões, etc.",
		otherLabel: "Outro",
		contactFallbackMessage: "Sua Mensagem",
		contactFallbackHelpMethod: "Como Podemos Ajudá-lo?",
	},
	fr: {
		currentlyWorking:
			"Quel est l'état actuel de votre projet de traduction avec Wycliffe Associates ?",
		nearlyDoneRefining:
			"Êtes-vous presque terminé avec l'étape de raffinage de votre traduction ?",
		hasContactedScriptureAccessiblity:
			"Avez-vous contacté le département Accessibilité des Écritures pour organiser la publication de votre traduction ?",
		ideaOfUse:
			"Avez-vous une idée de la manière dont vous souhaitez que votre communauté utilise la Bible traduite ?",
		ideaOfUseSubLabel:
			"Lorsque vous répondez à cette question, pensez à l'ensemble de votre groupe linguistique qui utilisera cette Bible traduite.",
		namesOfAssessors: "Nom de la personne à contacter",
		namesOfAssessorsSubLabel: "Séparez les noms par des virgules (,)",
		langNameAndCode: "Nom et code de la langue",
		prefferredContact: "Comment préférez-vous être contacté ?",
		email: "Adresse e-mail",
		phone: "Numéro WhatsApp",
		phoneSubLabel: "Quel est le meilleur numéro pour vous contacter ?",
		managerName: "Nom du responsable du projet",
		expectedLaunchDate: "Date prévue de lancement de la Bible",
		expectedLaunchDateSubLabel:
			"Choisissez la date à laquelle vous prévoyez de commencer à distribuer votre Bible",
		communityReligion:
			"Quelle est la principale religion de votre communauté ?",
		haveReadBibleOutsideChurch:
			"Les croyants de votre communauté lisent-ils la Bible en dehors de l'église ?",
		haveReadBibleOutsideChurchSubLabel:
			"Choisissez ce qui est vrai pour la majorité des croyants de votre communauté.",
		languagesBibleReadIn:
			"Dans quelle(s) langue(s) votre communauté a-t-elle lu la Bible ?",
		languagesBibleReadInSubLabel:
			"Sélectionnez toutes les options qui s'appliquent",
		whyNotReadBibleOutsideChurch:
			"Veuillez choisir une raison pour laquelle la plupart des croyants de votre communauté ne lisent pas la Bible en dehors de l'église.",
		whyNotReadBibleOutsideChurchSubLabel:
			"Sélectionnez toutes les options qui s'appliquent",
		commonReadingMethod: "Quelle est la méthode de lecture courante utilisée ?",
		commonReadingMethodSubLabel:
			"Sélectionnez toutes les options qui s'appliquent",
		whyReadThisWay: "Pourquoi pensez-vous qu'ils lisent de cette manière ?",
		desireToUse:
			"Comment souhaitez-vous que votre communauté utilise la Bible ?",
		desireToUseSubLabel:
			"Qu'est-ce qui aiderait votre communauté à mieux utiliser la Bible ?",
		wouldHelpBetterUse: "Pour guider les pasteurs et les leaders avec :",
		toGuideLeadersWith:
			"Veuillez indiquer les catégories où des ressources seraient utiles pour guider les pasteurs et les leaders",
		toGuideLeadersWithSubLabel:
			"Sélectionnez toutes les options qui s'appliquent",
		toGuideMembersWith:
			"Veuillez indiquer les catégories où des ressources seraient utiles pour guider les membres de l'église",
		toGuideMembersWithSubLabel:
			"Sélectionnez toutes les options qui s'appliquent",
		churchMembersToSelect: "Pour les membres de l'église :",
		churchMembersToSelectSubLabel:
			"Sélectionnez toutes les options qui s'appliquent",
		questionsFromCommunity:
			"Quelles questions sur Dieu ou la Bible entendez-vous de la part de votre communauté ?",
		questionsFromCommunitySubLabel:
			"Nous pourrions avoir des ressources spécifiques à partager en fonction de votre réponse",
		averageMaturity: "Quel est le niveau moyen de maturité des croyants ?",
		inChargePrinting:
			"Qui pourrait être responsable de l'impression des ressources numériques ?",
		planToDistribute:
			"Comment prévoyez-vous de distribuer les ressources et à qui ?",
		planToDistributeSubLabel:
			"Des exemples incluent des copies numériques, des photocopies, des impressions, etc.",
		otherLabel: "Autre",
		contactFallbackMessage: "Votre message",
		contactFallbackHelpMethod: "Comment pouvons-nous vous aider ?",
	},
	es: {
		currentlyWorking:
			"¿Cuál es el estado actual de tu proyecto de traducción con Wycliffe Associates?",
		nearlyDoneRefining:
			"¿Estás casi terminado con la etapa de refinamiento de tu traducción?",
		hasContactedScriptureAccessiblity:
			"¿Has contactado con el departamento de Accesibilidad de las Escrituras para organizar la publicación de tu traducción?",
		ideaOfUse:
			"¿Tienes una idea de cómo te gustaría que tu comunidad usara la Biblia traducida?",
		ideaOfUseSubLabel:
			"Cuando respondas a esta pregunta, piensa en todo tu grupo lingüístico que usará esta Biblia traducida.",
		namesOfAssessors: "Nombre de la persona para contactar",
		namesOfAssessorsSubLabel: "Separa los nombres con comas (,)",
		langNameAndCode: "Nombre y código del idioma",
		prefferredContact: "¿Cómo prefieres ser contactado?",
		email: "Dirección de correo electrónico",
		phone: "Número de WhatsApp",
		phoneSubLabel: "¿Cuál es el mejor número para contactarte?",
		managerName: "Nombre del gerente del proyecto",
		expectedLaunchDate: "Fecha prevista de lanzamiento de la Biblia",
		expectedLaunchDateSubLabel:
			"Elige la fecha en que esperas comenzar a distribuir tu Biblia",
		communityReligion: "¿Cuál es la religión principal en tu comunidad?",
		haveReadBibleOutsideChurch:
			"¿Los creyentes de tu comunidad leen la Biblia fuera de la iglesia?",
		haveReadBibleOutsideChurchSubLabel:
			"Elige lo que es cierto para la mayoría de los creyentes en tu comunidad.",
		languagesBibleReadIn: "¿En qué idioma(s) ha leído tu comunidad la Biblia?",
		languagesBibleReadInSubLabel: "Selecciona todas las opciones que apliquen",
		whyNotReadBibleOutsideChurch:
			"Por favor, elige una razón por la cual la mayoría de los creyentes en tu comunidad no leen la Biblia fuera de la iglesia.",
		whyNotReadBibleOutsideChurchSubLabel:
			"Selecciona todas las opciones que apliquen",
		commonReadingMethod: "¿Cuál es el método de lectura común utilizado?",
		commonReadingMethodSubLabel: "Selecciona todos los métodos que apliquen",
		whyReadThisWay: "¿Por qué crees que leen de esta manera?",
		desireToUse: "¿Cómo deseas que tu comunidad use la Biblia?",
		desireToUseSubLabel: "¿Qué ayudaría a tu comunidad a usar mejor su Biblia?",
		wouldHelpBetterUse: "Para guiar a pastores y líderes con:",
		toGuideLeadersWith:
			"Por favor, indica las categorías donde los recursos serían útiles para guiar a pastores y líderes",
		toGuideLeadersWithSubLabel: "Selecciona todas las opciones que apliquen",
		toGuideMembersWith:
			"Por favor, indica las categorías donde los recursos serían útiles para guiar a los miembros de la iglesia",
		toGuideMembersWithSubLabel: "Selecciona todas las opciones que apliquen",
		churchMembersToSelect: "Para los miembros de la iglesia:",
		churchMembersToSelectSubLabel: "Selecciona todas las opciones que apliquen",
		questionsFromCommunity:
			"¿Qué preguntas sobre Dios o la Biblia escuchas de tu comunidad?",
		questionsFromCommunitySubLabel:
			"Podemos tener recursos específicos para compartir con base en tu respuesta",
		averageMaturity: "¿Cuál es el nivel promedio de madurez de los creyentes?",
		inChargePrinting:
			"¿Quién podría estar a cargo de imprimir los recursos digitales?",
		planToDistribute: "¿Cómo planeas distribuir los recursos y a quién?",
		planToDistributeSubLabel:
			"Ejemplos incluyen copias digitales, fotocopias, impresiones, etc.",
		otherLabel: "Otro",
		contactFallbackMessage: "Tu mensaje",
		contactFallbackHelpMethod: "¿Cómo podemos ayudarte?",
	},
	id: {
		currentlyWorking:
			"Apa status terkini dari proyek terjemahan Anda dengan Wycliffe Associates?",
		nearlyDoneRefining:
			"Apakah Anda hampir selesai dengan tahap penyempurnaan terjemahan Anda?",
		hasContactedScriptureAccessiblity:
			"Apakah Anda sudah menghubungi departemen Aksesibilitas Alkitab untuk mengatur publikasi terjemahan Anda?",
		ideaOfUse:
			"Apakah Anda memiliki ide tentang bagaimana Anda ingin komunitas Anda menggunakan Alkitab terjemahan?",
		ideaOfUseSubLabel:
			"Ketika menjawab pertanyaan ini, pikirkan seluruh kelompok bahasa Anda yang akan menggunakan Alkitab terjemahan ini.",
		namesOfAssessors: "Nama orang yang dapat dihubungi",
		namesOfAssessorsSubLabel: "Pisahkan nama dengan koma (,)",
		langNameAndCode: "Nama dan kode bahasa",
		prefferredContact: "Bagaimana Anda lebih suka dihubungi?",
		email: "Alamat E-mail",
		phone: "Nomor WhatsApp",
		phoneSubLabel: "Nomor terbaik untuk menghubungi Anda?",
		managerName: "Nama Manajer Proyek",
		expectedLaunchDate: "Tanggal peluncuran Alkitab yang diharapkan",
		expectedLaunchDateSubLabel:
			"Pilih tanggal yang Anda harapkan untuk mulai mendistribusikan Alkitab Anda",
		communityReligion: "Apa agama utama di komunitas Anda?",
		haveReadBibleOutsideChurch:
			"Apakah orang percaya di komunitas Anda membaca Alkitab di luar gereja?",
		haveReadBibleOutsideChurchSubLabel:
			"Pilih apa yang benar untuk sebagian besar orang percaya di komunitas Anda.",
		languagesBibleReadIn:
			"Dalam bahasa apa saja komunitas Anda membaca Alkitab?",
		languagesBibleReadInSubLabel: "Pilih semua yang berlaku",
		whyNotReadBibleOutsideChurch:
			"Pilih alasan mengapa sebagian besar orang percaya di komunitas Anda tidak membaca Alkitab di luar gereja.",
		whyNotReadBibleOutsideChurchSubLabel: "Pilih semua yang berlaku",
		commonReadingMethod: "Apa metode pembacaan umum yang digunakan?",
		commonReadingMethodSubLabel: "Pilih semua yang berlaku",
		whyReadThisWay: "Mengapa Anda pikir mereka membaca dengan cara ini?",
		desireToUse: "Bagaimana Anda ingin komunitas Anda menggunakan Alkitab?",
		desireToUseSubLabel:
			"Apa yang dapat membantu komunitas Anda menggunakan Alkitab dengan lebih baik?",
		wouldHelpBetterUse: "Untuk membimbing pendeta dan pemimpin dengan:",
		toGuideLeadersWith:
			"Tolong pilih kategori dimana sumber daya akan membantu untuk membimbing pendeta dan pemimpin",
		toGuideLeadersWithSubLabel: "Pilih semua yang berlaku",
		toGuideMembersWith:
			"Tolong pilih kategori dimana sumber daya akan membantu untuk membimbing anggota gereja",
		toGuideMembersWithSubLabel: "Pilih semua yang berlaku",
		churchMembersToSelect: "Untuk anggota gereja:",
		churchMembersToSelectSubLabel: "Pilih semua yang berlaku",
		questionsFromCommunity:
			"Apa pertanyaan tentang Tuhan atau Alkitab yang Anda dengar dari komunitas Anda?",
		questionsFromCommunitySubLabel:
			"Kami mungkin memiliki sumber daya spesifik untuk dibagikan berdasarkan jawaban Anda",
		averageMaturity: "Apa tingkat kematangan rata-rata dari orang percaya?",
		inChargePrinting:
			"Siapa yang bisa bertanggung jawab untuk mencetak sumber daya digital?",
		planToDistribute:
			"Bagaimana Anda berencana untuk mendistribusikan sumber daya dan kepada siapa?",
		planToDistributeSubLabel:
			"Contoh termasuk salinan digital, fotokopi, cetakan, dll.",
		otherLabel: "Lainnya",
		contactFallbackMessage: "Pesan Anda",
		contactFallbackHelpMethod: "Bagaimana kami bisa membantu Anda?",
	},
};
