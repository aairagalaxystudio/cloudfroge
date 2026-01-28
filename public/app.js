async function sendMessage() {
  const message = document.getElementById("message").value;
  const provider = document.getElementById("provider").value;
  const output = document.getElementById("output");

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, provider })
  });

  const data = await res.json();

  output.innerText = data.reply; // ✅ NOT undefined now
}