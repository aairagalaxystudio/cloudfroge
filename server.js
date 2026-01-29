import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ===========================
   STREAMING CHAT ENDPOINT
=========================== */
app.post("/chat", async (req, res) => {
  const { message, provider } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    if (provider === "gemini") {
      await geminiStream(message, res);
    } else {
      await openaiStream(message, res);
    }
  } catch (err) {
    res.write(`data: ERROR: ${err.message}\n\n`);
  } finally {
    res.end();
  }
});

/* ===========================
   GEMINI STREAM
=========================== */
async function geminiStream(prompt, res) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  for await (const chunk of response.body) {
    const text = chunk.toString();
    res.write(`data: ${text}\n\n`);
  }
}

/* ===========================
   OPENAI STREAM
=========================== */
async function openaiStream(prompt, res) {
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        stream: true,
        messages: [{ role: "user", content: prompt }]
      })
    }
  );

  for await (const chunk of response.body) {
    const text = chunk.toString();
    res.write(`data: ${text}\n\n`);
  }
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("🐸 CloudFroge streaming server running");
});