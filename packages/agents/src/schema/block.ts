import {IsWorkspaceContained, IsSteamshipModel, IsUserOwned, IsFileOwned} from "./util.ts"
import {Tag} from './tag'

/**
 * Block
 *
 * Blocks store the content of a file.
 *
 *  Content of a block can either be in the `text` field or stored remotely in S3.
 *  Metadata of a block is added in an unordered list of Tags.
 */
export type Block = IsSteamshipModel & IsWorkspaceContained & IsUserOwned & IsFileOwned & {
    text?: string;
    tags?: Tag[];
    contentUrl?: string;
    mimeType?: string;
    url?: string;
    index: number;
    publicData: boolean;
}

export type PartialBlock = Partial<Block>