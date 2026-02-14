// userWriteService.js

import { updateUserInDB } from "./db.js";
import { bumpUserVersion } from "./versionService.js";

export async function updateUser(user) {

    const updated = await updateUserInDB(user);

    // invalidate cache via version bump
    await bumpUserVersion(user.id);

    return updated;
}