// app.js

import { updateUser } from "./userWriteService.js";
import { getUser } from "./userReadService.js";

async function run() {

    await updateUser({ id: 1, name: "Alice" });

    await getUser(1);
    // CACHE MISS user:1:v1
    // DB READ

    await getUser(1);
    // CACHE HIT user:1:v1

    await updateUser({ id: 1, name: "Alice Updated" });
    // DB WRITE

    await getUser(1);
    // CACHE MISS user:1:v2
    // DB READ

    await getUser(1);
    // CACHE HIT user:1:v2

    await updateUser({ id: 1, name: "Alice Updated Again" });
    // DB WRITE

    await getUser(1);
    // CACHE MISS user:1:v3
    // DB READ

    const final = await getUser(1);
    // CACHE HIT user:1:v3
    console.log("Final user:", final);
}

run();