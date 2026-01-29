const sendBtn = document.getElementById("sendBtn");
const promptInput = document.getElementById("prompt");
const chatBox = document.getElementById("response");
const providerSelect = document.getElementById("provider");

function addBubble(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
  return bubble;
}

sendBtn.onclick = async () => {
  const message = promptInput.value.trim();
  if (!message) return;

  addBubble(message, "user");
  promptInput.value = "";

  const aiBubble = addBubble("", "ai");
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "▍";
  aiBubble.appendChild(cursor);

  sendBtn.disabled = true;

  const res = await fetch("/chat-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      provider: providerSelect.value
    })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    cursor.before(decoder.decode(value));
  }

  cursor.remove();
  sendBtn.disabled = false;
};