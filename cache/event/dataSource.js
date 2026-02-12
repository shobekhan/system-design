// dataSource.js
const eventBus = require("./eventBus");

const fakeDB = new Map();

function updateUser(user) {
  fakeDB.set(user.id, user);

  // Emit event when data changes
  eventBus.emit("user:updated", user.id);
}

function getUserFromDB(userId) {
  return fakeDB.get(userId) || null;
}

module.exports = { updateUser, getUserFromDB };