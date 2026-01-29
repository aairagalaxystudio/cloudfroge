// public/app.js

const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const providerSelect = document.getElementById("provider");

// Add message bubble
function addMessage(text, type = "bot") {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  // User bubble
  addMessage(message, "user");
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: providerSelect.value, // currently OpenAI
        message,
      }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    addMessage(data.reply || "⚠️ Empty response", "bot");

  } catch (err) {
    console.error(err);
    addMessage("❌ Server error. Check backend logs.", "bot");
  }
});