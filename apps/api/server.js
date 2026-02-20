const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.post("/chat", async (req, res) => {
  try {
    const { message, model } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message (string) is required" });
    }

    const ollamaModel = (model && typeof model === "string") ? model : "llama3.1:8b";

    // Call Ollama local API
    const ollamaRes = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: message,
        stream: false
      })
    });

    if (!ollamaRes.ok) {
      const txt = await ollamaRes.text();
      return res.status(502).json({ error: "Ollama call failed", details: txt });
    }

    const data = await ollamaRes.json();

    return res.json({
      reply: data.response ?? "",
      model: ollamaModel
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
});

