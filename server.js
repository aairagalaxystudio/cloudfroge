import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ---------- GEMINI SETUP ---------- */
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash"
});

/* ---------- HEALTH CHECK ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "CloudFroge is healthy 🐸" });
});

/* ---------- CHAT ---------- */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "Message missing" });
    }

    const result = await geminiModel.generateContent(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({
      reply: "🐸 Gemini error. API reachable but model failed."
    });
  }
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});