import {HasHandle, IsSteamshipModel, IsUserOwned, IsWorkspaceContained} from "./util"

/**
 * Steamship Package Instance.
 *
 * Package Instances are copies of a Package or Agent running in the cloud.
 *
 * They maintain their own task queue, set of web endpoints, chat histories, and data.
 */
export type PackageInstance = IsSteamshipModel & IsWorkspaceContained & IsUserOwned & HasHandle & {
    /**
     * The invocation URL base of the package.
     */
    invocationUrl: string

    /**
     * The handle of the package tied to this instance.
     */
    packageHandle: string

    /**
     * The ID of the package tied to this instance.
     */
    packageId: string;

    /**
     * The handle of the package version tied to this instance.
     */
    packageVersionHandle: string

    /**
     * The ID of the package version tied to this instance.
     */
    packageVersionId: string;

    /**
     * The ID of the workspace this instance resides within.
     */
    workspaceId: string;
}

export type PartialPackageInstance = Partial<PackageInstance>

