import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 10000;

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// AI clients
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health
app.get("/health", (req, res) => {
  res.json({ status: "CloudFroge healthy 🐸" });
});

// ==============================
// 🔥 MULTI-AI CHAT ENDPOINT
// ==============================
app.post("/chat", async (req, res) => {
  const { message, provider } = req.body;

  try {
    let reply = "";

    if (provider === "gemini") {
      const model = gemini.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(message);
      reply = result.response.text();
    }

    else if (provider === "openai") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      });
      reply = completion.choices[0].message.content;
    }

    else {
      return res.status(400).json({ error: "Invalid provider" });
    }

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed 🐸" });
  }
});

// Serve UI
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start
app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on ${PORT}`);
});