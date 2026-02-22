// api/journals.js - Vercel Serverless Function (ESM)
// NOTE: Vercel functions are stateless — data resets on cold starts.

let journals = [];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        return res.json(journals);
    }

    if (req.method === 'POST') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch { body = {}; }
        }
        const { title, content } = body || {};
        const newEntry = {
            id: Date.now(),
            title,
            content,
            date: new Date().toISOString(),
        };
        journals.push(newEntry);
        return res.json(newEntry);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
