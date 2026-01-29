const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const chat = document.getElementById("chat");
const providerSelect = document.getElementById("provider");

sendBtn.onclick = async () => {
  const message = input.value.trim();
  if (!message) return;

  addBubble(message, "user");
  input.value = "";

  const bubble = addBubble("", "bot");
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  bubble.appendChild(cursor);

  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      provider: providerSelect.value
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    bubble.textContent += decoder.decode(value);
    bubble.appendChild(cursor);
  }

  cursor.remove();
};

function addBubble(text, type) {
  const div = document.createElement("div");
  div.className = `bubble ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}