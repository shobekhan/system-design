// app.js
const EventBasedCache = require("./eventCache");
const { updateUser, getUserFromDB } = require("./dataSource");

const cache = new EventBasedCache();

async function getUser(userId) {
  const cacheKey = `user:${userId}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log("Cache hit");
    return cached;
  }

  console.log("Cache miss → DB fetch");
  const user = getUserFromDB(userId);

  if (user) {
    cache.set(cacheKey, user, 10000); // TTL 10s
  }

  return user;
}

// --- Demo flow ---

updateUser({ id: 1, name: "Alice" });

getUser(1).then(console.log); // miss → DB → cache
getUser(1).then(console.log); // hit
getUser(1).then(console.log); // hit

// Update user → triggers event → invalidates cache
setTimeout(() => {
  updateUser({ id: 1, name: "Alice Updated" });
}, 3000);

// After invalidation → miss again
setTimeout(() => {
  getUser(1).then(console.log);
}, 5000);
