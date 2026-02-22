// api/chat.js - Vercel Serverless Function (ESM)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const getMockResponse = () => {
    const responses = [
        "I hear you. Maintaining mental balance is a journey, and I'm here to support you.",
        "That sounds important. Can you tell me more about how that made you feel?",
        "Take a deep breath. You're doing the best you can.",
        "It's okay to feel this way. I'm listening.",
        "Have you tried taking a moment to practice mindfulness today?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    let body = req.body;

    // Parse body manually if it's a string (some Vercel runtimes need this)
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { messages } = body || {};

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    if (!GROQ_API_KEY) {
        console.warn('GROQ_API_KEY not set — using mock response');
        return res.json({ reply: getMockResponse(), isMock: true });
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are MindMate, a compassionate, empathetic, and calming AI mental health assistant. Keep your responses concise, supportive, and warm.'
                    },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Groq API error:', JSON.stringify(data));
            return res.json({ reply: getMockResponse(), isMock: true });
        }

        return res.json({ reply: data.choices[0].message.content.trim() });

    } catch (err) {
        console.error('Chat handler error:', err.message);
        return res.json({ reply: getMockResponse(), isMock: true });
    }
}
