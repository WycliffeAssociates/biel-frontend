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
		},
	},
	{
		value: "currentlyWorking",
		labels: {
			en: "I am currently working on a translation with Wycliffe Associates",
		},
	},
	{
		value: "completed",
		labels: {
			en: "I have completed a translation with Wycliffe Associates",
		},
	},
];
const languagesBibleReadIn = [
	{
		value: "In their gateway language",
		labels: {
			en: "In their gateway language",
		},
	},
	{
		value: "In there mother-tongue language",
		labels: {
			en: "In there mother-tongue language",
		},
	},
];
const commonReadingMethod = [
	{
		value: "Random Bible Verses",
		labels: {
			en: "Random Bible Verses",
		},
	},
	{
		value: "Random Chapters",
		labels: {
			en: "Random Chapters",
		},
	},
	{
		value: "Start and Finish 1 Book",
		labels: {
			en: "Start and Finish 1 Book",
		},
	},
];
const toGuideLeadersWith = [
	{
		value: "Preaching",
		labels: {
			en: "Preaching",
		},
	},
	{
		value: "Evangelism",
		labels: {
			en: "Evangelism",
		},
	},
	{
		value: "Church Planting",
		labels: {
			en: "Church Planting",
		},
	},
	{
		value: "Bible study groups",
		labels: {
			en: "Bible study groups",
		},
	},
	{
		value: "Leadership skills",
		labels: {
			en: "Leadership skills",
		},
	},
	{
		value: "Displeship",
		labels: {
			en: "Displeship",
		},
	},
];
const toGuideMembersWith = [
	{
		value: "Read the Bible more often",
		labels: {
			en: "Read the Bible more often",
		},
	},
	{
		value: "Pray More",
		labels: {
			en: "Pray More",
		},
	},
	{
		value: "Study / Understand the Bible",
		labels: {
			en: "Study / Understand the Bible",
		},
	},
	{
		value: "Apply the Bible To Transform Lives",
		labels: {
			en: "Apply the Bible To Transform Lives",
		},
	},
	{
		value: "Share the Gospel",
		labels: {
			en: "Share the Gospel",
		},
	},
];
export const whyNotReadBibleOutsideChurch = [
	{
		value: "Due to a lack of Bibles",
		labels: {
			en: "Due to a lack of Bibles",
		},
	},

	{
		value: "Due to a lack of guidance (no understanding, feeling overwhelmed)",
		labels: {
			en: "Due to a lack of guidance (no understanding, feeling overwhelmed)",
		},
	},
	{
		value: "Due to dependence on the pastor",
		labels: {
			en: "Due to dependence on the pastor",
		},
	},
	{
		value: "Due to distractions or not enough time",
		labels: {
			en: "Due to distractions or not enough time",
		},
	},
	{
		value: "Due to safety or concerns or persecution",
		labels: {
			en: "Due to safety or concerns or persecution",
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
		},
	},
	{
		value:
			"Spiritual Young Adults - They are in the habit of practicing Christian habits (disciplines), and they have a good understanding of what the Bible teaches. They are ready to either start their personal in-depth Bible studies, apply Scripture no matter what it commands, or help assist in ministry work.",
		labels: {
			en: {
				main: "Spiritual Young Adults",
				explainer:
					"They are new to Christianity and need to learn the basic truths of the Bible and to learn about Christian habits (disciplines) from a more mature Christian leader.",
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
		},
	},
];
export const preferredContact = [
	{
		value: "email",
		labels: {
			en: "Email",
		},
	},
	{
		value: "WhatsApp",
		labels: {
			en: "WhatsApp",
		},
	},
];
export const contactFallbackHelpMethods = [
	{
		value: "Translation Support",
		labels: {
			en: "Translation Support",
		},
	},
	{
		value: "Tech Support",
		labels: {
			en: "Tech Support",
		},
	},
	{
		value: "Other",
		labels: {
			en: "Other",
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
			"Have you contacted the Scripture Accessibility department to arrange publication of your translation? ",
		ideaOfUse:
			"Do you have an idea on how you would like to see your community use the translated Bible?",
		namesOfAssessors: "Name of the assessor(s)",
		namesOfAssessorsSubLabel: "Separate names with commas (,)",
		langNameAndCode: "Language name and code",
		prefferredContact: "How do you preferred to be contacted?",
		email: "Email Address",
		emailSubLabel: "An email address is not required to complete this form",
		phone: "WhatsApp Number",
		phoneSubLabel: "What is the best number we can contact you?",
		managerName: "Name of Project Manager",
		expectedLaunchDate: "Expected Bible launch date",
		expectedLaunchDateSubLabel:
			"Choose the date you expect to begin distributing your Bible",
		communityReligion: "What is the main religion in your community?",
		haveReadBibleOutsideChurch:
			"Have believers read the Bible outside of church?",
		haveReadBibleOutsideChurchSubLabel:
			"Choose what is true for the majority of believers in your community",
		languagesBibleReadIn:
			"In what language(s) has your community read the Bible?",
		languagesBibleReadInSubLabel: "Select all that apply",
		whyNotReadBibleOutsideChurch:
			"Please choose a reason why most believers do not read the Bible outside of church.",
		whyNotReadBibleOutsideChurchSubLabel: "Select all that apply",
		commonReadingMethod: "What is a common reading method used?",
		commonReadingMethodSubLabel: "Select all that apply",
		whyReadThisWay: "Why do you think they read in this way?",
		desireToUse: "How do you desire for your commnity to use the Bible?",
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
			"We many have specific resources to share based on your answer",
		averageMaturity: "What is the average maturity level of believers?",
		inChargePrinting: "Who could be in charge of printing digital resources",
		planToDistribute:
			"How do you plan to distribute the resources and to whom?",
		planToDistributeSubLabel:
			"Examples include digital copies, photocopies, printouts, etc.",
		otherLabel: "Other",
		contactFallbackMessage: "Your Message",
		contactFallbackHelpMethod: "How Can We Help You?",
	},
};

export const disclaimerMessages: Record<string, Record<string, string>> = {
	en: {
		forCompletedPartners:
			"This service is designed for our partners who need help after translation. Please contact us if you have further questions.",
		forAfterPublish:
			"This service is designed for our partners who need help after their translation is refined and is ready to be published. Please contact us (or your project manager or RDD) if you have further questions.",
		forAfterRefinement:
			"This service is designed for our partners who need help after their translation is refined and is ready to be published. It sounds like you are almost ready—congratulations! Please contact the Scripture Accessibility department first for publication arrangements. Then come back to fill out the rest of this form. ",
		forDiscussWithCommunity:
			"Please take time to discuss this with various leaders from your community. Then come back to fill out the rest of this form. ",
	},
};
