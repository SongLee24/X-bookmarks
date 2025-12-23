import { createClient } from "redis"

const redis =  await createClient({ url: process.env.REDIS_URL }).connect();

export default async function handler(req, res) {
    try {
        // 显式设置缓存控制，防止浏览器由于 Vercel 边缘缓存导致数据不更新
        res.setHeader('Cache-Control', 'no-store, max-age=0');

        const tweets = await redis.get('x_bookmarks') || [];
        return res.status(200).json(tweets);
    } catch (error) {
        console.error('Redis Get Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}