import type {i18nDict} from "@src/i18n/strings";

import {Show, Suspense, createResource, createSignal} from "solid-js";
import {createStore} from "solid-js/store";

type ContactFormProps = {
  dict: i18nDict;
  languageCode: string;
};
export function ContactForm(props: ContactFormProps) {
  // todo: just change to a singular on submit. I don't care about granular createResource loading / error state.  Just the 2.
  //Care about, when submitting, the response
  const statuses = {
    unsubmitted: "unsubmitted",
    submitted: "submitted",
  };
  const [formStatus, setFormStatus] = createSignal({
    status: statuses.unsubmitted,
    success: false,
    errored: false,
  });

  async function fadeOutCmsFormIntro() {
    const cmsData = document.querySelector(
      "[data-js='contactCmsData']"
    ) as HTMLElement;
    if (cmsData) {
      const fadeEffect = (element: HTMLElement) => {
        return new Promise<void>((resolve) => {
          let opacity = 1;
          const startTime = performance.now();
          const duration = 350; // Duration in milliseconds (0.150 seconds)
          const fadeAnimation = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            opacity = 1 - progress;

            if (progress < 1) {
              element.style.opacity = opacity.toString();
              requestAnimationFrame(fadeAnimation);
            } else {
              element.style.opacity = "0";
              element.style.display = "none";
              resolve();
            }
          };
          requestAnimationFrame(fadeAnimation);
        });
      };
      await fadeEffect(cmsData);
    }
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setFormStatus((prev) => ({...prev, status: statuses.submitted}));
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await fetch("/api/contactForm", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    await fadeOutCmsFormIntro();
    setFormStatus({
      status: statuses.submitted,
      success: data.success,
      errored: data.success ? false : true,
    });
  }
  // function showForm() {
  //   const doShow = !response() || response.loading;
  //   return doShow;
  // }

  return (
    <Show
      when={!formStatus().success && !formStatus().errored}
      fallback={
        <ConfirmationMessage
          dict={props.dict}
          languageCode={props.languageCode}
          didSucceed={formStatus().success}
        />
      }
    >
      <form onSubmit={submit}>
        <span class="block mb-8">
          <span class="text-error-onSurface">*</span>
          {props.dict.requiredIndicator}
        </span>
        <div class="flex flex-col gap-4">
          <label class="flex flex-col gap-2 md:w-3/5">
            {props.dict.contactNameInput}
            <input
              type="text"
              name="name"
              required
              class="py-2 px-4 rounded-lg border border-surface-border text-onSurface-tertiary bg-surface-primary!"
              placeholder={props.dict.contactNamePlaceholder}
            />
          </label>
          <label class="flex flex-col gap-2 md:w-4/5">
            <span class="flex gap-2px mb-2">
              {props.dict.contactEmailInput}
              <span class="text-error-onSurface">*</span>
            </span>
            <input
              type="email"
              name="email"
              class="py-2 px-4 rounded-lg border border-surface-border text-onSurface-tertiary bg-surface-primary!"
              placeholder={props.dict.contactEmailPlaceholder}
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="flex gap-2px mb-2">
              {props.dict.contactMessageInput}
              <span class="text-error-onSurface">*</span>
            </span>
            <textarea
              placeholder={props.dict.contactMessagePlaceholder}
              name="message"
              rows="5"
              class="w-full py-2 px-2 rounded-lg border border-surface-border text-onSurface-tertiary bg-surface-primary!"
            ></textarea>
          </label>
          <button
            disabled={formStatus().status === statuses.submitted}
            type="submit"
            class={`px-3 py-1 text-brand-base border border-brand-base hover:(bg-brand-base text-onSurface-invert) rounded-lg w-fit disabled:(opacity-50 cursor-not-allowed)`}
          >
            Submit
          </button>
        </div>
      </form>
    </Show>
  );
}

function ConfirmationMessage(props: {
  dict: i18nDict;
  didSucceed: boolean;
  languageCode: string;
}) {
  return (
    <Show
      when={props.didSucceed}
      fallback={<FailedMessage dict={props.dict} />}
    >
      <div class="text-center flex flex-col justify-center items-center gap-4">
        <svg
          width="100"
          height="75"
          viewBox="0 0 100 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_3375_3605)">
            <path
              d="M20.8875 33.4114C19.6325 32.3393 18.502 31.121 17.3423 29.9393C17.0713 29.6639 16.8857 29.3082 16.7001 29.0475C12.3615 33.3773 8.21076 37.5219 4.00879 41.7127C4.13575 41.8516 4.31399 42.0685 4.5142 42.2658C13.2648 51.0009 22.0204 59.736 30.771 68.4711C31.5425 69.241 32.3556 69.8575 33.2053 70.3253C34.2088 70.1182 35.6957 69.5505 37.124 68.0227C39.402 65.5862 84.774 20.4464 92.0621 13.1952C89.0834 10.2689 86.09 7.33043 83.0185 4.31641C82.9159 4.45285 82.7035 4.83052 82.4081 5.12534C68.679 18.8383 54.9378 32.5391 41.2161 46.2594C39.7121 47.7627 38.0298 48.501 35.952 47.7993C35.2708 47.5678 34.5994 47.1317 34.0818 46.6273C31.2251 43.8423 28.4051 41.0159 25.5948 38.1822C24.7964 37.3781 24.711 36.4327 25.2677 35.8285L22.9872 33.5527C22.87 33.6623 22.7455 33.7452 22.6308 33.772C22.0961 33.9011 21.2928 33.7622 20.885 33.4138L20.8875 33.4114Z"
              fill="#7CDC85"
            />
            <path
              d="M84.3905 28.4043C84.6029 28.0486 84.9032 27.7367 85.1986 27.4419C88.7316 23.9089 92.2719 20.3832 95.8 16.8648C94.5523 15.6416 93.3096 14.4185 92.0619 13.1953C84.7738 20.4465 39.4018 65.5862 37.1238 68.0228C35.6955 69.5505 34.2086 70.1183 33.2051 70.3254C35.3512 71.5095 37.744 71.7215 40.3907 70.8931C41.9142 70.4155 43.1204 69.4336 44.2337 68.3201C55.9704 56.6026 67.7096 44.8877 79.4487 33.1727C79.7466 32.8754 80.0469 32.5733 80.3863 32.3296C81.0626 31.8472 81.7658 31.8326 82.3469 32.4247L84.5858 30.1903C84.1024 29.7176 84.0047 29.0427 84.3856 28.4019L84.3905 28.4043Z"
              fill="#63C76C"
            />
            <path
              d="M80.3916 32.3321C80.0523 32.5733 79.7495 32.8779 79.4541 33.1751C67.7125 44.8877 55.9758 56.6027 44.2391 68.3225C43.1257 69.4336 41.9196 70.418 40.396 70.8955C37.7494 71.724 35.3566 71.512 33.2105 70.3278C32.3608 69.86 31.5477 69.2436 30.7762 68.4736C22.0231 59.7385 13.27 51.0059 4.51939 42.2684C4.32162 42.071 4.14094 41.8542 4.01398 41.7153C8.21351 37.5244 12.3666 33.3798 16.7053 29.0501C16.8885 29.3083 17.0765 29.6665 17.3475 29.9418C18.5048 31.1236 19.6377 32.3418 20.8927 33.4139C21.3004 33.7624 22.1037 33.9012 22.6384 33.7721C22.7556 33.7453 22.8777 33.66 22.9949 33.5528C23.2756 33.2945 23.5198 32.8706 23.5296 32.566C23.5467 32.0324 23.239 31.3721 22.8557 30.9676C21.298 29.3156 19.6621 27.7367 18.0482 26.1359C16.7786 24.8762 16.1462 24.8811 14.8595 26.1627C10.24 30.7678 5.62298 35.3778 1.00595 39.9853C-0.339367 41.3303 -0.336926 41.9468 1.02304 43.3015C10.1668 52.4264 19.3056 61.5538 28.4518 70.6738C33.8111 76.0196 41.0748 76.0148 46.4414 70.6641C58.2538 58.8833 70.0613 47.1001 81.8688 35.3169C82.0983 35.0879 82.3351 34.8613 82.5305 34.6054C83.0872 33.872 82.9919 33.1264 82.406 32.4832C82.3889 32.4637 82.3693 32.4466 82.3522 32.4296C81.7711 31.8375 81.068 31.8521 80.3916 32.3345V32.3321Z"
              fill="#0E0E0E"
            />
            <path
              d="M99.814 16.285C99.3867 15.8026 98.9863 15.2958 98.5322 14.8401C94.0592 10.3642 89.5789 5.89793 85.0986 1.42684C83.6116 -0.0570209 83.0769 -0.0521477 81.568 1.45365C67.4434 15.5516 53.3189 29.6471 39.1943 43.745C38.9648 43.9741 38.7426 44.2129 38.496 44.4224C37.8002 45.0169 37.0799 45.0364 36.3963 44.4175C35.8909 43.9619 35.4221 43.4648 34.9386 42.9848C32.5947 40.6482 30.2483 38.3139 27.9117 35.9675C27.3087 35.3608 26.6348 35.0587 25.812 35.4364C25.5922 35.5387 25.4116 35.6703 25.2724 35.8213C24.7157 36.4256 24.8012 37.371 25.5996 38.1751C28.4098 41.0088 31.2274 43.8352 34.0865 46.6202C34.6041 47.1245 35.2756 47.5607 35.9568 47.7922C38.0346 48.4963 39.7168 47.7556 41.2208 46.2523C54.9425 32.532 68.6838 18.8312 82.4128 5.11824C82.7082 4.82341 82.9207 4.44818 83.0232 4.3093C86.0947 7.32332 89.0857 10.2618 92.0668 13.1881C93.312 14.4113 94.5573 15.6344 95.8049 16.8576C92.2744 20.376 88.7365 23.9017 85.2035 27.4347C84.9081 27.7295 84.6078 28.0414 84.3954 28.3971C84.0145 29.0355 84.1122 29.7129 84.5956 30.1856C84.703 30.2903 84.8324 30.3878 84.9765 30.4707C85.9238 31.0043 86.627 30.5779 87.2984 29.9029C91.0121 26.1823 94.7404 22.4763 98.454 18.7557C98.9301 18.2781 99.3623 17.7542 99.814 17.2523C99.814 17.2523 100.236 16.7577 99.814 16.2801V16.285Z"
              fill="#0E0E0E"
            />
          </g>
          <defs>
            <clipPath id="clip0_3375_3605">
              <rect
                width="100"
                height="74.359"
                fill="white"
                transform="translate(0 0.320557)"
              />
            </clipPath>
          </defs>
        </svg>
        <div innerHTML={props.dict.successHtml}></div>
        <a
          class="px-2 py-1 border border-brand-base text-brand-base! bg-surface-primary rounded-lg underline-none! decoration-none! hover:(bg-brand-base text-onSurface-invert!) focus:(bg-brand-base text-onSurface-invert! ring-2 ring-brand-base ring-offset-4)"
          href={props.languageCode == "en" ? "/" : `/${props.languageCode}/`}
        >
          {props.dict.backToHome}
        </a>
      </div>
    </Show>
  );
}

function FailedMessage(props: {dict: i18nDict}) {
  return <div>{props.dict.formFailed}</div>;
}
