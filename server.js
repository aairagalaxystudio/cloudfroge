import express from "express";

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("🐸 CloudFroge is alive and coding!");
});

// Chat endpoint
app.post("/chat", (req, res) => {
  const { message } = req.body;

  let reply = "🐸 CloudFroge here! Ask me coding questions.";

  if (message?.startsWith("/code")) {
    reply = "👨‍💻 Tell me language + task (example: /code python api)";
  } else if (message?.startsWith("/debug")) {
    reply = "🐞 Paste your error and code, I’ll help you debug.";
  } else if (message?.startsWith("/build")) {
    reply = "🏗️ What do you want to build? (web/app/api)";
  }

  res.json({ reply });
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CloudFroge running on port ${PORT}`);
});p
