import {
    HasHandle,
    IsSteamshipModel, IsUserOwned,
    IsWorkspaceContained,
    SteamshipModelObject,
    SteamshipWorkspaceContainedObject
} from "./util.ts"
import {Tag} from './tag'

/** A multimedia object within a chat history or file.
 *
 */
export type Workspace = IsSteamshipModel & IsUserOwned & HasHandle & {
}