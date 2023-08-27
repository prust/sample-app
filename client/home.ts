import { assert, renderHeader } from "./utils.js";

renderHeader();

let div = document.querySelector(".dynamic");
assert(div);
div.innerHTML = "This is dynamic content";
