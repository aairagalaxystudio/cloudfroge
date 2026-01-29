const form = document.getElementById("chat-form");
const input = document.getElementById("message");
const providerSelect = document.getElementById("provider");
const chatBox = document.getElementById("chat-box");

function addBubble(text, type = "bot") {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.innerText = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  const provider = providerSelect.value;

  // User bubble
  addBubble(message, "user");
  input.value = "";

  // Temporary thinking bubble
  const thinkingBubble = document.createElement("div");
  thinkingBubble.className = "bubble bot";
  thinkingBubble.innerText = "🐸 CloudFroge is thinking...";
  chatBox.appendChild(thinkingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message, provider })
    });

    const data = await res.json();
    thinkingBubble.remove();

    addBubble(data.reply || "🐸 No response", "bot");
  } catch (err) {
    thinkingBubble.remove();
    addBubble("🐸 Network error. Try again.", "bot");
  }
});