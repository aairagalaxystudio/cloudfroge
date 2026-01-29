const sendBtn = document.getElementById("sendBtn");
const promptInput = document.getElementById("prompt");
const responseBox = document.getElementById("response");
const providerSelect = document.getElementById("provider");

sendBtn.onclick = async () => {
  const message = promptInput.value.trim();
  if (!message) return;

  responseBox.textContent = "";
  sendBtn.disabled = true;

  try {
    const res = await fetch("/chat", {
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
      responseBox.textContent += decoder.decode(value);
    }

  } catch (err) {
    responseBox.textContent = "❌ Streaming error";
  }

  sendBtn.disabled = false;
};