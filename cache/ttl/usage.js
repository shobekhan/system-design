const TTLCache = require("./ttl-cache");

const cache = new TTLCache();

const databaseCall = () => ({ name: "Alice" })

// Store for 10 seconds
cache.set("user:1", databaseCall(), 10000);

console.log(cache.get("user:1")); 
// → { name: "Alice" }

setTimeout(() => {
  console.log(cache.get("user:1")); 
  // → { name: "Alice" }
}, 6000); // call after 6 seconds

setTimeout(() => {
  console.log(cache.get("user:1")); 
  // → null (expired)
}, 12000);
