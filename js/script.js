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

// este es el modelo que usa de AI, puedes cambiarlo.
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
  $button.setAttribute("disabled", "");

  const userMessage = {
    role: "user",
    content: messageText,
  };

  messages.push(userMessage);

  const chunks = await engine.chat.completions.create({
    messages,
    stream: true,
  });

  let reply = "";

  const $botMessage = addMessage("", "bot");

  for await (const chunk of chunks) {
    const [choice] = chunk.choices;
    const content = choice?.delta?.content ?? "";
    reply += content;
    $botMessage.textContent = reply;
    console.log(chunk.choices);
  }

  $button.removeAttribute("disabled");
  messages.push({ role: "assistant", content: reply });
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

  return $text;
}
