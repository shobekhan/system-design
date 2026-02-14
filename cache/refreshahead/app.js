import { RefreshAheadCache } from "./refreshAheadCache.js";
import { getUserFromDB } from "./db.js";

const userCache = new RefreshAheadCache({
    ttlMs: 10000,
    refreshAheadMs: 3000,
    loader: getUserFromDB
});

async function run() {
    console.log("\nFirst request");
    await userCache.get(1);

    console.log("\nSecond request");
    await userCache.get(1);

    console.log("\nWaiting 8 seconds...");
    await new Promise(r => setTimeout(r, 8000));

    console.log("\nThird request (should still hit cache)");
    await userCache.get(1);
}

run();