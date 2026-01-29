import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

/* ESM dirname fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Middleware */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* Health check */
app.get("/health", (req, res) => {
  res.json({ status: "CloudFroge is healthy 🐸" });
});

/* Chat API */
app.post("/chat", async (req, res) => {
  const { message, provider } = req.body;

  if (!message) {
    return res.json({ reply: "❌ Message missing" });
  }

  // TEMP response (AI comes next step)
  res.json({
    reply: `🐸 CloudFroge (${provider || "default"}) received: ${message}`
  });
});

/* Serve frontend */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* Start server */
app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});