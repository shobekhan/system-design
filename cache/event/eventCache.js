// eventCache.js
const eventBus = require("./eventBus");

class EventBasedCache {
  constructor() {
    this.store = new Map();
    this.timers = new Map();

    this.registerEventHandlers();
  }

  registerEventHandlers() {
    // Invalidate cache when user updates
    eventBus.on("user:updated", (userId) => {
      const key = `user:${userId}`;
      console.log("Invalidating cache:", key);
      this.delete(key);
    });

    // Optional: update cache directly from event payload
    eventBus.on("user:refresh", (user) => {
      const key = `user:${user.id}`;
      console.log("Refreshing cache:", key);
      this.set(key, user, 5000);
    });
  }

  set(key, value, ttlMs) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    this.store.set(key, value);

    if (ttlMs) {
      const timeout = setTimeout(() => {
        this.delete(key);
      }, ttlMs);

      timeout.unref();
      this.timers.set(key, timeout);
    }
  }

  get(key) {
    return this.store.get(key) ?? null;
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.store.delete(key);
  }
}

module.exports = EventBasedCache;