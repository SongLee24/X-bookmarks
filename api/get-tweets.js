import { createClient } from "redis"

// 在函数外声明变量，实现跨请求重用连接
let redisClient;

async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({ url: process.env.REDIS_URL });
        redisClient.on('error', err => console.error('Redis Client Error', err));
        await redisClient.connect();
    }
    return redisClient;
}

export default async function handler(req, res) {
    try {
        // 显式设置缓存控制，防止浏览器由于 Vercel 边缘缓存导致数据不更新
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        const client = await getRedisClient();

        const data = await client.get('x_bookmarks');
        const tweets = data ? JSON.parse(data) : [];
        return res.status(200).json(tweets);
    } catch (error) {
        console.error('Redis Get Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}