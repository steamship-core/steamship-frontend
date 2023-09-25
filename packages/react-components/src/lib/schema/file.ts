import {HasHandle, IsSteamshipModel, IsUserOwned, IsWorkspaceContained} from "./util.ts"
import {Tag} from "./tag.ts"
import {Block} from "./block.ts"

export type File = IsSteamshipModel & IsWorkspaceContained & IsUserOwned & HasHandle & {
    tags?: Tag[];
    blocks?: Block[];
}
