const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

const USER_KEY = "demo-user-key"; // replace later

send.onclick = () => {
  const msg = input.value.trim();
  if (!msg) return;

  addBubble(msg, "user");
  input.value = "";

  const bubble = addBubble("", "bot");
  bubble.innerHTML = "▍";

  const evt = new EventSource(
    `/api/stream?message=${encodeURIComponent(msg)}`,
    {
      headers: {
        Authorization: `Bearer ${USER_KEY}`
      }
    }
  );

  evt.onmessage = e => {
    bubble.innerHTML =
      bubble.innerHTML.replace("▍", "") + e.data + "▍";
  };

  evt.addEventListener("done", () => {
    bubble.innerHTML = bubble.innerHTML.replace("▍", "");
    evt.close();
  });
};

function addBubble(text, type) {
  const div = document.createElement("div");
  div.className = "bubble " + type;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}