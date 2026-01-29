import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ---------- RATE LIMIT ---------- */
app.use("/chat", rateLimit({
  windowMs: 60 * 1000,
  max: 20
}));

/* ---------- OPENAI ---------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ---------- MEMORY (IN-MEMORY MVP) ---------- */
const memory = new Map();

/* ---------- HEALTH ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok 🐸" });
});

/* ---------- CHAT (STREAMING) ---------- */
app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    if (!message) return res.status(400).end();

    const history = memory.get(sessionId) || [];
    history.push({ role: "user", content: message });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: history,
      stream: true
    });

    let fullReply = "";

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) {
        fullReply += token;
        res.write(`data: ${token}\n\n`);
      }
    }

    history.push({ role: "assistant", content: fullReply });
    memory.set(sessionId, history.slice(-10)); // keep last 10

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (err) {
    console.error(err);
    res.write(`data: ❌ OpenAI API error.\n\n`);
    res.end();
  }
});

app.listen(PORT, () =>
  console.log(`🐸 CloudFrog running on ${PORT}`)
);