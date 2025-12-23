// storage.js - 适配 Vercel KV 接口
export const Storage = {
    // 从后端获取所有推文
    async getAll() {
        try {
            const response = await fetch('/api/get-tweets');
            if (!response.ok) throw new Error('Failed to fetch');
            return await response.json();
        } catch (error) {
            console.error('Storage Error:', error);
            return [];
        }
    },

    // 添加新推文并同步到后端
    async add(url, id) {
        try {
            const current = await this.getAll();

            if (current.some(item => item.id === id)) {
                return { success: false, error: 'exists' };
            }

            const newItem = {
                id,
                url,
                addedAt: new Date().toISOString()
            };

            const updated = [newItem, ...current];

            // 发送到后端 API
            const response = await fetch('/api/save-tweets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });

            if (!response.ok) throw new Error('Failed to save');
            return { success: true };
        } catch (error) {
            console.error('Storage Error:', error);
            return { success: false, error: 'server' };
        }
    },

    // 删除推文并同步到后端
    async remove(id) {
        try {
            const current = await this.getAll();
            const updated = current.filter(item => item.id !== id);

            await fetch('/api/save-tweets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            return true;
        } catch (error) {
            console.error('Storage Error:', error);
            return false;
        }
    }
};
