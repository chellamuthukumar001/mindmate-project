// api/journals.js - Vercel Serverless Function
// NOTE: Vercel functions are stateless — data resets on cold starts.

let journals = [];

module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        return res.json(journals);
    }

    if (req.method === 'POST') {
        const { title, content } = req.body;
        const newEntry = {
            id: Date.now(),
            title,
            content,
            date: new Date().toISOString()
        };
        journals.push(newEntry);
        return res.json(newEntry);
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
