import "./style.css";
import { test } from "shared";
import { setupCounter } from "$/counter.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  ${test}
`;

const counterDiv: HTMLButtonElement =
  document.querySelector<HTMLButtonElement>("#counter")!;
setupCounter(counterDiv);
