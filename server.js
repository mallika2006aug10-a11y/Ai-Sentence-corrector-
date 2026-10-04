const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Sentence Corrector Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Backend is working"
  });
});

app.post("/api/check", (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      error: "Text is required"
    });
  }

  res.json({
    text: text.trim()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
