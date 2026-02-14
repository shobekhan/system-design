// db.js

const users = new Map();

export async function getUserFromDB(id) {
    console.log("DB READ");
    return users.get(id);
}

export async function updateUserInDB(user) {
    console.log("DB WRITE");
    users.set(user.id, user);
    return user;
}