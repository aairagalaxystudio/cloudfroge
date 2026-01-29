import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// ESM dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "CloudFroge is healthy 🐸" });
});

// 🔥 STREAMING CHAT ENDPOINT
app.post("/chat", async (req, res) => {
  const { message, provider } = req.body;

  // Streaming headers
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  if (!message) {
    res.write("❌ Message missing");
    return res.end();
  }

  // Demo streaming text (replace with Gemini/OpenAI later)
  const reply = `🐸 CloudFroge (${provider}) says: Streaming is live. You asked: "${message}". This text is streamed word by word.`;

  const words = reply.split(" ");

  for (const word of words) {
    res.write(word + " ");
    await new Promise(r => setTimeout(r, 120)); // typing speed
  }

  res.end();
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});