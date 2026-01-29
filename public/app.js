async function sendMessage() {
  const input = document.getElementById("prompt");
  const provider = document.getElementById("provider").value;
  const output = document.getElementById("response");

  output.textContent = "⏳ Thinking...";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: input.value,
      provider
    })
  });

  const data = await res.json();
  output.textContent = data.reply;
}