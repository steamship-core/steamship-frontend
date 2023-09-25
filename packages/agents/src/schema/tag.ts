import {IsSteamshipModel, IsUserOwned, IsWorkspaceContained } from "./util";

/** A complex key-valued object that annotates a block or file.
 *
 */
export type Tag = IsSteamshipModel & IsWorkspaceContained & IsUserOwned & {
    fileId?: string;
    blockId?: string;
    startIdx?: number;
    endIdx?: number;
    kind: string;
    name?: string;
    value?: any;
    text?: string;
}