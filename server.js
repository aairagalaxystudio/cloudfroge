app.post("/chat", async (req, res) => {
  const { message, provider } = req.body;

  if (provider === "gemini") {
    // Gemini SDK
  }

  if (provider === "openai") {
    // OpenAI SDK
  }

  res.json({ reply });
});