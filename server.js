// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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

        // 1. Check if Key exists
        if (!GROQ_API_KEY) {
            console.warn("⚠️ No API Key found. Using Mock Response.");
            return res.json({
                reply: getMockResponse(userMessage),
                isMock: true
            });
        }

        const systemMessage = {
            role: "system",
            content: "You are MindMate, a compassionate, empathetic, and calming AI mental health assistant. Keep your responses concise, supportive, and warm."
        };

        // 2. Try actual API Call
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
                max_tokens: 1024,
            }),
        });

        const data = await response.json();

        // 3. Handle API Errors (e.g., Invalid Key) gracefully
        if (!response.ok) {
            console.error("❌ Groq API Error:", data.error?.message || data);

            // Fallback to mock instead of crashing frontend
            return res.json({
                reply: getMockResponse(userMessage),
                isMock: true,
                error: "API connection failed, switched to offline mode."
            });
        }

        res.json({ reply: data.choices[0].message.content.trim() });

    } catch (err) {
        console.error("❌ Server Error:", err.message);
        // Final catch-all fallback
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

    if (!GROQ_API_KEY) {
        return res.json({
            summary: "Offline mode — showing general guidance.",
            result: {
                urgency: 'moderate', urgency_score: 5,
                department: 'General Medicine', specialist: 'General Physician',
                possible_conditions: ['Common Cold', 'Viral Infection'],
                treatment: ['Rest and hydrate', 'Monitor symptoms', 'See a doctor if symptoms worsen'],
            },
        });
    }

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
                max_tokens: 800,
            }),
        });

        const data = await response.json();
        if (!response.ok) return res.status(500).json({ error: 'AI service unavailable.' });

        const rawContent = data.choices[0].message.content.trim();
        const jsonStr = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

        let parsed;
        try { parsed = JSON.parse(jsonStr); }
        catch { return res.status(500).json({ error: 'AI returned unexpected format. Try again.' }); }

        return res.json({
            summary: parsed.summary || '',
            result: {
                urgency: parsed.urgency || 'moderate',
                urgency_score: parsed.urgency_score || 5,
                department: parsed.department || 'General Medicine',
                specialist: parsed.specialist || 'General Physician',
                possible_conditions: parsed.possible_conditions || [],
                treatment: parsed.treatment || [],
            },
        });
    } catch (err) {
        console.error("❌ Symptoms Error:", err.message);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ MindMate Backend running at http://localhost:${PORT}`);
    if (!GROQ_API_KEY) console.log("⚠️  Running in OFFLINE/MOCK mode (No API Key detected)");
});
