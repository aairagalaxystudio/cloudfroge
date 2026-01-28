const provider = document.getElementById("provider").value;

fetch("/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message, provider })
});