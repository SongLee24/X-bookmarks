import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // 限制只能用 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const tweets = req.body;

        // 校验数据是否为数组
        if (!Array.isArray(tweets)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        await kv.set('x_bookmarks', tweets);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('KV Save Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}