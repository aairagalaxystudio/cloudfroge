const sendBtn = document.getElementById("sendBtn");
const promptInput = document.getElementById("prompt");
const responseBox = document.getElementById("response");
const providerSelect = document.getElementById("provider");

sendBtn.onclick = async () => {
  const message = promptInput.value.trim();
  if (!message) return;

  responseBox.textContent = "Thinking...";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        provider: providerSelect.value
      })
    });

    const data = await res.json();
    responseBox.textContent = data.reply || "No response";
  } catch (err) {
    responseBox.textContent = "Server error";
  }
};