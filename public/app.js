const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const providerSelect = document.getElementById("provider");
const chatBox = document.getElementById("chatBox");

function addBubble(text, type = "bot") {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.innerText = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  const provider = providerSelect.value;

  // User bubble
  addBubble(message, "user");
  input.value = "";

  // Typing bubble
  const typingBubble = document.createElement("div");
  typingBubble.className = "bubble bot typing";
  typingBubble.innerText = "CloudFroge is thinking...";
  chatBox.appendChild(typingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, provider })
    });

    const data = await res.json();

    typingBubble.remove();

    // Gemini reply bubble
    addBubble(data.reply || "⚠️ No reply from AI", "bot");

  } catch (err) {
    typingBubble.remove();
    addBubble("❌ Server error. Check backend.", "bot");
  }
}