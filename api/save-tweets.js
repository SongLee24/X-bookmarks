import { createClient } from "redis"

let redisClient;

async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({ url: process.env.REDIS_URL });
        await redisClient.connect();
    }
    return redisClient;
}

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

        const client = await getRedisClient();
        // Redis 只能存字符串，必须序列化
        await client.set('x_bookmarks', JSON.stringify(tweets));
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Redis Save Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}