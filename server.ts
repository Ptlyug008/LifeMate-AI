import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Middleware
app.use(express.json({ limit: "10mb" }));

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Finance Backend running smoothly." });
});

// 2. Chat with AI Financial Assistant
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const systemInstruction = `You are "Iris", a premium, empathetic, and highly organized AI Daily Life Assistant. 
Your goal is to help users manage their daily lives beautifully—balancing productivity, travel planning, local culinary exploration, household finances, and personal well-being.
Keep your answers highly practical, structured, and stunningly clear. Use clean bullet points and short paragraphs. Avoid technical jargon or excessive wordiness.
Whether the user asks to plan an elegant day in Kyoto, structure a weekend workout habit, design a packing list for the Amalfi coast, or organize their monthly utility bills, provide advice that is thoughtful, warm, and highly actionable.`;

    const chatHistory = (history || []).map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Start Chat
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: chatHistory,
    });

    const response = await chat.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in AI Chat:", error);
    res.status(500).json({ error: error?.message || "Something went wrong in AI chat." });
  }
});

// 3. Analyze Spending and Budgets
app.post("/api/ai/analyze-spending", async (req, res) => {
  try {
    const { transactions, budgets, goals } = req.body;

    const analysisPrompt = `Analyze the following personal finance dataset and provide:
1. Spending Habits Breakdown: Highlight where most of the money is going and if it aligns with standard healthy distributions (e.g., the 50/30/20 rule).
2. Smart Budgeting Suggestions: Offer recommended limits for their highest categories.
3. Unusual or Unnecessary Spending Detection: Identify potential areas of overspending or subscription waste.
4. Month-Ahead Expense Predictions: Give a statistical estimation of what they might spend next month based on current habits.
5. Personalized Savings Tips & Financial Health Insights: Advice on reaching their goals.

DATASET:
- Transactions: ${JSON.stringify(transactions || [])}
- Budgets: ${JSON.stringify(budgets || [])}
- Goals: ${JSON.stringify(goals || [])}

Response format MUST be a valid JSON object matching the following structure:
{
  "summary": "High-level summary of financial status",
  "habits": ["Insight about spending habits 1", "Insight about spending habits 2"],
  "budgetTips": ["Tip on budget 1", "Tip on budget 2"],
  "unnecessarySpending": ["Overspending alert 1", "Unnecessary subscription / expense identified"],
  "predictions": "Description of predictions for next month",
  "savingTips": ["Tip 1 to save more", "Tip 2 to save more"],
  "estimatedHealthScore": 85 // Number between 0 and 100 representing financial safety
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: analysisPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["summary", "habits", "budgetTips", "unnecessarySpending", "predictions", "savingTips", "estimatedHealthScore"],
          properties: {
            summary: { type: Type.STRING },
            habits: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            budgetTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            unnecessarySpending: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            predictions: { type: Type.STRING },
            savingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedHealthScore: { type: Type.INTEGER }
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error analyzing spending:", error);
    res.status(500).json({ error: error?.message || "Failed to analyze spending." });
  }
});

// 4. Parse Voice Expense Input
app.post("/api/ai/parse-voice", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text transcript is required." });
      return;
    }

    const voicePrompt = `You are a helper voice-expense parser for a finance application.
Your task is to take the transcribed voice string from the user and parse it into structured transaction data.
User Voice Command: "${text}"

CATEGORIES ALLOWED: "Food", "Shopping", "Travel", "Bills", "Salary", "Entertainment", "Healthcare", "Education", "Investment", "Others".
TYPE ALLOWED: "income" or "expense".

Response format MUST be a valid JSON object matching the following structure:
{
  "amount": 25.50, // Float number representing the transaction amount (default 0 if not found)
  "category": "Food", // One of the allowed categories (default "Others" if not found)
  "type": "expense", // "income" or "expense"
  "description": "Short summary parsed from the text, e.g. 'Sushi lunch with friends'"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: voicePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["amount", "category", "type", "description"],
          properties: {
            amount: { type: Type.NUMBER },
            category: { 
              type: Type.STRING,
              enum: ["Food", "Shopping", "Travel", "Bills", "Salary", "Entertainment", "Healthcare", "Education", "Investment", "Others"]
            },
            type: { 
              type: Type.STRING,
              enum: ["income", "expense"]
            },
            description: { type: Type.STRING }
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error parsing voice input:", error);
    res.status(500).json({ error: error?.message || "Failed to parse voice command." });
  }
});

// 5. OCR Receipt Parsing
app.post("/api/ai/parse-receipt", async (req, res) => {
  try {
    const { image } = req.body; // base64 string
    if (!image) {
      res.status(400).json({ error: "Base64 receipt image is required." });
      return;
    }

    // Prepare image for Gemini
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: image.split(",")[1] || image, // strip base64 prefix if present
      },
    };

    const ocrPrompt = `Analyze this financial receipt or bill image. Parse the total cost, main category, merchant/description, date of purchase, and list of items if clearly visible.

CATEGORIES ALLOWED: "Food", "Shopping", "Travel", "Bills", "Salary", "Entertainment", "Healthcare", "Education", "Investment", "Others".

Response format MUST be a valid JSON object matching the following structure:
{
  "amount": 42.19, // Total cost as a float number
  "category": "Shopping", // One of the allowed categories matching the receipt content
  "description": "Merchant name or main items description, e.g., 'Target store buy'",
  "items": ["Item 1 - $10.00", "Item 2 - $32.19"] // List of items/services on receipt (empty array if not legible)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: ocrPrompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["amount", "category", "description", "items"],
          properties: {
            amount: { type: Type.NUMBER },
            category: { 
              type: Type.STRING,
              enum: ["Food", "Shopping", "Travel", "Bills", "Salary", "Entertainment", "Healthcare", "Education", "Investment", "Others"]
            },
            description: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error parsing receipt image:", error);
    res.status(500).json({ error: error?.message || "Failed to scan receipt image." });
  }
});

// Integrations & Server Start
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
