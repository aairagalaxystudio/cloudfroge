const form = document.getElementById("chat-form");
const input = document.getElementById("prompt");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  // User bubble
  addMessage(message, "user");
  input.value = "";

  // Typing placeholder
  const typingBubble = addMessage("Typing...", "bot");

  try {
    // 🔒 FORCE OPENAI (temporary)
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "openai",
        message
      })
    });

    const data = await response.json();

    typingBubble.remove();

    if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage("⚠️ No response from AI.", "bot");
    }
  } catch (err) {
    typingBubble.remove();
    addMessage("❌ Server error. Check backend logs.", "bot");
  }
});

function addMessage(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.innerText = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
  return bubble;
}