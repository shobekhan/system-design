// refreshAheadCache.js
export class RefreshAheadCache {

    constructor({
        ttlMs = 10000,
        refreshAheadMs = 3000,
        loader
    }) {
        this.store = new Map();
        this.ttlMs = ttlMs;
        this.refreshAheadMs = refreshAheadMs;
        this.loader = loader;
        this.refreshTimers = new Map();
    }

    /**
     * Get value from cache
     */
    async get(key) {
        const entry = this.store.get(key);

        if (entry && Date.now() < entry.expiresAt) {
            console.log("CACHE HIT", key);
            return entry.value;
        }

        console.log("CACHE MISS", key);

        return this.loadAndStore(key);
    }

    /**
     * Load from source and store in cache
     */
    async loadAndStore(key) {
        const value = await this.loader(key);

        const expiresAt = Date.now() + this.ttlMs;

        this.store.set(key, {
            value,
            expiresAt
        });

        this.scheduleRefresh(key);

        return value;
    }

    /**
     * Schedule refresh before expiration
     */
    scheduleRefresh(key) {
        // clear existing timer
        const existingTimer = this.refreshTimers.get(key);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const refreshTime = this.ttlMs - this.refreshAheadMs;

        const timer = setTimeout(async () => {

            try {
                console.log("REFRESH AHEAD", key);

                const value = await this.loader(key);

                const expiresAt = Date.now() + this.ttlMs;

                this.store.set(key, {
                    value,
                    expiresAt
                });

                this.scheduleRefresh(key);
            } catch (err) {
                console.error("Refresh failed", err);

                // retry after short delay
                setTimeout(() => this.scheduleRefresh(key), 1000);
            }

        }, refreshTime);

        this.refreshTimers.set(key, timer);
    }

    /**
     * Optional manual invalidation
     */
    invalidate(key) {
        this.store.delete(key);

        const timer = this.refreshTimers.get(key);

        if (timer) {
            clearTimeout(timer);
            this.refreshTimers.delete(key);
        }
    }
}