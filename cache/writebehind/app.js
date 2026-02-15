// Fake Database
const database = {
    data: {},

    async write(key, value) {
        console.log(`[DB] Writing ${key} = ${value} ...`);
        
        // simulate slow database
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.data[key] = value;
        
        console.log(`[DB] Finished writing ${key}`);
    },

    read(key) {
        return this.data[key];
    }
};


// Cache (fast)
const cache = {
    data: {},

    set(key, value) {
        this.data[key] = value;
        console.log(`[CACHE] Set ${key} = ${value}`);
    },

    get(key) {
        return this.data[key];
    }
};


// Write-behind queue
const writeQueue = [];

// Worker to process queue
async function writeBehindWorker() {
    while (true) {
        if (writeQueue.length > 0) {
            const job = writeQueue.shift();
            await database.write(job.key, job.value);
        }

        // small delay to prevent CPU overuse
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// API function (write)
function updateUser(userId, name) {

    const key = `user:${userId}`;

    // STEP 1: Write to cache immediately
    cache.set(key, name);

    // STEP 2: Add write to queue
    writeQueue.push({
        key,
        value: name
    });

    console.log(`[API] Update queued for DB`);
}


// API function (read)
function getUser(userId) {
    const key = `user:${userId}`;

    // Read from cache
    const cached = cache.get(key);

    if (cached) {
        console.log(`[API] Returned from cache`);
        return cached;
    }

    console.log(`[API] Returned from DB`);
    return database.read(key);
}

// Start worker
writeBehindWorker();


async function main() {
    console.log("\nUser updates name to Alice\n");

    updateUser(1, "Alice");

    console.log("\nImmediately reading user\n");

    console.log(getUser(1));

    console.log("\nWaiting 3 seconds...\n");

    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log("\nReading again after DB update\n");

    console.log(getUser(1));

    updateUser(1, "Alice updated");

    console.log("\nImmediately after update\n");

    console.log(getUser(1));
}

main();