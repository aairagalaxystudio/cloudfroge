import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "CloudFroge is healthy 🐸" });
});

app.post("/chat", (req, res) => {
  const { message } = req.body;
  res.json({ reply: `🐸 CloudFroge received: "${message}"` });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🐸 CloudFroge running on port ${PORT}`);
});