import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* ------------------ CONFIG ------------------ */
const RATE_LIMIT = 30; // requests per minute
const MEMORY_LIMIT = 10;

/* In-memory stores (swap to Redis later) */
const rateStore = {};
const memoryStore = {};

/* ------------------ HELPERS ------------------ */
function checkRateLimit(key) {
  const now = Date.now();
  rateStore[key] = rateStore[key] || [];
  rateStore[key] = rateStore[key].filter(t => now - t < 60000);
  if (rateStore[key].length >= RATE_LIMIT) return false;
  rateStore[key].push(now);
  return true;
}

/* ------------------ STREAM CHAT ------------------ */
app.get("/api/stream", async (req, res) => {
  const userKey = req.headers.authorization?.replace("Bearer ", "");
  const prompt = req.query.message;

  if (!userKey) return res.status(401).end();
  if (!checkRateLimit(userKey)) return res.status(429).end();

  memoryStore[userKey] = memoryStore[userKey] || [];
  memoryStore[userKey].push({ role: "user", content: prompt });
  memoryStore[userKey] = memoryStore[userKey].slice(-MEMORY_LIMIT);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();

  const openaiRes = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: memoryStore[userKey]
      })
    }
  );

  let assistantText = "";

  openaiRes.body.on("data", chunk => {
    const lines = chunk.toString().split("\n");
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      if (line.includes("[DONE]")) {
        memoryStore[userKey].push({
          role: "assistant",
          content: assistantText
        });
        res.write("event: done\ndata: end\n\n");
        res.end();
        return;
      }

      try {
        const json = JSON.parse(line.replace("data: ", ""));
        const token = json.choices[0].delta?.content;
        if (token) {
          assistantText += token;
          res.write(`data: ${token}\n\n`);
        }
      } catch {}
    }
  });
});

/* ------------------ HEALTH ------------------ */
app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 3000, () =>
  console.log("🐸 CloudFrog streaming server live")
);