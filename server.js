import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(express.static("public"));

/* ---------- OPENAI SETUP ---------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ---------- HEALTH CHECK ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok", provider: "openai" });
});

/* ---------- CHAT ENDPOINT ---------- */
app.post("/chat", async (req, res) => {
  const { message, provider } = req.body;

  // Gemini temporarily disabled
  if (provider === "gemini") {
    return res.json({
      reply: "🐸 Gemini coming soon. Using OpenAI for now."
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are CloudFroge, a friendly AI assistant." },
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "🐸 OpenAI error. Check API key or quota."
    });
  }
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});