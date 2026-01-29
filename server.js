import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   GEMINI SETUP (CORRECT)
========================= */

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "🐸 CloudFroge healthy" });
});

/* =========================
   CHAT ENDPOINT
========================= */
app.post("/chat", async (req, res) => {
  try {
    const { message, provider } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "❌ Message missing" });
    }

    // Gemini (ACTIVE)
    if (provider === "gemini") {
      const result = await geminiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      });

      const reply =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Gemini returned empty response";

      return res.json({ reply });
    }

    // OpenAI placeholder
    return res.json({
      reply: "🚧 OpenAI coming soon"
    });
  } catch (err) {
    console.error("🔥 Gemini Error:", err.message);

    res.json({
      reply: "🐸 Gemini error. Model invocation failed."
    });
  }
});

/* =========================
   FRONTEND FALLBACK
========================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});