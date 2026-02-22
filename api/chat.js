// api/chat.js - Vercel Serverless Function
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const getMockResponse = () => {
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

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        if (!GROQ_API_KEY) {
            console.warn('No GROQ_API_KEY set. Using mock response.');
            return res.json({ reply: getMockResponse(), isMock: true });
        }

        const systemMessage = {
            role: 'system',
            content: 'You are MindMate, a compassionate, empathetic, and calming AI mental health assistant. Keep your responses concise, supportive, and warm.'
        };

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [systemMessage, ...messages],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Groq API Error:', data.error?.message || data);
            return res.json({
                reply: getMockResponse(),
                isMock: true,
                error: 'API connection failed, switched to offline mode.'
            });
        }

        return res.json({ reply: data.choices[0].message.content.trim() });

    } catch (err) {
        console.error('Chat handler error:', err.message);
        return res.json({ reply: "I'm having trouble connecting right now, but I'm still here for you. (Offline Mode)" });
    }
};
