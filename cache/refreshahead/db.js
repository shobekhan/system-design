// db.js

const users = new Map();

users.set(1, { id: 1, name: "Alice" });

export async function getUserFromDB(userId) {
    console.log("DB READ", userId);
    // simulate slow DB
    await new Promise(r => setTimeout(r, 1000));
    return users.get(Number(userId));
}

export async function updateUserInDB(user) {
    console.log("DB WRITE", user.id);
    users.set(user.id, user);
    return user;
}