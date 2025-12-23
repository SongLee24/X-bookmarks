import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const newTweets = req.body;
    await kv.set('x_bookmarks_v1', newTweets);
    return res.status(200).json({ success: true });
}