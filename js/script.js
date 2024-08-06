import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

const $ = (el) => document.querySelector(el);

const $form = $("form");
const $input = $("input");
const $template = $("#message-template");
const $messages = $("ul");
const $container = $("main");
const $button = $("button");
const $info = $("small");

let messages = [];

const SELECTED_MODEL = "gemma-2b-it-q4f32_1-MLC";

const engine = await CreateMLCEngine(SELECTED_MODEL, {
  initProgressCallback: (info) => {
    console.log("initProgressCalback", info);
    $info.textContent = `${info.text}`;
    if (info.progress === 1) {
      $button.removeAttribute("disabled");
    }
  },
});

$form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const messageText = $input.value.trim();

  if (messageText !== "") {
    // añadimos el mensaje en el DOM
    $input.value = "";
  }
  addMessage(messageText, "user");
  $button.setAttribute("disabled", true);

  const reply = await engine.chat.completions.create({
    messages: [...messages, { role: "user", content: messageText }],
  });

  console.log(reply);
});

function addMessage(text, sender) {
  // clonar el template
  const clonedTemplate = $template.content.cloneNode(true);
  const $newMessage = clonedTemplate.querySelector(".message");

  const $who = $newMessage.querySelector("span");
  const $text = $newMessage.querySelector("p");

  $text.textContent = text;
  $who.textContent = sender === "bot" ? "GPT" : "Tú";
  $newMessage.classList.add(sender);

  $messages.appendChild($newMessage);
  $container.scrollTop = $container.scrollHeight;
}
