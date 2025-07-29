import express from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const generateRoute = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, 
  baseURL: "https://openrouter.ai/api/v1",
});

function extractCodeBlock(content: string) {
  const match = content.match(/```(?:html)?\s*([\s\S]*?)```/i);
  return match ? match[1].trim() : content;
}

generateRoute.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt format" });
    }





    const completion = await openai.chat.completions.create({
      model: "qwen/qwen3-coder:free", // or any other model from OpenRouter
      messages: [
        {
          role: "system",
          content:
            "You are an expert frontend developer. When given a prompt, return HTML, CSS and JS code inside one string. No explanation, just valid code.",
        },{
          role: "user",
          content: prompt,

        },
      
      ],
      temperature: 0.7,
    });
    const rawCode = completion.choices[0].message?.content || "";
    const cleanCode = extractCodeBlock(rawCode);
    res.json({ code: cleanCode });


  } catch (err) {
    console.error("Error generating code:", err);
    return res.status(500).json({ error: "Failed to generate code" });
  }
});

export { generateRoute };
