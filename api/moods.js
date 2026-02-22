// api/moods.js - Vercel Serverless Function
// NOTE: Vercel functions are stateless — data resets on cold starts.
// For persistent storage, use a database (Supabase, MongoDB Atlas, etc.)

let moodHistory = [
    { date: '2024-02-01', value: 4, note: 'Had a great day!' },
    { date: '2024-02-02', value: 3, note: 'A bit tired.' }
];

module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        return res.json(moodHistory);
    }

    if (req.method === 'POST') {
        const { value, note } = req.body;
        const newEntry = {
            date: new Date().toISOString().split('T')[0],
            value,
            note
        };
        moodHistory.push(newEntry);
        return res.json(newEntry);
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
