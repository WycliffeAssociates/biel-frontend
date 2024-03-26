import type {JSX} from "solid-js";

export function WaLogo(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      width="61"
      height="40"
      viewBox="0 0 61 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M26.0219 40H17.1006L34.2255 0H43.1468L26.0219 40ZM60.584 0H51.6626L34.5499 40H43.4712L60.584 0Z"
        fill="#726658"
      />
      <path d="M8.90916 0H0L17.1127 40H26.0219L8.90916 0Z" fill="#B85659" />
      <path
        d="M26.3621 0H17.457L34.5698 40H43.4789L26.3621 0Z"
        fill="#82A93F"
      />
      <path
        d="M43.1307 0H34.2256L51.3383 40H60.2475L43.1307 0Z"
        fill="#FAA83C"
      />
    </svg>
  );
}
