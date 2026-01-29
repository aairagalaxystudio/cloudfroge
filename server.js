import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
// import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================= OPENAI ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ================= GEMINI (READY) ================= */
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/* ================= CHAT API ================= */
app.post("/chat", async (req, res) => {
  const { message, provider } = req.body;

  try {
    if (provider === "openai") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      });

      return res.json({
        reply: completion.choices[0].message.content
      });
    }

    if (provider === "gemini") {
      return res.json({
        reply: "🧪 Gemini is ready but currently disabled."
      });
    }

    res.status(400).json({ reply: "Invalid provider" });
  } catch (err) {
    res.status(500).json({
      reply: "❌ AI error",
      error: err.message
    });
  }
});

/* ================= FALLBACK ================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});