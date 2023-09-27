import {HasHandle, IsSteamshipModel, IsUserOwned, IsWorkspaceContained} from "./util.ts"
import {Tag} from "./tag.ts"
import {Block} from "./block.ts"

/**
 * Steamship Package Instance.
 *
 * Package Instances are copies of a Package or Agent running in the cloud.
 *
 * They maintain their own task queue, set of web endpoints, chat histories, and data.
 */
export type PackageInstance = IsSteamshipModel & IsWorkspaceContained & IsUserOwned & HasHandle & {
}

export type PartialPackageInstance = Partial<PackageInstance>