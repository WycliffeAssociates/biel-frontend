import { DatePicker, parseDate } from "@ark-ui/solid/date-picker";
import {
	getBinaryChoiceLabelsLocalized,
	type InputChoicesType,
	inputChoices,
	maturityLevels,
	questionLabels,
} from "@components/ScriptureEngagement/choices";
import { Checkbox } from "@kobalte/core/checkbox";
import { RadioGroup } from "@kobalte/core/radio-group";
import { TextField } from "@kobalte/core/text-field";
import { contactFormContactMethodsValues } from "@lib/constants";
import type { i18nDictType } from "@src/i18n/strings";
import intlTelInput, { type Iti } from "intl-tel-input";
import type { HTMLInputElement } from "linkedom";
import {
	type Accessor,
	createSignal,
	For,
	Match,
	onMount,
	type Setter,
	Show,
	Switch,
} from "solid-js";
import { Index, Portal } from "solid-js/web";

type ScriptureEngagementFormProps = {
	languageCode: string;
	i18nDict: i18nDictType;
	turnstilePublicKey: string;
};

type InputProperties = {
	value: string | boolean | string[] | null;
	label: string | undefined;
	subLabel?: string | undefined;
	supportsOther?: boolean;
	name: string | undefined;
	show?: () => boolean;
	isValid?: () => boolean; //all will have a null value check
	id?: string;
	validationError?: string;
};
type SeFormType = {
	preliminaryRadios: Array<InputProperties>;
	sections: {
		[sectionName: string]: {
			[fieldName: string]: InputProperties;
		};
	};
	generalContactFallback: {
		[fieldName: string]: InputProperties;
	};
};

const labelClasses =
	"font-600 text-onSurface-primary font-step-1  block leading-150% md:leading-120%";

function valIsWhatsApp(val: unknown) {
	return typeof val === "string" && !!val && val.toLowerCase() === "whatsapp";
}

export function ScriptureEngagementForm(props: ScriptureEngagementFormProps) {
	const labelSet = questionLabels[props.languageCode] || questionLabels.en!;
	const enLabelSet = questionLabels.en!;
	const binaryChoices = getBinaryChoiceLabelsLocalized(props.languageCode);
	const [formNotSubimittedSuccessfully, setFormNotSubmittedSuccessfully] =
		createSignal(false);
	const [turnstileToken, setTurnstileToken] = createSignal("");
	const [form, setForm] = createSignal<SeFormType>({
		preliminaryRadios: [
			{
				value: null,
				label: labelSet.currentlyWorking,
				name: enLabelSet.currentlyWorking,
				id: "currentlyWorking",
				show: () => true,
			},
			{
				value: null,
				label: labelSet.nearlyDoneRefining,
				name: enLabelSet.nearlyDoneRefining,
				id: "nearlyDoneRefining",
				show: (): boolean =>
					form().preliminaryRadios[0]!.value !== "neverWorked" &&
					form().preliminaryRadios[0]!.value !== null,
			},
			{
				value: null,
				label: labelSet.hasContactedScriptureAccessiblity,
				name: enLabelSet.hasContactedScriptureAccessiblity,
				id: "hasContactedScriptureAccessiblity",
				show: (): boolean => form().preliminaryRadios[1]!.value === true,
			},
			{
				value: null,
				label: labelSet.ideaOfUse,
				subLabel: labelSet.ideaOfUseSubLabel,
				name: enLabelSet.ideaOfUse,
				id: "ideaOfUse",
				show: (): boolean => {
					const hasProgres =
						form().preliminaryRadios[0]!.value !== "neverWorked";
					const nearlyDone = form().preliminaryRadios[1]!.value === true;
					const hasContactedSa = form().preliminaryRadios[2]!.value === true;
					return hasProgres && nearlyDone && hasContactedSa;
				},
			},
		],
		sections: {
			firstSection: {
				assessorNames: {
					value: null,
					label: labelSet.namesOfAssessors,
					subLabel: labelSet.namesOfAssessorsSubLabel,
					name: enLabelSet.namesOfAssessors,
					id: "namesOfAssessors",
				},
				langNameAndCode: {
					value: null,
					label: labelSet.langNameAndCode,
					name: enLabelSet.langNameAndCode,
					id: "langNameAndCode",
				},
				preferEmailOrWhatsApp: {
					value: null, //email or phone
					label: labelSet.prefferredContact,
					name: enLabelSet.prefferredContact,
					id: "prefferredContact",
				},
				email: {
					value: null,
					label: labelSet.email,
					name: enLabelSet.email,
					id: "email",
					isValid: (): boolean => {
						const thisSection = form()?.sections?.firstSection;
						// if no preference, that will trigger, else if phone preferred, then all email valid
						if (
							thisSection?.preferEmailOrWhatsApp?.value === null ||
							valIsWhatsApp(thisSection?.preferEmailOrWhatsApp?.value)
						) {
							return true;
						}
						return (
							thisSection?.preferEmailOrWhatsApp?.value === "email" &&
							thisSection?.email?.value !== null
						);
					},
				},
				phone: {
					value: null,
					label: labelSet.phone,
					subLabel: labelSet.phoneSubLabel,
					name: enLabelSet.phone,
					id: "phone",
					isValid: (): boolean => {
						const thisSection = form()?.sections?.firstSection;
						// if no preference, that will trigger, else if email preferred, then all phone valid
						if (
							thisSection?.preferEmailOrWhatsApp?.value === null ||
							thisSection?.preferEmailOrWhatsApp?.value === "email"
						) {
							return true;
						}
						const phoneEl = document.querySelector(
							"#phone input[type='phone']",
						) as HTMLInputElement | null;
						const phoneValStatus =
							!phoneEl || phoneEl?.dataset?.valid === "true";
						return (
							typeof thisSection?.preferEmailOrWhatsApp?.value === "string" &&
							thisSection?.preferEmailOrWhatsApp?.value?.toLowerCase() ===
								"whatsapp" &&
							thisSection?.phone?.value !== null &&
							phoneValStatus
						);
					},
				},
				managerName: {
					value: null,
					label: labelSet.managerName,
					subLabel: labelSet.managerNameSubLabel,
					name: enLabelSet.managerName,
					id: "managerName",
				},
				expectedLaunchDate: {
					value: null,
					label: labelSet.expectedLaunchDate,
					subLabel: labelSet.expectedLaunchDateSubLabel,
					name: enLabelSet.expectedLaunchDate,
					id: "expectedLaunchDate",
				},
				communityReligion: {
					value: null,
					label: labelSet.communityReligion,
					name: enLabelSet.communityReligion,
					id: "communityReligion",
				},
			},
			secondSection: {
				haveReadBibleOutsideChurch: {
					value: null,
					label: labelSet.haveReadBibleOutsideChurch,
					subLabel: labelSet.haveReadBibleOutsideChurchSubLabel,
					name: enLabelSet.haveReadBibleOutsideChurch,
					show: () => true,
					id: "haveReadBibleOutsideChurch",
				},
				languagesBibleReadIn: {
					value: [],
					label: labelSet.languagesBibleReadIn,
					subLabel: labelSet.languagesBibleReadInSubLabel,
					name: enLabelSet.languagesBibleReadIn,
					show: (): boolean => showSecondFormSections(),
					supportsOther: true,
					id: "languagesBibleReadIn",
					isValid: (): boolean => {
						return isValidSecondSection(
							form()?.sections?.secondSection?.languagesBibleReadIn?.value,
						);
					},
				},
				commonReadingMethod: {
					value: [],
					label: labelSet.commonReadingMethod,
					subLabel: labelSet.commonReadingMethodSubLabel,
					name: enLabelSet.commonReadingMethod,
					show: (): boolean => showSecondFormSections(),
					supportsOther: true,
					id: "commonReadingMethod",
					isValid: (): boolean =>
						isValidSecondSection(
							form()?.sections?.secondSection?.commonReadingMethod?.value,
						),
				},
				whyReadThisWay: {
					value: null,
					label: labelSet.whyReadThisWay,
					name: enLabelSet.whyReadThisWay,
					show: (): boolean => showSecondFormSections(),
					id: "whyReadThisWay",
					isValid: (): boolean =>
						isValidSecondSection(
							form()?.sections?.secondSection?.whyReadThisWay?.value,
						),
				},
				whyNotReadBibleOutsideChurch: {
					value: [],
					label: labelSet.whyNotReadBibleOutsideChurch,
					name: enLabelSet.whyNotReadBibleOutsideChurch,
					subLabel: labelSet.whyNotReadBibleOutsideChurchSubLabel,
					show: () => true,
					supportsOther: true,
					id: "whyNotReadBibleOutsideChurch",
					isValid: (): boolean => {
						const thisSection = form()?.sections?.secondSection;
						const readsBible = thisSection?.haveReadBibleOutsideChurch?.value;
						const doesNotReadBible =
							readsBible === false || readsBible === null;
						// only answer this if they are indeed not bible readers
						if (!doesNotReadBible) return true;
						return thisSection?.whyNotReadBibleOutsideChurch?.value !== null;
					},
				},
			},
			thirdSection: {
				desireToUse: {
					value: null,
					label: labelSet.desireToUse,
					subLabel: labelSet.desireToUseSubLabel,
					name: enLabelSet.desireToUse,
					id: "desireToUse",
				},
				toGuideLeadersWith: {
					value: [],
					label: labelSet.toGuideLeadersWith,
					subLabel: labelSet.toGuideLeadersWithSubLabel,
					name: enLabelSet.toGuideLeadersWith,
					supportsOther: true,
					id: "toGuideLeadersWith",
				},
				toGuideMembersWith: {
					value: [],
					label: labelSet.toGuideMembersWith,
					subLabel: labelSet.toGuideMembersWithSubLabel,
					name: enLabelSet.toGuideMembersWith,
					supportsOther: true,
					id: "toGuideMembersWith",
				},
				questionsFromCommunity: {
					value: null,
					label: labelSet.questionsFromCommunity,
					subLabel: labelSet.questionsFromCommunitySubLabel,
					name: enLabelSet.questionsFromCommunity,
					id: "questionsFromCommunity",
				},
			},
			fourthSection: {
				averageMaturity: {
					value: null,
					label: labelSet.averageMaturity,
					name: enLabelSet.averageMaturity,
					id: "averageMaturity",
				},
				inChargePrinting: {
					value: null,
					label: labelSet.inChargePrinting,
					name: enLabelSet.inChargePrinting,
					id: "inChargePrinting",
				},
				planToDistribute: {
					value: null,
					label: labelSet.planToDistribute,
					subLabel: labelSet.planToDistributeSubLabel,
					name: enLabelSet.planToDistribute,
					id: "planToDistribute",
				},
			},
		},
		generalContactFallback: {
			email: {
				value: null,
				label: labelSet.email,
				name: enLabelSet.email,
				id: "email",
			},
			helpMethods: {
				value: null,
				label: labelSet.contactFallbackHelpMethod,
				name: enLabelSet.contactFallbackHelpMethod,
				id: "method",
			},
			message: {
				value: null,
				label: labelSet.contactFallbackMessage,
				name: enLabelSet.contactFallbackMessage,
				id: "message",
			},
		},
	});

	function isValidSecondSection(value: unknown) {
		const thisSection = form()?.sections?.secondSection;
		const doesNotReadBible =
			thisSection?.haveReadBibleOutsideChurch?.value === false ||
			thisSection?.haveReadBibleOutsideChurch?.value === null;
		// bible use question hidden when not readers
		if (doesNotReadBible) return true;
		if (Array.isArray(value)) {
			return !!value.length;
		}
		return !!value;
	}
	const doHideRestOfForm = () => {
		const firstIsWrong = form().preliminaryRadios[0]!.value === "neverWorked";
		return (
			firstIsWrong ||
			form()
				.preliminaryRadios.slice(1)
				.some((radio) => radio.value !== true)
		);
	};
	const getDisclaimerQuestion = () => {
		if (!doShowDisclaimer()) return null;
		const theForm = form();
		const hasNeverDoneWork =
			theForm.preliminaryRadios[0]!.value === "neverWorked" ||
			theForm.preliminaryRadios[1]!.value === false;

		if (hasNeverDoneWork) {
			return "seGeneralContactFallback";
		}
		const hasNotContactAccessibility =
			theForm.preliminaryRadios[2]!.value === false;
		if (hasNotContactAccessibility) {
			return "seNotAccessibility";
		}
		const noIdeaOfUse = theForm.preliminaryRadios[3]!.value === false;
		if (noIdeaOfUse) {
			return "seNoIdeaOfUse";
		}
		return null;
	};
	const doShowDisclaimer = () => {
		const theForm = form();
		const hasNeverDoneWork =
			theForm.preliminaryRadios[0]!.value === "neverWorked";
		return (
			(doHideRestOfForm() && hasNeverDoneWork) ||
			theForm.preliminaryRadios.some((r) => r.value === false)
		);
	};
	function updatePreliminaryRadio(arrIdx: number, value: boolean | string) {
		setForm((prev) => {
			const newForm = { ...prev };
			newForm.preliminaryRadios[arrIdx]!.value = value;
			return newForm;
		});
	}
	function updateRestOfForm(
		section: string,
		key: string,
		value: string | boolean | string[],
	) {
		setForm((prev) => {
			const newForm = { ...prev };
			newForm.sections[section]![key]!.value = value;
			return newForm;
		});
	}
	function handleCheckboxFormValues({
		action,
		value,
		sectionName,
		fieldName,
	}: {
		action: "add" | "remove";
		value: string;
		sectionName: string;
		fieldName: string;
	}) {
		setForm((prev) => {
			const newForm = { ...prev };
			// clearn any previous other checkbox if this was an add
			if (
				action === "add" &&
				Array.isArray(newForm.sections[sectionName]![fieldName]!.value) &&
				value.toLowerCase().startsWith("other")
			) {
				newForm.sections[sectionName]![fieldName]!.value = (
					newForm.sections[sectionName]![fieldName]!.value as string[]
				).filter((existing) => !existing.toLowerCase().startsWith("other"));
			}
			if (action === "add") {
				newForm.sections[sectionName]![fieldName]!.value = [
					...(newForm.sections[sectionName]![fieldName]!.value as string[]),
					value,
				];
			} else {
				newForm.sections[sectionName]![fieldName]!.value = (
					newForm.sections[sectionName]![fieldName]!.value as string[]
				).filter((existing) => {
					if (value.toLowerCase().startsWith("other")) {
						return !existing.toLowerCase().startsWith("other");
					}
					return existing !== value;
				});
			}
			return newForm;
		});
	}
	function getFlattenFormState() {
		const preliminaryValues = form().preliminaryRadios.map((input) => {
			return {
				field: input.name,
				value: input.value,
				id: input.id,
				formFieldReference: input,
			};
		});
		const sectionValues = Object.values(form().sections).flatMap((section) => {
			return Object.values(section).map((input) => {
				return {
					field: input.name,
					value: input.value,
					id: input.id,
					formFieldReference: input,
				};
			});
		});
		// We don't need fallback contact vals.
		return [...preliminaryValues, ...sectionValues];
	}
	const showSecondFormSections = () => {
		return (
			form()?.sections?.secondSection?.haveReadBibleOutsideChurch?.value ===
			true
		);
	};
	const getLocalizedChoiceWithFallback = (node: {
		labels: Record<string, string>;
	}) => {
		return node.labels[props.languageCode] || node.labels.en!;
	};
	const getLocalizedChoiceWithFallbackNested = (node: {
		labels: Record<string, Record<string, string>>;
	}) => {
		return node.labels[props.languageCode] || node.labels.en!;
	};

	function validateForm() {
		let isValid = true;
		let idToScrollTo = null;
		const formCopy = { ...form() };
		Object.values(formCopy.sections)
			.flat()
			.forEach((section) => {
				Object.values(section).forEach((input) => {
					const value = input.value;
					const hasCustomValidationFunction = Object.hasOwn(input, "isValid");

					if (hasCustomValidationFunction) {
						if (!input.isValid!()) {
							isValid = false;
							idToScrollTo ??= input.id;
							input.validationError = "Field is required";
						}
					} else {
						const isArrayField = Array.isArray(value);
						const isStringField = typeof value === "string";
						const isNotEmpty = input.value !== null;
						if (isStringField && !value?.trim().length) {
							isValid = false;
							idToScrollTo ??= input.id;
							input.validationError = "Field is required";
						}
						if (isArrayField && !value?.length) {
							isValid = false;
							idToScrollTo ??= input.id;
							input.validationError = "Field is required";
						}
						if (!isNotEmpty) {
							isValid = false;
							idToScrollTo ??= input.id;
							input.validationError = "Field is required";
						}
					}
				});
			});
		setForm(formCopy);
		if (idToScrollTo) {
			const node = document.getElementById(idToScrollTo);
			if (node) {
				node.scrollIntoView({ behavior: "smooth" });
			}
		}
		return isValid;
		// If there is a custom validation property, call it.  validation functions should return a message as well. Default will be just a strictly null check and field is required;
		//
	}

	async function onSubmit() {
		// todo: validate and show errors
		// Take flattened form state and send to enpoint;
		try {
			if (!validateForm()) {
				return;
			}
			const payload = getFlattenFormState().filter((f) => {
				if (Array.isArray(f.value)) {
					return f.value.length > 0;
				}
				return !!f.value;
			});

			const res = await fetch("/api/seForm", {
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.status === 200) {
				// hacky way to just hide the form again for now. === 200 is success of course, but I didn't set this thing up orignally with multiple form states for re. the hiddenness.
				setFormNotSubmittedSuccessfully(true);
			}
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<div class="seForm py-4 w-full bg-surface-primary md:rounded-80px  md:p-20 max-w-5xl mx-auto">
			<Show
				when={!formNotSubimittedSuccessfully()}
				fallback={
					<ThankYouSuccess
						dict={props.i18nDict}
						getDisclaimerQuestion={getDisclaimerQuestion}
					/>
				}
			>
				<div class="flex flex-col gap-20">
					<Section1
						getLocalizedChoiceWithFallback={getLocalizedChoiceWithFallback}
						binaryChoices={binaryChoices}
						form={form}
						updatePreliminaryRadio={updatePreliminaryRadio}
						i18nDict={props.i18nDict}
					/>
					{/* Main form */}
					<Show
						when={!doHideRestOfForm()}
						fallback={
							<Show when={doShowDisclaimer()}>
								<FallbackContactForm
									form={form}
									getLocalizedChoiceWithFallback={
										getLocalizedChoiceWithFallback
									}
									i18nDict={props.i18nDict}
									inputChoices={inputChoices}
									getDisclaimerQuestion={getDisclaimerQuestion}
									setForm={setForm}
									setTurnstileToken={setTurnstileToken}
									turnstileToken={turnstileToken}
									turnstilePublicKey={props.turnstilePublicKey}
									setFormNotSubmittedSuccessfully={
										setFormNotSubmittedSuccessfully
									}
								/>
							</Show>
						}
					>
						<section>
							<Section2
								form={form}
								updateRestOfForm={updateRestOfForm}
								getLocalizedChoiceWithFallback={getLocalizedChoiceWithFallback}
								inputChoices={inputChoices}
								i18nDict={props.i18nDict}
							/>
						</section>
						<section>
							<Section3
								form={form}
								updateRestOfForm={updateRestOfForm}
								binaryChoices={binaryChoices}
								showSecondFormSections={showSecondFormSections}
								getLocalizedChoiceWithFallback={getLocalizedChoiceWithFallback}
								handleCheckboxFormValues={handleCheckboxFormValues}
								labelSet={labelSet}
								i18nDict={props.i18nDict}
							/>
						</section>
						<section>
							<Section4
								form={form}
								updateRestOfForm={updateRestOfForm}
								binaryChoices={binaryChoices}
								showSecondFormSections={showSecondFormSections}
								getLocalizedChoiceWithFallback={getLocalizedChoiceWithFallback}
								handleCheckboxFormValues={handleCheckboxFormValues}
								labelSet={labelSet}
								i18nDict={props.i18nDict}
							/>
						</section>
						<section>
							<Section5
								form={form}
								updateRestOfForm={updateRestOfForm}
								binaryChoices={binaryChoices}
								getLocalizedChoiceWithFallbackNested={
									getLocalizedChoiceWithFallbackNested
								}
								labelSet={labelSet}
								i18nDict={props.i18nDict}
							/>
						</section>
						<div>
							<SubmitSection
								i18nDict={props.i18nDict}
								onSubmit={onSubmit}
								turnstilePublicKey={props.turnstilePublicKey}
								setTurnstileToken={setTurnstileToken}
							/>
						</div>
					</Show>
				</div>
			</Show>
		</div>
	);
}
function ThankYouSuccess(props: {
	dict: i18nDictType;
	getDisclaimerQuestion: () =>
		| "seGeneralContactFallback"
		| "seNotAccessibility"
		| "seNoIdeaOfUse"
		| null;
}) {
	const message = () => {
		const disclaimerQuestion = props.getDisclaimerQuestion();
		if (!disclaimerQuestion) {
			return props.dict.seSuccessHtml;
		}
		const withThankyouSuffix = `${props.dict[disclaimerQuestion]}Thanks`;
		// @ts-expect-error
		if (!props.dict[withThankyouSuffix]) {
			return props.dict.seSuccessHtml;
		}
		// @ts-expect-error
		return props.dict[withThankyouSuffix];
	};
	return (
		<div
			innerHTML={message()}
			class="grid h-full w-full min-h-30vh place-content-start"
		/>
	);
}
function ValidationErr(props: { errMsg: string | undefined }) {
	return (
		<Show when={props.errMsg}>
			<p class="text-error-onSurface! italic font-500">{props.errMsg}</p>
		</Show>
	);
}
type RadioGroupProps = {
	updateForm(value: boolean): void;
	binaryChoices: { yes: string; no: string };
	field: InputProperties;
};

function BinaryRadioGroup(props: RadioGroupProps) {
	return (
		<RadioGroup
			data-name="radio-group"
			class={"text-onSurface-secondary data-checked:[text-brand-base]"}
			onChange={(val) => props.updateForm(val === "yes")}
			id={props.field.id || ""}
		>
			<RadioGroup.Label data-name="radio-group__label" class={labelClasses}>
				{props.field.label}
			</RadioGroup.Label>
			<ValidationErr errMsg={props.field.validationError} />
			<div
				data-name="radio-group__items"
				role="presentation"
				class="flex flex-col gap-4 mbs-4"
			>
				<For each={Object.entries(props.binaryChoices)}>
					{([key, label]) => (
						<RadioGroup.Item
							value={key}
							class="radio flex items-center gap-4  py-1 rounded-lg text-inherit  cursor-pointer hover:(text-onSurface-primary) seFocusWithin"
						>
							<RadioGroup.ItemInput data-name="radio__input" />
							<RadioGroup.ItemControl
								data-name="radio__control"
								class="border border-solid border-onSurface-secondary rounded-full shrink-0 size-4 w-4 h-4 flex items-center justify-center data-checked:[border-inherit]"
							>
								<RadioGroup.ItemIndicator
									class="rounded-full bg-brand-base size-2"
									data-name="radio__indicator"
								/>
							</RadioGroup.ItemControl>

							<RadioGroup.ItemLabel
								data-name="radio__label"
								class="data-[checked]:(text-brand-base font-500)"
							>
								{label}
							</RadioGroup.ItemLabel>
						</RadioGroup.Item>
					)}
				</For>
			</div>
		</RadioGroup>
	);
}

type MultiRadioGroupProps = {
	choices: Array<{ labels: Record<string, string>; value: string }>;
	updateForm(value: string): void;
	getLocalizedChoiceWithFallback: (node: {
		labels: Record<string, string>;
	}) => string;
	field: InputProperties;
};
function MultiRadioGroup(props: MultiRadioGroupProps) {
	return (
		<RadioGroup
			data-name="radio-group"
			class="text-onSurface-secondary data-checked:[text-brand-base]"
			onChange={(val) => props.updateForm(val)}
			id={props.field.id || "radio-group"}
		>
			<RadioGroup.Label data-name="radio-group__label" class={labelClasses}>
				{props.field.label}
			</RadioGroup.Label>
			<Show when={props.field.subLabel}>
				<p>{props.field.subLabel}</p>
			</Show>
			<ValidationErr errMsg={props.field.validationError} />
			<div
				data-name="radio-group__items"
				role="presentation"
				class="flex flex-col gap-4 mbs-4"
			>
				<For each={props.choices}>
					{(choice) => (
						<RadioGroup.Item
							value={choice.value}
							class="radio flex items-center gap-4  py-1 rounded-lg text-inherit seFocusWithin cursor-pointer hover:(text-onSurface-primary)"
						>
							<RadioGroup.ItemInput data-name="radio__input" />
							<RadioGroup.ItemControl
								data-name="radio__control"
								class="border border-solid border-onSurface-secondary rounded-full shrink-0 size-4 w-4 h-4 flex items-center justify-center data-[checked]:(border-brand-base)"
							>
								<RadioGroup.ItemIndicator
									class="rounded-full bg-brand-base size-2"
									data-name="radio__indicator"
								/>
							</RadioGroup.ItemControl>

							<RadioGroup.ItemLabel
								data-name="radio__label"
								class="data-[checked]:(text-brand-base font-500)"
							>
								{props.getLocalizedChoiceWithFallback(choice)}
							</RadioGroup.ItemLabel>
						</RadioGroup.Item>
					)}
				</For>
			</div>
		</RadioGroup>
	);
}
type RadioGroupMaturityProps = Omit<
	MultiRadioGroupProps,
	"choices" | "getLocalizedChoiceWithFallback"
> & {
	choices: Array<{
		value: string;
		labels: Record<string, Record<string, string>>;
	}>;
	getLocalizedChoiceWithFallbackNested: (node: {
		labels: Record<string, Record<string, string>>;
	}) => Record<string, string>;
};
function RadioGroupMaturity(props: RadioGroupMaturityProps) {
	return (
		<RadioGroup
			data-name="radio-group"
			class="flex flex-col gap-4 text-onSurface-secondary data-checked:[text-brand-base]"
			onChange={(val) => props.updateForm(val)}
			id={props.field.id || ""}
		>
			<RadioGroup.Label data-name="radio-group__label" class={labelClasses}>
				{props.field.label}
			</RadioGroup.Label>
			<Show when={props.field.subLabel}>
				<p>{props.field.subLabel}</p>
			</Show>
			<ValidationErr errMsg={props.field.validationError} />
			<div
				data-name="radio-group__items"
				role="presentation"
				class="flex flex-col gap-4"
			>
				<For each={props.choices}>
					{(choice) => (
						<RadioGroup.Item
							value={choice.value}
							class="radio flex items-center gap-4  py-1 rounded-lg text-inherit items-start! seFocusWithin hover:(text-onSurface-primary) cursor-pointer"
						>
							<RadioGroup.ItemInput data-name="radio__input" />
							<RadioGroup.ItemControl
								data-name="radio__control"
								class="border border-solid border-onSurface-secondary rounded-full shrink-0 size-4 shrink-0 flex items-center justify-center data-checked:[border-inherit] transform translate-y-1/2"
							>
								<RadioGroup.ItemIndicator
									class="rounded-full bg-brand-base size-2"
									data-name="radio__indicator"
								/>
							</RadioGroup.ItemControl>

							<RadioGroup.ItemLabel
								data-name="radio__label"
								class="data-[checked]:(text-brand-base! font-500) group"
							>
								<div class="flex flex-col gap-1px text-inherit">
									<p class="text-inherit!">
										{props.getLocalizedChoiceWithFallbackNested(choice).main}
									</p>
									<p class="text-inherit!">
										{
											props.getLocalizedChoiceWithFallbackNested(choice)
												.explainer
										}
									</p>
								</div>
							</RadioGroup.ItemLabel>
						</RadioGroup.Item>
					)}
				</For>
			</div>
		</RadioGroup>
	);
}

type TextInputProps = {
	updateForm(value: string): void;
	type?: string;
	field: InputProperties;
};
function TextInput(props: TextInputProps) {
	return (
		<TextField class="flex flex-col gap-4" id={props.field.id || ""}>
			<TextField.Label class={labelClasses}>
				{props.field.label}
			</TextField.Label>
			<Show when={props.field.subLabel}>
				<p>{props.field.subLabel}</p>
			</Show>
			<ValidationErr errMsg={props.field.validationError} />
			<TextField.Input
				onInput={(e) => props.updateForm(e.currentTarget.value)}
				type={props.type || "text"}
				class={`rounded-xl bg-surface-secondary p-2 md:p-4 text-onSurface-primary cursor-pointer border-surface-border border border-solid focus:(bg-surface-primary) ${
					props.field.validationError &&
					"bg-error-surface! border-error-onSurface!"
				}`}
			/>
		</TextField>
	);
}

type CheckBoxGroupProps = {
	choices: Array<{ labels: Record<string, string>; value: string }>;
	handleChange: (action: "add" | "remove", value: string) => void;
	getLocalizedChoiceWithFallback: (node: {
		labels: Record<string, string>;
	}) => string;
	otherLabel?: string;
	field: InputProperties;
};
function CheckBoxGroup(props: CheckBoxGroupProps) {
	// const [otherValue, setOtherValue] = createSignal("");
	const [otherIsChecked, setOtherChecked] = createSignal(false);
	return (
		<div class="flex flex-col gap-4" id={props.field.id || ""}>
			<label for={props.field.label} class={labelClasses}>
				{props.field.label}
			</label>
			<Show when={props.field.subLabel}>
				<p>{props.field.subLabel}</p>
			</Show>
			<ValidationErr errMsg={props.field.validationError} />
			<For each={props.choices}>
				{(choice) => {
					return (
						<Checkbox
							name={props.field.label}
							class="flex items-center gap-4 text-onSurface-secondary seFocusWithin hover:(text-onSurface-primary) cursor-pointer"
							onChange={(isChecked) => {
								const action = isChecked ? "add" : "remove";
								props.handleChange(action, choice.value);
							}}
						>
							<Checkbox.Input class="checkbox__input" />
							<Checkbox.Control
								data-name="checkbox__control"
								class="size-4 rounded-sm border-onSurface-secondary border-2 border-solid data-[checked]:(border-none bg-brand-base) relative"
							>
								<Checkbox.Indicator>
									<span class="i-ic:round-check w-.75em h-.75em absolute inset-0 m-auto text-onSurface-invert" />
								</Checkbox.Indicator>
							</Checkbox.Control>
							<Checkbox.Label class="checkbox__label">
								{props.getLocalizedChoiceWithFallback(choice)}
							</Checkbox.Label>
						</Checkbox>
					);
				}}
			</For>
			<Show when={props.field.supportsOther}>
				<div class="flex gap-4 text-onSurface-secondary">
					<Checkbox
						name={props.field.label}
						class="flex items-center gap-4 seFocusWithin"
						onChange={(isChecked) => {
							setOtherChecked(isChecked);
							if (!isChecked) {
								props.handleChange("remove", "other");
							}
						}}
						checked={otherIsChecked()}
					>
						<Checkbox.Input class="checkbox__input" />
						<Checkbox.Control
							data-name="checkbox__control"
							class="size-4 rounded-sm border-onSurface-secondary border-2 border-solid data-[checked]:(border-none bg-brand-base) relative"
						>
							<Checkbox.Indicator>
								<span class="i-ic:round-check w-.75em h-.75em absolute inset-0 m-auto text-onSurface-invert" />
							</Checkbox.Indicator>
						</Checkbox.Control>
						<Checkbox.Label class="checkbox__label">
							{props.otherLabel}
						</Checkbox.Label>
					</Checkbox>
					<Show when={otherIsChecked()}>
						<input
							type="text"
							onChange={(e) => {
								props.handleChange("add", `Other - ${e.currentTarget.value}`);
							}}
							class="border-b! border-onSurface-secondary! border-solid! bg-transparent! w-full "
						/>
					</Show>
				</div>
			</Show>
		</div>
	);
}
function TextAreaInput(props: TextInputProps) {
	return (
		<TextField class="flex flex-col gap-4" id={props.field.id || ""}>
			<TextField.Label class={labelClasses}>
				{props.field.label}
			</TextField.Label>
			<Show when={props.field.subLabel}>
				<p>{props.field.subLabel}</p>
			</Show>
			<ValidationErr errMsg={props.field.validationError} />
			<TextField.TextArea
				autoResize={false}
				class={`p-2 md:p-4 rounded-lg min-h-40 bg-surface-secondary cursor-pointer border-surface-border border border-solid focus:(bg-surface-primary!) ${
					props.field.validationError &&
					"bg-error-surface! border-error-onSurface!"
				}`}
				placeholder="Type here"
				onInput={(e) => props.updateForm(e.currentTarget.value)}
			/>
		</TextField>
	);
}

type CalendarInputProps = {
	onValueChange: (v: string) => void;
	id?: string;
	field: InputProperties;
};

function CalendarInput(props: CalendarInputProps) {
	const triggerClasses =
		"focus:bg-brand-base focus:ring-4 focus:ring-brand focus:ring-offset-6 aspect-square rounded-lg p-1 bg-brand border-x-2 border-t-2 border-b-4 border-brand-darkest bg-brand-base text-onSurface-invert! flex gap-4 items-center hover:bg-brand-darkest active:bg-brand-darkest data-[disabled]:(cursor-not-allowed opacity-50)";
	const rangeTextClasses =
		"font-700 font-step-1 underline text-onSurface-primary! hover:text-brand-base!";

	return (
		<DatePicker.Root
			min={parseDate(new Date())}
			locale={globalThis?.navigator?.language || "en-US"}
			positioning={{
				placement: "bottom-start",
				arrowPadding: 0,
				gutter: 0,
				sameWidth: true,
			}}
			id={props.id || ""}
			onValueChange={(v) => {
				const formattedEn = new Intl.DateTimeFormat("en-us", {
					dateStyle: "long",
				}).format(new Date(v.valueAsString[0]!));
				return props.onValueChange(formattedEn);
			}}
			class="flex flex-col gap-4"
		>
			<div class="flex flex-col gap-2">
				<DatePicker.Label class={labelClasses}>
					{props.field.label}
				</DatePicker.Label>
				<Show when={props.field.subLabel}>
					<p>{props.field.subLabel}</p>
				</Show>
				<ValidationErr errMsg={props.field.validationError} />
			</div>

			<DatePicker.Trigger class="w-full p-2 md:p-4 bg-surface-secondary rounded-xl hover:(bg-surface-secondary! cursor-pointer) border-surface-border! border border-solid">
				<DatePicker.Control class="relative flex items-center flex-nowrap rtl:flex-reverse w-full ">
					<span class="i-material-symbols:calendar-today-outline-rounded size-24px inline-block mie-4" />
					<DatePicker.Input class="w-full text-onSurface-primary bg-inherit" />
				</DatePicker.Control>
			</DatePicker.Trigger>

			<Portal>
				<DatePicker.Positioner>
					<DatePicker.Content class="rounded-2xl bg-surface-primary shadow-md p-4 font-step-0 ">
						{/* <DatePicker.YearSelect /> */}
						{/* <DatePicker.MonthSelect /> */}
						<DatePicker.View view="day">
							<DatePicker.Context>
								{(context) => (
									<>
										<DatePicker.ViewControl class="flex w-full justify-between mb-4 items-center">
											<DatePicker.PrevTrigger class={triggerClasses}>
												<span class="i-material-symbols:arrow-back rtl:i-material-symbols:arrow-forward size-6 p-4" />
											</DatePicker.PrevTrigger>
											<DatePicker.ViewTrigger>
												<DatePicker.RangeText class={rangeTextClasses} />
											</DatePicker.ViewTrigger>
											<DatePicker.NextTrigger class={triggerClasses}>
												<span class="i-material-symbols:arrow-forward rtl:i-material-symbols:arrow-back size-6 p-4" />
											</DatePicker.NextTrigger>
										</DatePicker.ViewControl>

										<DatePicker.Table class="w-full">
											<DatePicker.TableHead class="">
												<DatePicker.TableRow class="w-full  grid grid-cols-7 text-onSurface-tertiary">
													<Index each={context().weekDays}>
														{(weekDay) => (
															<DatePicker.TableHeader>
																{weekDay().short}
															</DatePicker.TableHeader>
														)}
													</Index>
												</DatePicker.TableRow>
											</DatePicker.TableHead>

											<DatePicker.TableBody class="">
												<Index each={context().weeks}>
													{(week) => (
														<DatePicker.TableRow class="w-full grid grid-cols-7 place-content-center">
															<Index each={week()}>
																{(day) => (
																	<DatePicker.TableCell value={day()} class="">
																		<DatePicker.TableCellTrigger class="text-center rounded-lg hover:(bg-brand-light text-brand-base) p-3 data-[disabled]:(opacity-40 cursor-not-allowed) data-[selected]:(bg-brand-base text-onSurface-invert) data-[disabled]:(cursor-not-allowed opacity-50)">
																			{day().day}
																		</DatePicker.TableCellTrigger>
																	</DatePicker.TableCell>
																)}
															</Index>
														</DatePicker.TableRow>
													)}
												</Index>
											</DatePicker.TableBody>
										</DatePicker.Table>
									</>
								)}
							</DatePicker.Context>
						</DatePicker.View>

						<DatePicker.View view="month">
							<DatePicker.Context>
								{(context) => (
									<>
										<DatePicker.ViewControl class="flex w-full justify-between mb-4 items-center">
											<DatePicker.PrevTrigger class={triggerClasses}>
												<span class="i-material-symbols:arrow-back rtl:i-material-symbols:arrow-forward size-6 p-4" />
											</DatePicker.PrevTrigger>
											<DatePicker.ViewTrigger>
												<DatePicker.RangeText class={rangeTextClasses} />
											</DatePicker.ViewTrigger>
											<DatePicker.NextTrigger class={triggerClasses}>
												<span class="i-material-symbols:arrow-forward rtl:i-material-symbols:arrow-back size-6 p-4" />
											</DatePicker.NextTrigger>
										</DatePicker.ViewControl>

										<DatePicker.Table class="w-full">
											<DatePicker.TableBody class="">
												<Index
													each={context().getMonthsGrid({
														columns: 4,
														format: "short",
													})}
												>
													{(months) => (
														<DatePicker.TableRow class="">
															<Index each={months()}>
																{(month) => (
																	<DatePicker.TableCell
																		value={month().value}
																		class=""
																	>
																		<DatePicker.TableCellTrigger class="text-center rounded-lg hover:(bg-brand-light text-brand-base cursor-pointer) focus:bg-surface-secondary p-3 data-[disabled]:(cursor-not-allowed opacity-50)">
																			{month().label}
																		</DatePicker.TableCellTrigger>
																	</DatePicker.TableCell>
																)}
															</Index>
														</DatePicker.TableRow>
													)}
												</Index>
											</DatePicker.TableBody>
										</DatePicker.Table>
									</>
								)}
							</DatePicker.Context>
						</DatePicker.View>

						<DatePicker.View view="year">
							<DatePicker.Context>
								{(context) => (
									<>
										<DatePicker.ViewControl class="flex w-full justify-between mb-4 items-center">
											<DatePicker.PrevTrigger class={triggerClasses}>
												<span class="i-material-symbols:arrow-back rtl:i-material-symbols:arrow-forward size-6 p-4" />
											</DatePicker.PrevTrigger>
											<DatePicker.ViewTrigger>
												<DatePicker.RangeText class={rangeTextClasses} />
											</DatePicker.ViewTrigger>
											<DatePicker.NextTrigger class={triggerClasses}>
												<span class="i-material-symbols:arrow-forward rtl:i-material-symbols:arrow-back size-6 p-4" />
											</DatePicker.NextTrigger>
										</DatePicker.ViewControl>

										<DatePicker.Table class="w-full">
											<DatePicker.TableBody>
												<Index each={context().getYearsGrid({ columns: 4 })}>
													{(years) => (
														<DatePicker.TableRow>
															<Index each={years()}>
																{(year) => (
																	<DatePicker.TableCell
																		value={year().value}
																		class=""
																	>
																		<DatePicker.TableCellTrigger class="text-center rounded-lg hover:(bg-brand-light text-brand-base cursor-pointer)focus:bg-surface-secondary p-3 data-[disabled]:(cursor-not-allowed opacity-50)">
																			{year().label}
																		</DatePicker.TableCellTrigger>
																	</DatePicker.TableCell>
																)}
															</Index>
														</DatePicker.TableRow>
													)}
												</Index>
											</DatePicker.TableBody>
										</DatePicker.Table>
									</>
								)}
							</DatePicker.Context>
						</DatePicker.View>
					</DatePicker.Content>
				</DatePicker.Positioner>
			</Portal>
		</DatePicker.Root>
	);
}

type TelInputProps = {
	onUpdate: (value: string) => void;
	field: InputProperties;
};
function TelInput(props: TelInputProps) {
	let inputRef: HTMLInputElement;
	const [telInstance, setTelInstance] = createSignal<Iti | null>(null);
	const [isValid, setIsValid] = createSignal(true);
	// const [errMsg, setErrMsg] = createSignal("");

	onMount(() => {
		// @ts-expect-error
		const instance = intlTelInput(inputRef, {
			loadUtilsOnInit: `https://cdn.jsdelivr.net/npm/intl-tel-input@${intlTelInput.version}/build/js/utils.js`,
			formatAsYouType: true,
			formatOnDisplay: true,
			nationalMode: true,
			strictMode: true,
			separateDialCode: true,
		});
		setTelInstance(instance);
	});
	return (
		<div class="flex flex-col gap-4 w-full" id={props.field.id || ""}>
			<label for="phone" class={labelClasses}>
				{props.field.label}
			</label>

			<Show when={props.field.subLabel}>
				<p>{props.field.subLabel}</p>
			</Show>
			<ValidationErr errMsg={props.field.validationError} />
			<input
				/* @ts-expect-error */
				ref={inputRef}
				type="phone"
				name="phone"
				id="phone"
				class={`w-full bg-surface-secondary rounded-lg p-2 cursor-pointer ${
					!isValid() && "border-2 border-error-onSurface"
				}`}
				onInput={(e) => props.onUpdate(e.target.value)}
				data-valid={isValid()}
				onBlur={() => {
					const instance = telInstance();
					if (instance?.isValidNumber()) {
						setIsValid(true);
					} else {
						setIsValid(false);
					}
				}}
			/>
		</div>
	);
}

type SecondSectionFallbackProps = {
	form: () => SeFormType;
	inputChoices: InputChoicesType;
	handleCheckboxFormValues({
		action,
		value,
		sectionName,
		fieldName,
	}: {
		action: "add" | "remove";
		value: string;
		sectionName: string;
		fieldName: string;
	}): void;
	getLocalizedChoiceWithFallback: (node: {
		labels: Record<string, string>;
	}) => string;
	labelSet: Record<string, string>;
};
function SecondSectionFallback(props: SecondSectionFallbackProps) {
	const section =
		props.form().sections!.secondSection!.whyNotReadBibleOutsideChurch!;

	return (
		<Show
			when={
				props.form()?.sections?.secondSection?.haveReadBibleOutsideChurch
					?.value !== null
			}
		>
			<CheckBoxGroup
				choices={props.inputChoices!.whyNotReadBibleOutsideChurch!}
				field={section}
				handleChange={(action: "add" | "remove", val: string) => {
					props.handleCheckboxFormValues({
						action,
						value: val,
						sectionName: "secondSection",
						fieldName: "whyNotReadBibleOutsideChurch",
					});
				}}
				getLocalizedChoiceWithFallback={props.getLocalizedChoiceWithFallback}
				otherLabel={props.labelSet.otherLabel}
			/>
		</Show>
	);
}

type Section1Props = {
	getLocalizedChoiceWithFallback: (node: {
		labels: Record<string, string>;
	}) => string;
	form: () => SeFormType;
	updatePreliminaryRadio(arrIdx: number, value: boolean | string): void;
	binaryChoices: {
		yes: string;
		no: string;
	};
	i18nDict: i18nDictType;
};

function SectionHeader(props: { header: string }) {
	return (
		<p class="font-step-2! text-onSurface-primary! font-500 mb-2 md:mb-8">
			{props.header}
		</p>
	);
}
function Section1(props: Section1Props) {
	const section = props.form().preliminaryRadios;
	return (
		<div>
			<SectionHeader header={props.i18nDict.seSection1} />
			<ul class="list list-none flex flex-col gap-8">
				<li>
					<MultiRadioGroup
						choices={inputChoices.projectStatus!}
						getLocalizedChoiceWithFallback={
							props.getLocalizedChoiceWithFallback
						}
						updateForm={(value: string) =>
							props.updatePreliminaryRadio(0, value)
						}
						field={section[0]!}
					/>
				</li>
				<For each={section.slice(1)}>
					{(input, idx) => (
						<Show when={input.show?.()}>
							<li>
								<BinaryRadioGroup
									field={input}
									binaryChoices={props.binaryChoices}
									updateForm={(value) =>
										props.updatePreliminaryRadio(idx() + 1, value)
									}
								/>
							</li>
						</Show>
					)}
				</For>
			</ul>
		</div>
	);
}

type Section2Props = {
	form: () => SeFormType;
	updateRestOfForm(
		section: string,
		key: string,
		value: string | boolean | string[],
	): void;
	inputChoices: InputChoicesType;
	getLocalizedChoiceWithFallback: (node: {
		labels: Record<string, string>;
	}) => string;
	i18nDict: i18nDictType;
};
function Section2(props: Section2Props) {
	const section = () => props.form()!.sections!.firstSection!;
	const sectionName = "firstSection";

	function doShowInput(inputName: "email" | "whatsapp") {
		const val = section().preferEmailOrWhatsApp!.value;
		return !!val && typeof val === "string" && val?.toLowerCase() === inputName;
	}
	return (
		<div>
			<SectionHeader header={props.i18nDict.seSection2} />
			<div class="flex flex-col gap-8">
				<TextInput
					field={section().assessorNames!}
					updateForm={(val) =>
						props.updateRestOfForm(sectionName, "assessorNames", val)
					}
				/>
				<TextInput
					field={section().langNameAndCode!}
					updateForm={(val) =>
						props.updateRestOfForm(sectionName, "langNameAndCode", val)
					}
				/>
				<MultiRadioGroup
					choices={props.inputChoices.preferredContact!}
					getLocalizedChoiceWithFallback={props.getLocalizedChoiceWithFallback}
					field={section().preferEmailOrWhatsApp!}
					updateForm={(val) =>
						props.updateRestOfForm(sectionName, "preferEmailOrWhatsApp", val)
					}
				/>
				<Switch>
					<Match when={doShowInput("email")}>
						<TextInput
							field={section().email!}
							updateForm={(val) =>
								props.updateRestOfForm(sectionName, "email", val)
							}
							type="email"
						/>
					</Match>
					<Match when={doShowInput("whatsapp")}>
						<TelInput
							field={section().phone!}
							onUpdate={(val) =>
								props.updateRestOfForm(sectionName, "phone", val)
							}
						/>
					</Match>
				</Switch>

				<TextInput
					field={section().managerName!}
					updateForm={(val) =>
						props.updateRestOfForm(sectionName, "managerName", val)
					}
				/>
				<CalendarInput
					field={section().expectedLaunchDate!}
					onValueChange={(val: string) =>
						props.updateRestOfForm(sectionName, "expectedLaunchDate", val)
					}
				/>
				<TextInput
					field={section().communityReligion!}
					updateForm={(val) =>
						props.updateRestOfForm(sectionName, "communityReligion", val)
					}
				/>
			</div>
		</div>
	);
}

type Section3Props = {
	form: () => SeFormType;
	updateRestOfForm(
		section: string,
		key: string,
		value: string | boolean | string[],
	): void;
	binaryChoices: {
		yes: string;
		no: string;
	};
	showSecondFormSections: () => boolean;
	getLocalizedChoiceWithFallback: (node: {
		labels: Record<string, string>;
	}) => string;
	handleCheckboxFormValues({
		action,
		value,
		sectionName,
		fieldName,
	}: {
		action: "add" | "remove";
		value: string;
		sectionName: string;
		fieldName: string;
	}): void;
	labelSet: Record<string, string>;
	i18nDict: i18nDictType;
};

function Section3(props: Section3Props) {
	const section2Questions = () => props.form()!.sections!.secondSection!;
	const section2Name = "secondSection";
	return (
		<div>
			<SectionHeader header={props.i18nDict.seSection3} />

			<div id="section3se" class="flex flex-col gap-8">
				<BinaryRadioGroup
					binaryChoices={props.binaryChoices}
					field={section2Questions().haveReadBibleOutsideChurch!}
					updateForm={(value) =>
						props.updateRestOfForm(
							section2Name,
							"haveReadBibleOutsideChurch",
							value,
						)
					}
				/>
				<Show
					when={props.showSecondFormSections()}
					fallback={
						<SecondSectionFallback
							form={props.form}
							getLocalizedChoiceWithFallback={
								props.getLocalizedChoiceWithFallback
							}
							handleCheckboxFormValues={props.handleCheckboxFormValues}
							inputChoices={inputChoices}
							labelSet={props.labelSet}
						/>
					}
				>
					<div class="flex flex-col gap-8">
						<CheckBoxGroup
							choices={inputChoices.languagesBibleReadIn!}
							field={section2Questions().languagesBibleReadIn!}
							handleChange={(action: "add" | "remove", val: string) => {
								props.handleCheckboxFormValues({
									action,
									value: val,
									sectionName: section2Name,
									fieldName: "languagesBibleReadIn",
								});
							}}
							getLocalizedChoiceWithFallback={
								props.getLocalizedChoiceWithFallback
							}
							otherLabel={props.labelSet.otherLabel}
						/>
						<CheckBoxGroup
							choices={inputChoices.commonReadingMethod!}
							field={section2Questions().commonReadingMethod!}
							handleChange={(action: "add" | "remove", val: string) => {
								props.handleCheckboxFormValues({
									action,
									value: val,
									sectionName: section2Name,
									fieldName: "commonReadingMethod",
								});
							}}
							getLocalizedChoiceWithFallback={
								props.getLocalizedChoiceWithFallback
							}
							otherLabel={props.labelSet.otherLabel}
						/>
						<TextAreaInput
							field={section2Questions().whyReadThisWay!}
							updateForm={(val) =>
								props.updateRestOfForm(section2Name, "whyReadThisWay", val)
							}
						/>
					</div>
				</Show>
			</div>
		</div>
	);
}

function Section4(props: Section3Props) {
	const section3Questions = () => props.form()!.sections!.thirdSection!;
	const section3Name = "thirdSection";
	return (
		<div>
			<SectionHeader header={props.i18nDict.seSection4} />
			<div id="section4se" class="flex flex-col gap-8">
				<TextAreaInput
					field={section3Questions().desireToUse!}
					updateForm={(val) =>
						props.updateRestOfForm(section3Name, "desireToUse", val)
					}
				/>

				<CheckBoxGroup
					choices={inputChoices.toGuideLeadersWith!}
					field={section3Questions().toGuideLeadersWith!}
					handleChange={(action: "add" | "remove", val: string) => {
						props.handleCheckboxFormValues({
							action,
							value: val,
							sectionName: section3Name,
							fieldName: "toGuideLeadersWith",
						});
					}}
					getLocalizedChoiceWithFallback={props.getLocalizedChoiceWithFallback}
					otherLabel={props.labelSet.otherLabel}
				/>
				<CheckBoxGroup
					choices={inputChoices.toGuideMembersWith!}
					field={section3Questions().toGuideMembersWith!}
					handleChange={(action: "add" | "remove", val: string) => {
						props.handleCheckboxFormValues({
							action,
							value: val,
							sectionName: section3Name,
							fieldName: "toGuideMembersWith",
						});
					}}
					getLocalizedChoiceWithFallback={props.getLocalizedChoiceWithFallback}
					otherLabel={props.labelSet.otherLabel}
				/>
				<TextAreaInput
					field={section3Questions().questionsFromCommunity!}
					updateForm={(val) =>
						props.updateRestOfForm(section3Name, "questionsFromCommunity", val)
					}
				/>
			</div>
		</div>
	);
}

type Section5Props = {
	getLocalizedChoiceWithFallbackNested: (node: {
		labels: Record<string, Record<string, string>>;
	}) => Record<string, string>;
	i18nDict: i18nDictType;
};
function Section5(
	props: Omit<
		Section3Props,
		| "showSecondFormSections"
		| "handleCheckboxFormValues"
		| "getLocalizedChoiceWithFallback"
	> &
		Section5Props,
) {
	const thisSection = () => props.form()!.sections!.fourthSection!;
	const thisSectionName = "fourthSection";
	return (
		<div>
			<SectionHeader header={props.i18nDict.seSection5} />
			<div class="flex flex-col gap-8">
				<RadioGroupMaturity
					choices={maturityLevels}
					getLocalizedChoiceWithFallbackNested={
						props.getLocalizedChoiceWithFallbackNested
					}
					field={thisSection().averageMaturity!}
					updateForm={(val) =>
						props.updateRestOfForm(thisSectionName, "averageMaturity", val)
					}
				/>
				<TextInput
					field={thisSection().inChargePrinting!}
					updateForm={(val) =>
						props.updateRestOfForm(thisSectionName, "inChargePrinting", val)
					}
					type="text"
				/>
				<TextAreaInput
					field={thisSection().planToDistribute!}
					updateForm={(val) =>
						props.updateRestOfForm(thisSectionName, "planToDistribute", val)
					}
				/>
			</div>
		</div>
	);
}

function FallbackDisclaimer(props: { fallbackDisclaimer: string }) {
	return <div>{props.fallbackDisclaimer}</div>;
}

type FallbackContactFormProps = {
	i18nDict: i18nDictType;
	form: () => SeFormType;
	getLocalizedChoiceWithFallback: (node: {
		labels: Record<string, string>;
	}) => string;
	setForm: Setter<SeFormType>;
	inputChoices: InputChoicesType;
	setTurnstileToken: Setter<string>;
	turnstileToken: Accessor<string>;
	turnstilePublicKey: string;
	setFormNotSubmittedSuccessfully: Setter<boolean>;
	getDisclaimerQuestion: () =>
		| "seGeneralContactFallback"
		| "seNotAccessibility"
		| "seNoIdeaOfUse"
		| null;
};

function FallbackContactForm(props: FallbackContactFormProps) {
	// will need the form(), onSubmit and validation can be defined here though. Although, maybe we send this to scripture accessiblity regardless.  Or just different endpoints? Should they contact SA on their own?
	const section = () => props.form()!.generalContactFallback!;

	function validateFallbackState() {
		let isValid = true;
		let idToScrollTo = null;
		const formCopy = { ...props.form() };
		const useIds = ["email", "method", "message"];

		if (
			valIsWhatsApp(
				formCopy.generalContactFallback.preferEmailOrWhatsApp?.value,
			)
		) {
			// email required on other contact form, but this one has an option for whatsapp, so we hardcode a not provided here
			formCopy.generalContactFallback.email!.value = "Not provided";
		}
		if (props.getDisclaimerQuestion() === "seNotAccessibility") {
			formCopy.generalContactFallback.helpMethods!.value =
				contactFormContactMethodsValues.accessibility;
		}

		const validatedPayload = Object.values(formCopy.generalContactFallback).map(
			(input) => {
				const value = input.value;
				const hasCustomValidationFunction = Object.hasOwn(input, "isValid");
				if (hasCustomValidationFunction) {
					if (!input.isValid!()) {
						isValid = false;
						idToScrollTo ??= input.id;
						input.validationError = "Field is required";
					}
				} else {
					const isArrayField = Array.isArray(value);
					const isStringField = typeof value === "string";
					const isNotEmpty = input.value !== null;
					if (isStringField && !value?.trim().length) {
						isValid = false;
						idToScrollTo ??= input.id;
						input.validationError = "Field is required";
					}
					if (isArrayField && !value?.length) {
						isValid = false;
						idToScrollTo ??= input.id;
						input.validationError = "Field is required";
					}
					if (!isNotEmpty) {
						isValid = false;
						idToScrollTo ??= input.id;
						input.validationError = "Field is required";
					}
				}
				return {
					field: useIds.includes(input.id!) ? input.id : input.name,
					value: input.value,
				};
			},
		);
		const validatedFormData = new FormData();
		validatedFormData.append(
			"Form Name",
			"Contact Form - from Scripture Engagement Fallback",
		);
		validatedPayload
			.filter((i) => i.value)
			.forEach((input) => {
				validatedFormData.append(input.field!, input.value as string);
			});
		validatedFormData.append("cf-turnstile-response", props.turnstileToken());
		props.setForm(formCopy);
		return {
			isValid,
			idToScrollTo,
			validatedFormData,
		};
	}
	async function fallbackSubmit() {
		const { isValid, idToScrollTo, validatedFormData } =
			validateFallbackState();
		if (!isValid && idToScrollTo) {
			const node = document.getElementById(idToScrollTo);
			if (node) {
				node.scrollIntoView({ behavior: "smooth" });
			}
		} else {
			const res = await fetch("/api/contactForm", {
				method: "POST",
				body: validatedFormData,
			});
			const data = await res.json();
			if (data.success) {
				props.setFormNotSubmittedSuccessfully(true);
			}
		}
	}
	const updateForm = (key: string, value: string | boolean | string[]) => {
		props.setForm((prev) => {
			const newForm = { ...prev };
			newForm.generalContactFallback![key]!.value = value;
			return newForm;
		});
	};
	const fallbackDisclaimer = props.getDisclaimerQuestion()
		? props.i18nDict[props.getDisclaimerQuestion()!]
		: props.i18nDict.seGeneralContactFallback;

	return (
		<div class="flex flex-col gap-8">
			<FallbackDisclaimer fallbackDisclaimer={fallbackDisclaimer} />
			<TextInput
				field={section().email!}
				updateForm={(val) => updateForm("email", val)}
				type="email"
			/>
			<Show when={props.getDisclaimerQuestion() !== "seNotAccessibility"}>
				<MultiRadioGroup
					choices={props.inputChoices.contactFallbackHelpMethods!}
					getLocalizedChoiceWithFallback={props.getLocalizedChoiceWithFallback}
					field={section().helpMethods!}
					updateForm={(val) => {
						return updateForm("helpMethods", val);
					}}
				/>
			</Show>
			<TextAreaInput
				field={section().message!}
				updateForm={(val) => updateForm("message", val)}
			/>
			<SubmitSection
				i18nDict={props.i18nDict}
				onSubmit={fallbackSubmit}
				setTurnstileToken={props.setTurnstileToken}
				turnstilePublicKey={props.turnstilePublicKey}
			/>
		</div>
	);
}

type SubmitSectionProps = {
	setTurnstileToken: Setter<string>;
	onSubmit: () => void;
	i18nDict: i18nDictType;
	turnstilePublicKey: string;
};
function SubmitSection(props: SubmitSectionProps) {
	let turnstileRef: HTMLDivElement | undefined;
	const [hasRenderedTurnstile, setHasRenderedTurnstile] = createSignal(false);
	onMount(() => {
		if (!hasRenderedTurnstile() && turnstileRef && "turnstile" in window) {
			// @ts-expect-error https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
			window.turnstile.render(turnstileRef, {
				sitekey: props.turnstilePublicKey,
				callback: (token: string) => {
					props.setTurnstileToken(token);
				},
			});

			setHasRenderedTurnstile(true);
		}
	});
	return (
		<>
			<div
				ref={turnstileRef}
				class="cf-turnstile"
				data-theme="light"
				data-size=""
			/>
			<button
				type="button"
				onClick={props.onSubmit}
				class={
					"px-14 bg-brand-base text-onSurface-invert border-2 border-b-4 border-solid border-brand-darkest py-1 mt-8  hover:(bg-brand-base/80 text-onSurface-invert) rounded-xl w-fit disabled:(opacity-50 cursor-not-allowed) focus:(bg-brand-base ring-2 ring-offset-8 ring-brand-base text-onSurface-invert)"
				}
			>
				{props.i18nDict.submitForm}
			</button>
		</>
	);
}
