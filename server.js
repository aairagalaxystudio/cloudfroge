import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =======================
// GEMINI SETUP (STABLE)
// =======================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// =======================
// HEALTH
// =======================
app.get("/health", (req, res) => {
  res.json({ status: "ok 🐸" });
});

// =======================
// CHAT
// =======================
app.post("/chat", async (req, res) => {
  try {
    const { message, provider } = req.body;

    if (!message) {
      return res.json({ reply: "❌ Empty message" });
    }

    if (provider === "gemini") {
      // ✅ THIS is the correct call
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      return res.json({ reply: text });
    }

    return res.json({ reply: "🚧 OpenAI coming soon" });
  } catch (err) {
    console.error("Gemini crash:", err);
    res.json({
      reply: "🐸 Gemini error. Model invocation failed."
    });
  }
});

// =======================
// FRONTEND FALLBACK
// =======================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =======================
app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on ${PORT}`);
});