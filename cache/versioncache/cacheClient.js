// cacheClient.js

class CacheClient {
    constructor() {
        this.store = new Map();
    }

    async get(key) {
        const entry = this.store.get(key);

        if (!entry) return null;

        // TTL check
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return entry.value;
    }

    async setEx(key, ttlSeconds, value) {
        const expiresAt = Date.now() + ttlSeconds * 1000;

        this.store.set(key, {
            value,
            expiresAt
        });
    }

    async incr(key) {
        const current = await this.get(key);
        const next = current ? Number(current) + 1 : 2;
        this.store.set(key, { value: String(next) });
        return next;
    }

    async set(key, value) {
        this.store.set(key, { value });
    }
}

export const cache = new CacheClient();