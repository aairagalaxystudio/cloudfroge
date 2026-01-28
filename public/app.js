async function send() {
  const msg = document.getElementById("msg").value;
  const replyBox = document.getElementById("reply");

  replyBox.textContent = "🐸 Thinking...";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();
  replyBox.textContent = data.reply;
}