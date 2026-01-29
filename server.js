// ================================
// CloudFroge Server
// ================================

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ----------------
// App setup
// ----------------
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Needed for ES Modules (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// ----------------
// GEMINI SETUP
// ----------------
let geminiModel = null;

if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  geminiModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
}

// ----------------
// OPENAI SETUP (future)
// ----------------
// import OpenAI from "openai";
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// ----------------
// Health check
// ----------------
app.get("/health", (req, res) => {
  res.json({ status: "🐸 CloudFroge is healthy" });
});

// ----------------
// CHAT API
// ----------------
app.post("/chat", async (req, res) => {
  const { message, provider } = req.body;

  if (!message) {
    return res.json({ reply: "🐸 Message is empty" });
  }

  try {
    // -------- GEMINI --------
    if (provider === "gemini") {
      if (!geminiModel) {
        return res.json({
          reply: "🐸 Gemini not configured. Check API key.",
        });
      }

      const result = await geminiModel.generateContent(message);
      const reply = result.response.text();

      return res.json({ reply });
    }

    // -------- OPENAI (SOON) --------
    if (provider === "openai") {
      return res.json({
        reply: "🐸 OpenAI support coming soon",
      });
    }

    // -------- FALLBACK --------
    return res.json({
      reply: "🐸 Unknown AI provider",
    });

  } catch (err) {
    console.error("Chat error:", err.message);

    return res.json({
      reply: "🐸 Gemini error. Check API key & service enable.",
    });
  }
});

// ----------------
// SPA fallback
// ----------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ----------------
// Start server
// ----------------
app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});