async function sendMessage() {
  const message = document.getElementById("message").value;
  const responseBox = document.getElementById("response");

  responseBox.textContent = "Thinking... 🐸";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  responseBox.textContent = data.reply;
}

function scrollToChat() {
  document.getElementById("chat").scrollIntoView({ behavior: "smooth" });
}