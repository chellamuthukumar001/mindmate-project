import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images

const upload = multer({ storage: multer.memoryStorage() });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const genAI = (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_key_here') ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// In-memory storage
let moodHistory = [
    { date: '2024-02-01', value: 4, note: 'Had a great day!' },
    { date: '2024-02-02', value: 3, note: 'A bit tired.' },
];
let journals = [];

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mock AI Response Generator (Fallback)
const getMockResponse = (message) => {
    const responses = [
        "I hear you. Maintaining mental balance is a journey, and I'm here to support you.",
        "That sounds important. Can you tell me more about how that made you feel?",
        "Take a deep breath. You're doing the best you can.",
        "It's okay to feel this way. I'm listening.",
        "Have you tried taking a moment to practice mindfulness today?",
        "I'm running in offline mode right now, but I'm still here for you!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
};

app.post("/chat", async (req, res) => {
    try {
        const { messages } = req.body;
        const userMessage = messages[messages.length - 1].content;
        const systemMessage = {
            role: "system",
            content: "You are MindMate, a compassionate, empathetic, and calming AI mental health assistant. Keep your responses concise, supportive, and warm."
        };

        // 1. Try OpenRouter (if key exists)
        if (OPENROUTER_API_KEY) {
            try {
                const response = await fetch(OPENROUTER_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "MindMate"
                    },
                    body: JSON.stringify({
                        model: "google/gemini-2.0-flash-001", // Premium fast model via OpenRouter
                        messages: [systemMessage, ...messages],
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    return res.json({ reply: data.choices[0].message.content.trim() });
                }
            } catch (err) {
                console.error("OpenRouter Error:", err.message);
            }
        }

        // 2. Fallback to Groq
        if (GROQ_API_KEY) {
            try {
                const response = await fetch(GROQ_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${GROQ_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [systemMessage, ...messages],
                        temperature: 0.7,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    return res.json({ reply: data.choices[0].message.content.trim() });
                }
            } catch (err) {
                console.error("Groq Error:", err.message);
            }
        }

        // 3. Final Mock Fallback
        res.json({
            reply: getMockResponse(userMessage),
            isMock: true
        });

    } catch (err) {
        console.error("❌ Overall Chat Error:", err.message);
        res.json({ reply: "I'm having trouble connecting to my brain, but I'm still listening. (Offline Mode)" });
    }
});

// Mood & Journal Endpoints
app.get("/api/moods", (req, res) => res.json(moodHistory));
app.post("/api/moods", (req, res) => {
    const { value, note } = req.body;
    const newEntry = { date: new Date().toISOString().split('T')[0], value, note };
    moodHistory.push(newEntry);
    res.json(newEntry);
});

app.get("/api/journals", (req, res) => res.json(journals));
app.post("/api/journals", (req, res) => {
    const { title, content } = req.body;
    const newEntry = { id: Date.now(), title, content, date: new Date() };
    journals.push(newEntry);
    res.json(newEntry);
});

// Symptom Checker Endpoint
app.post("/symptoms", async (req, res) => {
    const { symptoms } = req.body;
    if (!symptoms || symptoms.trim().length < 3) {
        return res.status(400).json({ error: 'Please provide a valid symptom description.' });
    }

    const systemPrompt = `You are a medically-informed AI symptom analysis assistant. 
Your role is to analyze patient-reported symptoms and provide structured medical guidance.

IMPORTANT RULES:
- Always respond with a valid JSON object (no markdown code blocks, no extra text).
- Never diagnose — provide possible conditions and refer to appropriate help.
- Always recommend professional consultation.
- Err on the side of caution for urgency.

Urgency levels:
- "emergency": life-threatening, call 112 immediately
- "urgent": needs same-day medical attention
- "moderate": see a doctor within 1-3 days
- "low": self-care or routine appointment

Respond ONLY with this JSON structure:
{
  "summary": "One friendly sentence summarizing findings",
  "urgency": "emergency" | "urgent" | "moderate" | "low",
  "urgency_score": <number 1-10>,
  "department": "Department name",
  "specialist": "Type of doctor",
  "possible_conditions": ["Condition 1", "Condition 2", "Condition 3"],
  "treatment": ["Step 1", "Step 2", "Step 3", "When to seek immediate care"]
}`;

    // 1. Try OpenRouter (if key exists)
    if (OPENROUTER_API_KEY) {
        try {
            const response = await fetch(OPENROUTER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "MindMate"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-001",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Patient symptoms: ${symptoms.trim()}` },
                    ],
                    temperature: 0.3,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const rawContent = data.choices[0].message.content.trim();
                const jsonStr = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
                const parsed = JSON.parse(jsonStr);
                return res.json({
                    summary: parsed.summary || '',
                    result: parsed
                });
            }
        } catch (err) {
            console.error("OpenRouter Symptoms Error:", err.message);
        }
    }

    // 2. Fallback to Groq
    if (GROQ_API_KEY) {
        try {
            const response = await fetch(GROQ_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Patient symptoms: ${symptoms.trim()}` },
                    ],
                    temperature: 0.3,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const rawContent = data.choices[0].message.content.trim();
                const jsonStr = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
                const parsed = JSON.parse(jsonStr);
                return res.json({
                    summary: parsed.summary || '',
                    result: parsed
                });
            }
        } catch (err) {
            console.error("Groq Symptoms Error:", err.message);
        }
    }

    // 3. Final Mock Fallback
    return res.json({
        summary: "Offline mode — showing general guidance.",
        result: {
            urgency: 'moderate', urgency_score: 5,
            department: 'General Medicine', specialist: 'General Physician',
            possible_conditions: ['Common Cold', 'Viral Infection'],
            treatment: ['Rest and hydrate', 'Monitor symptoms', 'See a doctor if symptoms worsen'],
        },
    });
});

// Study Assistant Endpoint
app.post("/api/study", async (req, res) => {
    const { action, content, level = "beginner" } = req.body;

    const prompts = {
        explain: `Explain the following concept clearly for a ${level} level student: ${content}. Use examples and keep it engaging.`,
        quiz: `Generate 5 multiple-choice questions on the topic: ${content}. Provide the correct answers at the end as JSON. Format: { "questions": [{ "question": "", "options": ["", "", "", ""], "answer": index }] }`,
        summarize: `Summarize the following notes concisely but cover all key points: ${content}`,
        prep: `Create an exam preparation guide for the topic: ${content}. Include key terms, potential questions, and study tips.`,
        flashcards: `Create 10 flashcards (Front and Back) for: ${content}. Format: { "flashcards": [{ "front": "", "back": "" }] }`,
        plan: `Create a structured study plan for the topic: ${content}. Break it down into logical steps or days. Format as JSON: { "plan": [{ "day": "Phase/Day Title", "topic": "Main Topic", "tasks": ["Task 1", "Task 2"] }] }`
    };

    const prompt = prompts[action] || prompts.explain;
    const isJsonResponse = action === "quiz" || action === "flashcards" || action === "plan";

    // 1. Try Gemini Native (if configured)
    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            if (isJsonResponse) {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try { return res.json(JSON.parse(jsonMatch[0])); } catch (e) { }
                }
            }
            return res.json({ result: text });
        } catch (err) {
            console.error("Native Gemini Study Error:", err);
        }
    }

    // 2. Try OpenRouter (if configured)
    if (OPENROUTER_API_KEY) {
        try {
            const response = await fetch(OPENROUTER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "MindMate"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-001",
                    messages: [{ role: "user", content: prompt }],
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.choices[0].message.content.trim();

                if (isJsonResponse) {
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        try { return res.json(JSON.parse(jsonMatch[0])); } catch (e) { }
                    }
                }
                return res.json({ result: text });
            }
        } catch (err) {
            console.error("OpenRouter Study Error:", err.message);
        }
    }

    return res.status(500).json({ error: "No AI service available for study assistance." });
});

// Image Analysis Endpoint
app.post("/api/analyze-image", upload.single('image'), async (req, res) => {
    const { prompt = "Analyze this image and describe its content in detail. Provide suggestions if it's a study note or problem." } = req.body;
    const file = req.file;

    // 0. Prepare Image Data
    let base64Data;
    let mimeType = "image/jpeg";

    if (file) {
        base64Data = file.buffer.toString("base64");
        mimeType = file.mimetype;
    } else if (req.body.image) {
        base64Data = req.body.image.split(",")[1] || req.body.image;
    } else {
        return res.status(400).json({ error: "No image provided." });
    }

    // 1. Try Gemini Native
    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent([
                prompt,
                { inlineData: { data: base64Data, mimeType } }
            ]);
            return res.json({ result: result.response.text() });
        } catch (err) {
            console.error("Native Gemini Vision Error:", err);
        }
    }

    // 2. Try OpenRouter (Multi-modal)
    if (OPENROUTER_API_KEY) {
        try {
            const response = await fetch(OPENROUTER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-001",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: prompt },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:${mimeType};base64,${base64Data}`
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            if (response.ok) {
                const data = await response.json();
                return res.json({ result: data.choices[0].message.content.trim() });
            }
        } catch (err) {
            console.error("OpenRouter Vision Error:", err.message);
        }
    }

    res.status(500).json({ error: "No AI service available for image analysis." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ MindMate Backend running at http://localhost:${PORT}`);
    if (!GROQ_API_KEY) console.log("⚠️  Running in OFFLINE/MOCK mode (No API Key detected)");
});
