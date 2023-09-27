import {
    HasHandle,
    IsSteamshipModel,
    IsUserOwned,
} from "./util.ts"
import {Tag} from './tag'
import {Task} from "./task";

/**
 * Workspace
 *
 * An isolated data container in the cloud.
 */
export type Workspace = IsSteamshipModel & IsUserOwned & HasHandle & {
}

export type PartialWorkspace = Partial<Workspace>
