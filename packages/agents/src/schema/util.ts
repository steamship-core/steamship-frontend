
/** An object tracked by Steamship */
export type IsSteamshipModel = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
}

/** An object contained within a workspace */
export type IsWorkspaceContained = {
    workspaceId?: string;
}

/** An object owned by a user */
export type IsUserOwned = {
    userId?: string;
}

/** Has Handle */
export type HasHandle = {
    handle?: string;
}