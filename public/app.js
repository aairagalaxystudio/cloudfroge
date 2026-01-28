async function sendMessage() {
  const input = document.getElementById("message");
  const responseBox = document.getElementById("response");

  if (!input.value) return;

  responseBox.textContent = "🐸 Thinking...";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input.value })
    });

    const data = await res.json();
    responseBox.textContent = data.reply;
  } catch (err) {
    responseBox.textContent = "❌ Error talking to CloudFroge";
  }

  input.value = "";
}