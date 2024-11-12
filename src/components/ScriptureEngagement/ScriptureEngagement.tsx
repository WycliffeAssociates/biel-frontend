import {createSignal, For, Match, onMount, Show, Switch} from "solid-js";
import {RadioGroup} from "@kobalte/core/radio-group";
import {
  getBinaryChoiceLabelsLocalized,
  inputChoices,
  questionLabels,
  disclaimerMessages,
  type InputChoicesType,
  maturityLevels,
} from "@components/ScriptureEngagement/choices";
import {TextField} from "@kobalte/core/text-field";
import {Checkbox} from "@kobalte/core/checkbox";
import {DatePicker} from "@ark-ui/solid/date-picker";
import {Index, Portal} from "solid-js/web";
import intlTelInput, {type Iti} from "intl-tel-input";
import type {i18nDictType} from "@src/i18n/strings";

type ScriptureEngagementFormProps = {
  languageCode: string;
  i18nDict: i18nDictType;
};
type PrelimaryQuestion = {
  value: boolean | null | string;
  label: string | undefined;
  name: string | undefined;
  show: () => boolean;
};
type SeFormType = {
  preliminaryRadios: Array<PrelimaryQuestion>;
  sections: {
    [sectionName: string]: {
      [fieldName: string]: {
        value: string | boolean | string[] | null;
        label: string | undefined;
        subLabel?: string | undefined;
        supportsOther?: boolean;
        name: string | undefined;
        show?: () => boolean;
      };
    };
  };
};

const labelClasses = "font-600 text-onSurface-primary font-step-1  block";

export function ScriptureEngagementForm(props: ScriptureEngagementFormProps) {
  const labelSet = questionLabels[props.languageCode] || questionLabels.en!;
  const disclaimers =
    disclaimerMessages[props.languageCode] || disclaimerMessages.en!;
  const enLabelSet = questionLabels.en!;
  const binaryChoices = getBinaryChoiceLabelsLocalized(props.languageCode);
  const [formNotSubimittedSuccessfully, setFormNotSubimittedSuccessfully] =
    createSignal(false);
  const [form, setForm] = createSignal<SeFormType>({
    preliminaryRadios: [
      {
        value: null,
        label: labelSet.currentlyWorking,
        name: enLabelSet.currentlyWorking,
        show: () => true,
      },
      {
        value: null,
        label: labelSet.nearlyDoneRefining,
        name: enLabelSet.nearlyDoneRefining,
        show: (): boolean =>
          form().preliminaryRadios[0]!.value !== "neverWorked" &&
          form().preliminaryRadios[0]!.value !== null,
      },
      {
        value: null,
        label: labelSet.hasContactedScriptureAccessiblity,
        name: enLabelSet.hasContactedScriptureAccessiblity,
        show: (): boolean => form().preliminaryRadios[1]!.value === true,
      },
      {
        value: null,
        label: labelSet.ideaOfUse,
        name: enLabelSet.ideaOfUse,
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
          value: "",
          label: labelSet.namesOfAssessors,
          subLabel: labelSet.namesOfAssessorsSubLabel,
          name: enLabelSet.namesOfAssessors,
        },
        langNameAndCode: {
          value: "",
          label: labelSet.langNameAndCode,
          name: enLabelSet.langNameAndCode,
        },
        preferEmailOrWhatsApp: {
          value: null, //email or phone
          label: labelSet.prefferredContact,
          name: enLabelSet.prefferredContact,
        },
        email: {
          value: "",
          label: labelSet.email,
          subLabel: labelSet.emailSubLabel,
          name: enLabelSet.email,
        },
        phone: {
          value: "",
          label: labelSet.phone,
          subLabel: labelSet.phoneSubLabel,
          name: enLabelSet.phone,
        },
        managerName: {
          value: "",
          label: labelSet.managerName,
          subLabel: labelSet.managerNameSubLabel,
          name: enLabelSet.managerName,
        },
        expectedLaunchDate: {
          value: "",
          label: labelSet.expectedLaunchDate,
          subLabel: labelSet.expectedLaunchDateSubLabel,
          name: enLabelSet.expectedLaunchDate,
        },
        communityReligion: {
          value: "",
          label: labelSet.communityReligion,
          name: enLabelSet.communityReligion,
        },
      },
      secondSection: {
        haveReadBibleOutsideChurch: {
          value: null,
          label: labelSet.haveReadBibleOutsideChurch,
          subLabel: labelSet.haveReadBibleOutsideChurchSubLabel,
          name: enLabelSet.haveReadBibleOutsideChurch,
          show: () => true,
        },
        languagesBibleReadIn: {
          value: "",
          label: labelSet.languagesBibleReadIn,
          subLabel: labelSet.languagesBibleReadInSubLabel,
          name: enLabelSet.languagesBibleReadIn,
          show: (): boolean => showSecondFormSections(),
          supportsOther: true,
        },
        commonReadingMethod: {
          value: "",
          label: labelSet.commonReadingMethod,
          subLabel: labelSet.commonReadingMethodSubLabel,
          name: enLabelSet.commonReadingMethod,
          show: (): boolean => showSecondFormSections(),
          supportsOther: true,
        },
        whyReadThisWay: {
          value: "",
          label: labelSet.whyReadThisWay,
          name: enLabelSet.whyReadThisWay,
          show: (): boolean => showSecondFormSections(),
        },
        whyNotReadBibleOutsideChurch: {
          value: "",
          label: labelSet.whyNotReadBibleOutsideChurch,
          name: enLabelSet.whyNotReadBibleOutsideChurch,
          subLabel: labelSet.whyNotReadBibleOutsideChurchSubLabel,
          show: () => true,
          supportsOther: true,
        },
      },
      thirdSection: {
        desireToUse: {
          value: "",
          label: labelSet.desireToUse,
          subLabel: labelSet.desireToUseSubLabel,
          name: enLabelSet.desireToUse,
        },
        wouldHelpBetterUse: {
          value: "",
          label: labelSet.wouldHelpBetterUse,
          subLabel: labelSet.wouldHelpBetterUseSubLabel,
          name: enLabelSet.wouldHelpBetterUse,
        },
        toGuideLeadersWith: {
          value: [],
          label: labelSet.toGuideLeadersWith,
          subLabel: labelSet.toGuideLeadersWithSubLabel,
          name: enLabelSet.toGuideLeadersWith,
          supportsOther: true,
        },
        toGuideMembersWith: {
          value: [],
          label: labelSet.toGuideMembersWith,
          subLabel: labelSet.toGuideMembersWithSubLabel,
          name: enLabelSet.toGuideMembersWith,
          supportsOther: true,
        },
        churchMembersToSelect: {
          value: "",
          label: labelSet.churchMembersToSelect,
          subLabel: labelSet.churchMembersToSelectSubLabel,
          name: enLabelSet.churchMembersToSelect,
        },
        questionsFromCommunity: {
          value: "",
          label: labelSet.questionsFromCommunity,
          subLabel: labelSet.questionsFromCommunitySubLabel,
          name: enLabelSet.questionsFromCommunity,
        },
      },
      fourthSection: {
        averageMaturity: {
          value: "",
          label: labelSet.averageMaturity,
          name: enLabelSet.averageMaturity,
        },
        inChargePrinting: {
          value: "",
          label: labelSet.inChargePrinting,
          name: enLabelSet.inChargePrinting,
        },
        planToDistribute: {
          value: "",
          label: labelSet.planToDistribute,
          subLabel: labelSet.planToDistributeSubLabel,
          name: enLabelSet.planToDistribute,
        },
      },
    },
  });

  const doHideRestOfForm = () => {
    return form()
      .preliminaryRadios.slice(1)
      .some((radio) => radio.value !== true);
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
      const newForm = {...prev};
      newForm.preliminaryRadios[arrIdx]!.value = value;
      return newForm;
    });
    console.log(getFlattenFormState());
  }
  function updateRestOfForm(
    section: string,
    key: string,
    value: string | boolean | string[]
  ) {
    setForm((prev) => {
      const newForm = {...prev};
      newForm.sections[section]![key]!.value = value;
      return newForm;
    });
    console.log(getFlattenFormState());
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
      const newForm = {...prev};
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
    console.log(getFlattenFormState());
  }
  function getFlattenFormState() {
    const preliminaryValues = form().preliminaryRadios.map((input) => {
      return {
        field: input.name,
        value: input.value,
      };
    });
    const sectionValues = Object.values(form().sections).flatMap((section) => {
      return Object.values(section).map((input) => {
        return {
          field: input.name,
          value: input.value,
        };
      });
    });
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

  async function onSubmit() {
    // todo: validate and show errors

    // Take flattened form state and send to enpoint;
    try {
      const payload = getFlattenFormState();

      const res = await fetch("/api/seForm", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        setFormNotSubimittedSuccessfully(true);
        console.log("all was good");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div class="seForm py-4 w-full bg-surface-primary md:rounded-80px  md:p-20 max-w-5xl mx-auto">
      <Show
        when={!formNotSubimittedSuccessfully()}
        fallback={<ThankYouSuccess dict={props.i18nDict} />}
      >
        <div class="flex flex-col gap-20">
          <Section1
            getLocalizedChoiceWithFallback={getLocalizedChoiceWithFallback}
            binaryChoices={binaryChoices}
            form={form}
            updatePreliminaryRadio={updatePreliminaryRadio}
          />
          {/* Main form */}
          <Show
            when={!doHideRestOfForm()}
            fallback={
              <Disclaimer
                disclaimers={disclaimers}
                showWhen={doShowDisclaimer()}
                preliminaryChoices={form().preliminaryRadios}
              />
            }
          >
            <section>
              {/* todo intl */}
              <Section2
                form={form}
                updateRestOfForm={updateRestOfForm}
                getLocalizedChoiceWithFallback={getLocalizedChoiceWithFallback}
                inputChoices={inputChoices}
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
              />
            </section>

            <Show
              when={
                form()?.sections?.secondSection?.haveReadBibleOutsideChurch
                  ?.value !== null
              }
            >
              <section>
                <Section5
                  form={form}
                  updateRestOfForm={updateRestOfForm}
                  binaryChoices={binaryChoices}
                  getLocalizedChoiceWithFallbackNested={
                    getLocalizedChoiceWithFallbackNested
                  }
                  labelSet={labelSet}
                />
              </section>
            </Show>
          </Show>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          class={
            "px-14 bg-brand-base text-onSurface-invert border-2 border-b-4 border-solid border-brand-darkest py-1 mt-8  hover:(bg-brand-base/80 text-onSurface-invert) rounded-xl w-fit disabled:(opacity-50 cursor-not-allowed)"
          }
        >
          {props.i18nDict.submitForm}
        </button>
      </Show>
    </div>
  );
} // todo: split each section into a component to reduce verbosity:
// Validations on data.
// Make a form or nah?
function ThankYouSuccess(props: {dict: i18nDictType}) {
  return (
    <div class="grid h-full w-full min-h-50vh place-content-center">
      {props.dict.contactSuccessTitle}
    </div>
  );
}
type RadioGroupProps = {
  label: string;
  subLabel?: string;
  updateForm(value: boolean): void;
  binaryChoices: {yes: string; no: string};
};
function BinaryRadioGroup(props: RadioGroupProps) {
  return (
    <RadioGroup
      data-name="radio-group"
      class="text-onSurface-secondary data-checked:[text-brand-base]"
      onChange={(val) => props.updateForm(val === "yes")}
    >
      <RadioGroup.Label data-name="radio-group__label" class={labelClasses}>
        {props.label}
      </RadioGroup.Label>
      <Show when={props.subLabel}>
        <p>{props.subLabel}</p>
      </Show>
      <div
        data-name="radio-group__items"
        role="presentation"
        class="flex flex-col gap-4 mbs-4"
      >
        <For each={Object.entries(props.binaryChoices)}>
          {([key, label]) => (
            <RadioGroup.Item
              value={key}
              class="radio flex items-center gap-2 px-2 py-1 rounded-lg text-inherit focus-within:(ring-2 ring-offset-2 ring-brand-base)"
            >
              <RadioGroup.ItemInput data-name="radio__input" />
              <RadioGroup.ItemControl
                data-name="radio__control"
                class="border border-solid border-surface-border rounded-full shrink-0 size-4 w-4 h-4 flex items-center justify-center data-checked:[border-inherit]"
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
  label: string;
  subLabel?: string;
  choices: Array<{labels: Record<string, string>; value: string}>;
  updateForm(value: string): void;
  getLocalizedChoiceWithFallback: (node: {
    labels: Record<string, string>;
  }) => string;
};
function MultiRadioGroup(props: MultiRadioGroupProps) {
  return (
    <RadioGroup
      data-name="radio-group"
      class="text-onSurface-secondary data-checked:[text-brand-base]"
      onChange={(val) => props.updateForm(val)}
    >
      <RadioGroup.Label data-name="radio-group__label" class={labelClasses}>
        {props.label}
      </RadioGroup.Label>
      <Show when={props.subLabel}>
        <p>{props.subLabel}</p>
      </Show>
      <div
        data-name="radio-group__items"
        role="presentation"
        class="flex flex-col gap-4 mbs-4"
      >
        <For each={props.choices}>
          {(choice) => (
            <RadioGroup.Item
              value={choice.value}
              class="radio flex items-center gap-2 px-2 py-1 rounded-lg text-inherit focus-within:(ring-2 ring-offset-2 ring-brand-base)"
            >
              <RadioGroup.ItemInput data-name="radio__input" />
              <RadioGroup.ItemControl
                data-name="radio__control"
                class="border border-solid border-surface-border rounded-full shrink-0 size-4 w-4 h-4 flex items-center justify-center data-[checked]:(border-brand-base)"
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
      class="text-onSurface-secondary data-checked:[text-brand-base]"
      onChange={(val) => props.updateForm(val)}
    >
      <RadioGroup.Label data-name="radio-group__label" class={labelClasses}>
        {props.label}
      </RadioGroup.Label>
      <Show when={props.subLabel}>
        <p>{props.subLabel}</p>
      </Show>
      <div
        data-name="radio-group__items"
        role="presentation"
        class="flex flex-col gap-4"
      >
        <For each={props.choices}>
          {(choice) => (
            <RadioGroup.Item
              value={choice.value}
              class="radio flex items-center gap-2 px-2 py-1 rounded-lg text-inherit items-start! focus-within:(ring-2 ring-offset-2 ring-brand-base)"
            >
              <RadioGroup.ItemInput data-name="radio__input" />
              <RadioGroup.ItemControl
                data-name="radio__control"
                class="border border-solid border-surface-border rounded-full shrink-0 size-4 shrink-0 flex items-center justify-center data-checked:[border-inherit] transform translate-y-1/2"
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
  label: string;
  subLabel?: string;
  updateForm(value: string): void;
  type?: string;
};
function TextInput(props: TextInputProps) {
  return (
    <TextField class="flex flex-col gap-4">
      <TextField.Label class={labelClasses}>{props.label}</TextField.Label>
      <Show when={props.subLabel}>
        <p>{props.subLabel}</p>
      </Show>
      <TextField.Input
        onInput={(e) => props.updateForm(e.currentTarget.value)}
        type={props.type || "text"}
        class="rounded-xl bg-surface-secondary p-4 text-onSurface-primary"
      />
    </TextField>
  );
}

type CheckBoxGroupProps = {
  label: string;
  subLabel?: string;
  supportsOther?: boolean;
  choices: Array<{labels: Record<string, string>; value: string}>;
  handleChange: (action: "add" | "remove", value: string) => void;
  getLocalizedChoiceWithFallback: (node: {
    labels: Record<string, string>;
  }) => string;
  otherLabel?: string;
};
function CheckBoxGroup(props: CheckBoxGroupProps) {
  // const [otherValue, setOtherValue] = createSignal("");
  const [otherIsChecked, setOtherChecked] = createSignal(false);
  return (
    <div class="flex flex-col gap-4">
      <label for={props.label} class={labelClasses}>
        {props.label}
      </label>
      <Show when={props.subLabel}>
        <p>{props.subLabel}</p>
      </Show>
      <For each={props.choices}>
        {(choice) => {
          return (
            <Checkbox
              name={props.label}
              class="flex items-center gap-2 text-onSurface-secondary focus-within:(ring-2 ring-offset-2 ring-brand-primary)"
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
      <Show when={props.supportsOther}>
        <div class="flex gap-2 text-onSurface-secondary">
          <Checkbox
            name={props.label}
            class="flex items-center gap-2 focus-within:(ring-2 ring-offset-2 ring-brand-primary)"
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
                // console.log(e);
                props.handleChange("add", `Other - ${e.currentTarget.value}`);
              }}
              class="border-b! border-surface-border! border-solid! bg-transparent! w-full "
            />
          </Show>
        </div>
      </Show>
    </div>
  );
}
function TextAreaInput(props: TextInputProps) {
  return (
    <TextField class="flex flex-col gap-4">
      <TextField.Label class={labelClasses}>{props.label}</TextField.Label>
      <Show when={props.subLabel}>
        <p>{props.subLabel}</p>
      </Show>
      <TextField.TextArea
        autoResize={false}
        class="p-4 rounded-lg min-h-40"
        placeholder="Type here"
        onInput={(e) => props.updateForm(e.currentTarget.value)}
      />
    </TextField>
  );
}

type CalendarInputProps = {
  label: string;
  subLabel?: string;
  onValueChange: (v: string) => void;
};

function CalendarInput(props: CalendarInputProps) {
  const triggerClasses =
    "focus:bg-brand-base focus:ring-4 focus:ring-brand focus:ring-offset-6 aspect-square rounded-lg p-1 bg-brand border-x-2 border-t-2 border-b-4 border-brand-darkest bg-brand-base text-onSurface-invert! flex gap-2 items-center hover:bg-brand-darkest active:bg-brand-darkest ";
  const rangeTextClasses = "font-700 font-step-1";
  return (
    <DatePicker.Root
      locale={globalThis?.navigator?.language || "en-US"}
      positioning={{
        placement: "bottom-start",
        arrowPadding: 0,
        gutter: 0,
        sameWidth: true,
      }}
      onValueChange={(v) => {
        const formattedEn = new Intl.DateTimeFormat("en-us", {
          dateStyle: "long",
        }).format(new Date(v.valueAsString[0]!));
        return props.onValueChange(formattedEn);
      }}
    >
      <DatePicker.Label class={labelClasses}>{props.label}</DatePicker.Label>
      <Show when={props.subLabel}>
        <p>{props.subLabel}</p>
      </Show>

      <DatePicker.Control class="relative flex bg-surface-secondary items-center flex-nowrap rtl:flex-reverse px-2 rounded-xl w-full">
        <span class="i-material-symbols:calendar-today-outline-rounded w-1em h-1em " />
        <DatePicker.Trigger class="w-full">
          <DatePicker.Input class="py-4 px-4 w-full text-onSurface-primary bg-inherit" />
        </DatePicker.Trigger>
        {/* <DatePicker.ClearTrigger>Clear</DatePicker.ClearTrigger> */}
      </DatePicker.Control>

      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content class="rounded-2xl bg-surface-primary shadow-md p-4 font-step-0 ">
            {/* <DatePicker.YearSelect /> */}
            {/* <DatePicker.MonthSelect /> */}
            <DatePicker.View view="day">
              <DatePicker.Context>
                {(context) => (
                  <>
                    <DatePicker.ViewControl class="flex w-full justify-between mb-4">
                      <DatePicker.PrevTrigger class={triggerClasses}>
                        <span class="i-material-symbols:arrow-back rtl:i-material-symbols:arrow-forward" />
                      </DatePicker.PrevTrigger>
                      <DatePicker.ViewTrigger>
                        <DatePicker.RangeText class={rangeTextClasses} />
                      </DatePicker.ViewTrigger>
                      <DatePicker.NextTrigger class={triggerClasses}>
                        <span class="i-material-symbols:arrow-forward rtl:i-material-symbols:arrow-back" />
                      </DatePicker.NextTrigger>
                    </DatePicker.ViewControl>

                    <DatePicker.Table class="w-full">
                      <DatePicker.TableHead class="">
                        <DatePicker.TableRow class="w-full  grid grid-cols-7">
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
                                    <DatePicker.TableCellTrigger class="text-center rounded-lg hover:(bg-brand-light text-brand-base) p-3 data-[disabled]:(opacity-40 cursor-not-allowed) data-[selected]:(bg-brand-base text-onSurface-invert)">
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
                    <DatePicker.ViewControl class="flex w-full justify-between mb-4">
                      <DatePicker.PrevTrigger class={triggerClasses}>
                        <span class="i-material-symbols:arrow-back rtl:i-material-symbols:arrow-forward" />
                      </DatePicker.PrevTrigger>
                      <DatePicker.ViewTrigger>
                        <DatePicker.RangeText class={rangeTextClasses} />
                      </DatePicker.ViewTrigger>
                      <DatePicker.NextTrigger class={triggerClasses}>
                        <span class="i-material-symbols:arrow-forward rtl:i-material-symbols:arrow-back" />
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
                                    <DatePicker.TableCellTrigger class="text-center rounded-lg hover:(bg-brand-light text-brand-base) focus:bg-surface-secondary p-3">
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
                    <DatePicker.ViewControl class="flex w-full justify-between mb-4">
                      <DatePicker.PrevTrigger class={triggerClasses}>
                        <span class="i-material-symbols:arrow-back rtl:i-material-symbols:arrow-forward" />
                      </DatePicker.PrevTrigger>
                      <DatePicker.ViewTrigger>
                        <DatePicker.RangeText class={rangeTextClasses} />
                      </DatePicker.ViewTrigger>
                      <DatePicker.NextTrigger class={triggerClasses}>
                        <span class="i-material-symbols:arrow-forward rtl:i-material-symbols:arrow-back" />
                      </DatePicker.NextTrigger>
                    </DatePicker.ViewControl>

                    <DatePicker.Table class="w-full">
                      <DatePicker.TableBody>
                        <Index each={context().getYearsGrid({columns: 4})}>
                          {(years) => (
                            <DatePicker.TableRow>
                              <Index each={years()}>
                                {(year) => (
                                  <DatePicker.TableCell
                                    value={year().value}
                                    class=""
                                  >
                                    <DatePicker.TableCellTrigger class="text-center rounded-lg hover:(bg-brand-light text-brand-base)focus:bg-surface-secondary p-3">
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
  label: string;
  subLabel?: string;
  onUpdate: (value: string) => void;
};
function TelInput(props: TelInputProps) {
  let inputRef: HTMLInputElement;
  const [telInstance, setTelInstance] = createSignal<Iti | null>(null);
  const [isValid, setIsValid] = createSignal(false);

  onMount(() => {
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
    <div class="flex flex-col gap-4 w-full">
      <label for="phone" class={labelClasses}>
        {props.label}
      </label>

      <Show when={props.subLabel}>
        <p>{props.subLabel}</p>
      </Show>
      <input
        /* @ts-ignore */
        ref={inputRef}
        type="phone"
        name="phone"
        id="phone"
        class={`w-full bg-surface-secondary rounded-lg p-2 ${
          !isValid() && "border-2 border-error-onSurface"
        }`}
        onInput={(e) => {
          console.log(e.target.value);
          const instance = telInstance();
          if (instance?.isValidNumber()) {
            setIsValid(true);
          }
        }}
      />
    </div>
  );
}

function Disclaimer(props: {
  showWhen: boolean;
  preliminaryChoices: Array<PrelimaryQuestion>;
  disclaimers: Record<string, string>;
}) {
  const messageKey = () => {
    const choices = props.preliminaryChoices;
    if (choices[0]!.value === "neverWorked") {
      return "forCompletedPartners";
    }
    if (choices[1]?.value === false) {
      return "forAfterPublish";
    }
    if (choices[2]?.value === false) {
      return "forAfterRefinement";
    }
    if (choices[3]?.value === false) {
      return "forDiscussWithCommunity";
    }
  };
  return <Show when={props.showWhen}>{props.disclaimers[messageKey()!]}</Show>;
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
        label={section.label!}
        subLabel={section.subLabel!}
        handleChange={(action: "add" | "remove", val: string) => {
          props.handleCheckboxFormValues({
            action,
            value: val,
            sectionName: "secondSection",
            fieldName: "whyNotReadBibleOutsideChurch",
          });
        }}
        getLocalizedChoiceWithFallback={props.getLocalizedChoiceWithFallback}
        supportsOther={section.supportsOther}
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
};

function SectionHeader(props: {header: string}) {
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
      <SectionHeader header="Section 1" />
      <ul class="list list-none flex flex-col gap-8">
        <li>
          <MultiRadioGroup
            choices={inputChoices.projectStatus!}
            getLocalizedChoiceWithFallback={
              props.getLocalizedChoiceWithFallback
            }
            label={section[0]!.label!}
            updateForm={(value: string) =>
              props.updatePreliminaryRadio(0, value)
            }
          />
        </li>
        <For each={section.slice(1)}>
          {(input, idx) => (
            <Show when={input.show()}>
              <li>
                <BinaryRadioGroup
                  binaryChoices={props.binaryChoices}
                  label={input.label!}
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
    value: string | boolean | string[]
  ): void;
  inputChoices: InputChoicesType;
  getLocalizedChoiceWithFallback: (node: {
    labels: Record<string, string>;
  }) => string;
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
      <SectionHeader header="Section 2" />
      <div class="flex flex-col gap-8">
        <TextInput
          label={section().assessorNames!.label!}
          subLabel={section().assessorNames!.subLabel}
          updateForm={(val) =>
            props.updateRestOfForm(sectionName, "assessorNames", val)
          }
        />
        <TextInput
          label={section().langNameAndCode!.label!}
          subLabel={section().langNameAndCode!.subLabel}
          updateForm={(val) =>
            props.updateRestOfForm(sectionName, "langNameAndCode", val)
          }
        />
        <MultiRadioGroup
          choices={props.inputChoices.preferredContact!}
          getLocalizedChoiceWithFallback={props.getLocalizedChoiceWithFallback}
          label={section().preferEmailOrWhatsApp!.label!}
          updateForm={(val) =>
            props.updateRestOfForm(sectionName, "preferEmailOrWhatsApp", val)
          }
        />
        <Switch>
          <Match when={doShowInput("email")}>
            <TextInput
              label={section().email!.label!}
              subLabel={section().email!.subLabel}
              updateForm={(val) =>
                props.updateRestOfForm(sectionName, "email", val)
              }
              type="email"
            />
          </Match>
          <Match when={doShowInput("whatsapp")}>
            <TelInput
              label={section().phone!.label!}
              subLabel={section().phone!.subLabel}
              onUpdate={(val) =>
                props.updateRestOfForm(sectionName, "phone", val)
              }
            />
          </Match>
        </Switch>

        <TextInput
          label={section().managerName!.label!}
          subLabel={section().managerName!.subLabel}
          updateForm={(val) =>
            props.updateRestOfForm(sectionName, "managerName", val)
          }
        />
        <CalendarInput
          label={section().expectedLaunchDate!.label!}
          subLabel={section().expectedLaunchDate!.subLabel!}
          onValueChange={(val: string) =>
            props.updateRestOfForm(sectionName, "expectedLaunchDate", val)
          }
        />
        {/* todo: date picker */}
      </div>
    </div>
  );
}

type Section3Props = {
  form: () => SeFormType;
  updateRestOfForm(
    section: string,
    key: string,
    value: string | boolean | string[]
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
};

function Section3(props: Section3Props) {
  const section2Questions = () => props.form()!.sections!.secondSection!;
  const section2Name = "secondSection";
  return (
    <div>
      <SectionHeader header="Section 3" />

      <div id="section3se" class="flex flex-col gap-8">
        <BinaryRadioGroup
          binaryChoices={props.binaryChoices}
          label={section2Questions()!.haveReadBibleOutsideChurch!.label!}
          updateForm={(value) =>
            props.updateRestOfForm(
              section2Name,
              "haveReadBibleOutsideChurch",
              value
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
              label={section2Questions().languagesBibleReadIn!.label!}
              subLabel={section2Questions().languagesBibleReadIn!.subLabel!}
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
              supportsOther={
                section2Questions().languagesBibleReadIn!.supportsOther
              }
              otherLabel={props.labelSet.otherLabel}
            />
            <CheckBoxGroup
              choices={inputChoices.commonReadingMethod!}
              label={section2Questions().commonReadingMethod!.label!}
              subLabel={section2Questions().commonReadingMethod!.subLabel!}
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
              supportsOther={
                section2Questions().commonReadingMethod!.supportsOther
              }
              otherLabel={props.labelSet.otherLabel}
            />
            <TextAreaInput
              label={section2Questions().whyReadThisWay!.label!}
              subLabel={section2Questions().whyReadThisWay!.subLabel}
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
    // these are also only relevant when there is current reading
    <Show when={props.showSecondFormSections()}>
      <SectionHeader header="Section 4" />
      <div id="section4se" class="flex flex-col gap-8">
        <TextAreaInput
          label={section3Questions().desireToUse!.label!}
          subLabel={section3Questions().desireToUse!.subLabel}
          updateForm={(val) =>
            props.updateRestOfForm(section3Name, "desireToUse", val)
          }
        />

        <CheckBoxGroup
          choices={inputChoices.toGuideLeadersWith!}
          label={section3Questions().toGuideLeadersWith!.label!}
          subLabel={section3Questions().toGuideLeadersWith!.subLabel!}
          handleChange={(action: "add" | "remove", val: string) => {
            props.handleCheckboxFormValues({
              action,
              value: val,
              sectionName: section3Name,
              fieldName: "toGuideLeadersWith",
            });
          }}
          getLocalizedChoiceWithFallback={props.getLocalizedChoiceWithFallback}
          supportsOther={section3Questions().toGuideLeadersWith!.supportsOther}
          otherLabel={props.labelSet.otherLabel}
        />
        <CheckBoxGroup
          choices={inputChoices.toGuideMembersWith!}
          label={section3Questions().toGuideMembersWith!.label!}
          subLabel={section3Questions().toGuideMembersWith!.subLabel!}
          handleChange={(action: "add" | "remove", val: string) => {
            props.handleCheckboxFormValues({
              action,
              value: val,
              sectionName: section3Name,
              fieldName: "toGuideMembersWith",
            });
          }}
          getLocalizedChoiceWithFallback={props.getLocalizedChoiceWithFallback}
          supportsOther={section3Questions().toGuideMembersWith!.supportsOther}
          otherLabel={props.labelSet.otherLabel}
        />
        <TextAreaInput
          label={section3Questions().questionsFromCommunity!.label!}
          subLabel={section3Questions().questionsFromCommunity!.subLabel}
          updateForm={(val) =>
            props.updateRestOfForm(section3Name, "questionsFromCommunity", val)
          }
        />
      </div>
    </Show>
  );
}

type Section5Props = {
  getLocalizedChoiceWithFallbackNested: (node: {
    labels: Record<string, Record<string, string>>;
  }) => Record<string, string>;
};
function Section5(
  props: Omit<
    Section3Props,
    | "showSecondFormSections"
    | "handleCheckboxFormValues"
    | "getLocalizedChoiceWithFallback"
  > &
    Section5Props
) {
  const thisSection = props.form()!.sections!.fourthSection!;
  const thisSectionName = "fourthSection";
  return (
    <div>
      <SectionHeader header="Section 5" />
      <div class="flex flex-col gap-8">
        <RadioGroupMaturity
          choices={maturityLevels}
          getLocalizedChoiceWithFallbackNested={
            props.getLocalizedChoiceWithFallbackNested
          }
          label={thisSection.averageMaturity!.label!}
          updateForm={(val) =>
            props.updateRestOfForm(thisSectionName, "averageMaturity", val)
          }
        />
        <TextInput
          label={thisSection.inChargePrinting!.label!}
          subLabel={thisSection.inChargePrinting!.subLabel}
          updateForm={(val) =>
            props.updateRestOfForm(thisSectionName, "inChargePrinting", val)
          }
          type="text"
        />
        <TextAreaInput
          label={thisSection.planToDistribute!.label!}
          subLabel={thisSection.planToDistribute!.subLabel}
          updateForm={(val) =>
            props.updateRestOfForm(thisSectionName, "planToDistribute", val)
          }
        />
      </div>
    </div>
  );
}
