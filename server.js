import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 10000;

// ESM fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// AI clients
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Health
app.get("/health", (_, res) => {
  res.json({ status: "CloudFroge healthy 🐸" });
});

// 🔥 STREAMING ENDPOINT
app.post("/chat-stream", async (req, res) => {
  const { message, provider } = req.body;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    if (provider === "gemini") {
      // Gemini (best-practice streaming)
      const model = gemini.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(message);
      const text = result.response.text();

      for (const word of text.split(" ")) {
        res.write(word + " ");
        await new Promise(r => setTimeout(r, 50));
      }
      return res.end();
    }

    if (provider === "openai") {
      // TRUE streaming
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        stream: true
      });

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content;
        if (token) res.write(token);
      }
      return res.end();
    }

    res.write("❌ Invalid provider");
    res.end();

  } catch (err) {
    console.error(err);
    res.write("❌ Streaming error");
    res.end();
  }
});

// Serve frontend
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});