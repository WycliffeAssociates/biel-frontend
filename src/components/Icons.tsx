import type {JSX} from "solid-js/jsx-runtime";

export function SelectIndicator(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 12 12"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3.076 4.617A1 1 0 0 1 4 4h4a1 1 0 0 1 .707 1.707l-2 2a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1-.217-1.09"
      ></path>
    </svg>
  );
}

export function ChevronDown(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 12 12"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2.22 4.47a.75.75 0 0 1 1.06 0L6 7.19l2.72-2.72a.75.75 0 0 1 1.06 1.06L6.53 8.78a.75.75 0 0 1-1.06 0L2.22 5.53a.75.75 0 0 1 0-1.06"
      ></path>
    </svg>
  );
}

export function Download(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7z"></path>
    </svg>
  );
}

export function CloseCircle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41z"
      ></path>
    </svg>
  );
}

export function ArrowRight(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
      ></path>
    </svg>
  );
}

export function ArrowLeft(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      style="transform: rotate(180deg)"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
      ></path>
    </svg>
  );
}

export function XCircleFill(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
      ></path>
    </svg>
  );
}

export function CheckCircle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"
      ></path>
    </svg>
  );
}

export function OpenInNew(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413T19 21zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4z"
      ></path>
    </svg>
  );
}

export function Cogs(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M15.9 18.45c1.35 0 2.45-1.1 2.45-2.45s-1.1-2.45-2.45-2.45c-1.36 0-2.45 1.1-2.45 2.45s1.09 2.45 2.45 2.45m5.2-1.77l1.48 1.16c.13.11.17.29.08.45l-1.4 2.42a.35.35 0 0 1-.43.15l-1.74-.7c-.36.28-.76.51-1.18.69l-.27 1.85c-.02.17-.17.3-.34.3h-2.8c-.18 0-.32-.13-.35-.3l-.26-1.85c-.43-.18-.82-.41-1.18-.69l-1.75.7c-.15.06-.34 0-.42-.15l-1.4-2.42a.351.351 0 0 1 .08-.45l1.48-1.16l-.05-.68l.05-.69l-1.48-1.15a.353.353 0 0 1-.08-.45l1.4-2.42c.08-.16.27-.22.42-.16l1.75.71c.36-.28.75-.52 1.18-.69l.26-1.86c.03-.16.17-.29.35-.29h2.8c.17 0 .32.13.34.29l.27 1.86c.42.17.82.41 1.18.69l1.74-.71c.17-.06.34 0 .43.16l1.4 2.42c.09.15.05.34-.08.45l-1.48 1.15l.05.69zM6.69 8.07c.87 0 1.57-.7 1.57-1.57c0-.87-.7-1.58-1.57-1.58A1.58 1.58 0 0 0 5.11 6.5c0 .87.71 1.57 1.58 1.57m3.34-1.13l.97.74c.07.07.09.19.03.29l-.9 1.56c-.05.1-.17.14-.27.1l-1.12-.45l-.74.44l-.19 1.19c-.02.11-.11.19-.22.19h-1.8c-.12 0-.21-.08-.23-.19L5.4 9.62l-.76-.44l-1.14.45c-.09.04-.2 0-.26-.1l-.9-1.56c-.06-.1-.03-.22.05-.29l.95-.74l-.03-.44l.03-.44l-.95-.74a.229.229 0 0 1-.05-.29l.9-1.56c.06-.1.17-.14.26-.1l1.13.45l.77-.44l.16-1.19c.02-.11.11-.19.23-.19h1.8c.11 0 .2.08.22.19L8 3.38l.74.44l1.12-.45c.1-.04.22 0 .27.1l.9 1.56c.06.1.04.22-.03.29l-.97.74l.03.44z"
      ></path>
    </svg>
  );
}

export function SkipPrevious(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M5.5 18V6h2v12zm13 0l-9-6l9-6z"></path>
    </svg>
  );
}

export function SkipNext(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M16.5 18V6h2v12zm-11 0V6l9 6z"></path>
    </svg>
  );
}

export function PlayArrow(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M8 19V5l11 7z"></path>
    </svg>
  );
}

export function MangifyingGlass(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.5014 14.0014H14.7114L14.4314 13.7314C15.0564 13.0054 15.5131 12.1502 15.769 11.2271C16.0248 10.3039 16.0735 9.33559 15.9114 8.39144C15.4414 5.61144 13.1214 3.39144 10.3214 3.05144C9.33706 2.92691 8.33723 3.02921 7.39846 3.35053C6.4597 3.67185 5.60688 4.20366 4.90527 4.90527C4.20366 5.60688 3.67185 6.4597 3.35053 7.39846C3.02921 8.33723 2.92691 9.33706 3.05144 10.3214C3.39144 13.1214 5.61144 15.4414 8.39144 15.9114C9.33559 16.0735 10.3039 16.0248 11.2271 15.769C12.1502 15.5131 13.0054 15.0564 13.7314 14.4314L14.0014 14.7114V15.5014L18.2514 19.7514C18.6614 20.1614 19.3314 20.1614 19.7414 19.7514C20.1514 19.3414 20.1514 18.6714 19.7414 18.2614L15.5014 14.0014ZM9.50144 14.0014C7.01144 14.0014 5.00144 11.9914 5.00144 9.50144C5.00144 7.01144 7.01144 5.00144 9.50144 5.00144C11.9914 5.00144 14.0014 7.01144 14.0014 9.50144C14.0014 11.9914 11.9914 14.0014 9.50144 14.0014Z"
        fill="#66768B"
      />
    </svg>
  );
}
