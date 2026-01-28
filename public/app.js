async function send() {
  const messageInput = document.getElementById("message");
  const providerSelect = document.getElementById("provider");
  const resultDiv = document.getElementById("result");

  const message = messageInput.value.trim();
  const provider = providerSelect.value;

  if (!message) {
    resultDiv.innerText = "❗ Please type a message";
    return;
  }

  resultDiv.innerText = "⏳ Thinking...";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        provider
      })
    });

    const data = await response.json();
    resultDiv.innerText = data.reply;
  } catch (err) {
    resultDiv.innerText = "❌ Error connecting to server";
  }

  messageInput.value = "";
}