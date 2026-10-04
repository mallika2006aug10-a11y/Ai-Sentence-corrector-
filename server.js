const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// Home
app.get("/", (req, res) => {
    res.send("AI Sentence Corrector Backend is running!");
});


// Health check
app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        message: "Backend is working"
    });
});


// AI Sentence Correction
app.post("/api/check", async (req, res) => {

    const { text } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({
            error: "Text is required"
        });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "OpenRouter API key is not configured."
        });
    }

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "openrouter/free",

                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a grammar correction assistant. Correct grammar, spelling, punctuation, and sentence clarity. Return only the corrected sentence. Do not give explanations, quotes, or markdown."
                        },
                        {
                            role: "user",
                            content: text.trim()
                        }
                    ]

                })
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            console.error("OpenRouter error:", errorText);

            return res.status(502).json({
                error: "AI service request failed."
            });
        }


        const data = await response.json();

        const correctedText =
            data.choices?.[0]?.message?.content?.trim();


        if (!correctedText) {
            return res.status(502).json({
                error: "No correction was returned by the AI."
            });
        }


        res.json({
            text: correctedText
        });


    } catch (error) {

        console.error("Server error:", error);

        res.status(500).json({
            error: "Unable to connect to AI service."
        });
    }

});


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
