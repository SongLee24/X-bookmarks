import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const tweets = await kv.get('x_bookmarks_v1') || [];
    return res.status(200).json(tweets);
}