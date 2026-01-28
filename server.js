app.post("/chat", async (req, res) => {
  const { message, provider } = req.body;

  let reply = "";

  if (provider === "gemini") {
    reply = `🐸 Gemini says: ${message}`;
  } 
  else if (provider === "openai") {
    reply = `🤖 OpenAI says: ${message}`;
  } 
  else {
    reply = "Unknown provider";
  }

  res.json({ reply }); // ✅ MUST be reply
});