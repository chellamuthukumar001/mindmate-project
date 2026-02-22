// api/symptoms.js - Vercel Serverless Function (ESM)

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a medically-informed AI symptom analysis assistant.
Analyze patient-reported symptoms and provide structured medical guidance.

RULES:
- Always respond with a valid JSON object only (no markdown, no extra text).
- Never diagnose — provide possible conditions and refer to appropriate help.
- Always recommend professional consultation.

Respond ONLY with this exact JSON:
{
  "summary": "One friendly sentence summarizing findings",
  "urgency": "emergency" | "urgent" | "moderate" | "low",
  "urgency_score": <1-10>,
  "department": "Department name",
  "specialist": "Type of doctor",
  "possible_conditions": ["Condition 1", "Condition 2", "Condition 3"],
  "treatment": ["Step 1", "Step 2", "Step 3", "When to seek immediate care"]
}`;

const OFFLINE_RESPONSE = {
    summary: "Offline mode — showing general guidance. Please consult a doctor for accurate diagnosis.",
    result: {
        urgency: 'moderate',
        urgency_score: 5,
        department: 'General Medicine',
        specialist: 'General Physician',
        possible_conditions: ['Common Cold', 'Viral Infection', 'Fatigue'],
        treatment: [
            'Rest and stay hydrated',
            'Monitor symptoms for 24–48 hours',
            'Take OTC medication for symptomatic relief if appropriate',
            'Visit a doctor if symptoms worsen or persist beyond 3 days',
        ],
    },
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { symptoms } = body || {};

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 3) {
        return res.status(400).json({ error: 'Please provide a valid symptom description.' });
    }

    if (!GROQ_API_KEY) {
        console.warn('GROQ_API_KEY not set — returning offline response');
        return res.json(OFFLINE_RESPONSE);
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
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: `Patient symptoms: ${symptoms.trim()}` },
                ],
                temperature: 0.3,
                max_tokens: 800,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Groq API error:', JSON.stringify(data));
            return res.json(OFFLINE_RESPONSE);
        }

        const rawContent = data.choices[0].message.content.trim();
        const jsonStr = rawContent
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(jsonStr);
        } catch {
            console.error('Failed to parse AI response:', rawContent);
            return res.json(OFFLINE_RESPONSE);
        }

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
        console.error('Symptoms handler error:', err.message);
        return res.json(OFFLINE_RESPONSE);
    }
}
