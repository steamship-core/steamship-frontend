import {IsWorkspaceContained, IsSteamshipModel, IsUserOwned} from "./util.ts"
import {Tag} from './tag'

/** A multimedia object within a chat history or file.
 *
 */
export type Block = IsSteamshipModel & IsWorkspaceContained & IsUserOwned & {
    fileId?: string;
    text?: string;
    tags?: Tag[];
    contentUrl?: string;
    mimeType?: string;
    url?: string;
    index?: number;
    publicData?: boolean;
}