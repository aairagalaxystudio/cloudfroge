const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

const sessionId = crypto.randomUUID();

function bubble(text, cls) {
  const div = document.createElement("div");
  div.className = `bubble ${cls}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

send.onclick = async () => {
  if (!input.value.trim()) return;

  bubble(input.value, "user");
  const bot = bubble("▍", "bot");

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: input.value,
      sessionId
    })
  });

  input.value = "";

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let text = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    if (chunk.includes("[DONE]")) break;

    text += chunk.replace(/^data:\s*/gm, "");
    bot.textContent = text + "▍";
  }

  bot.textContent = text;
};