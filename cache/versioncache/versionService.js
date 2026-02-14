// versionService.js

import { cache } from "./cacheClient.js";

export async function getUserVersion(userId) {
    const key = `user:${userId}:version`;

    const version = await cache.get(key);

    return version || "1";
}

export async function bumpUserVersion(userId) {
    const key = `user:${userId}:version`;

    const current = await cache.get(key);

    if (!current) {
        await cache.set(key, '1');
        return 1;
    }

    return cache.incr(key);
}