import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { GoogleGenerativeAI } from "@google/generative-ai";
// import OpenAI from "openai"; // keep commented if OpenAI not active

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

/* ---------- PATH SETUP (ES MODULE SAFE) ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ---------- GEMINI SETUP ---------- */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

/* ---------- OPENAI SETUP (OPTIONAL / FUTURE) ---------- */
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

/* ---------- HEALTH CHECK ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "🐸 CloudFroge is healthy" });
});

/* ---------- CHAT API ---------- */
app.post("/chat", async (req, res) => {
  try {
    const { message, provider } = req.body;

    if (!message) {
      return res.json({ reply: "⚠️ Message is empty" });
    }

    /* ---------- GEMINI ---------- */
    if (provider === "gemini") {
      try {
        const result = await geminiModel.generateContent(message);
        const reply = result.response.text();
        return res.json({ reply });
      } catch (err) {
        console.error("Gemini error:", err);
        return res.json({
          reply: "🐸 Gemini error. Check API key & service enable."
        });
      }
    }

    /* ---------- OPENAI (SOON) ---------- */
    if (provider === "openai") {
      return res.json({
        reply: "🤖 OpenAI coming soon"
      });

      // REAL VERSION (when ready)
      /*
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      });

      return res.json({
        reply: completion.choices[0].message.content
      });
      */
    }

    return res.json({ reply: "⚠️ Invalid provider" });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "❌ Server error" });
  }
});

/* ---------- SERVE FRONTEND ---------- */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});