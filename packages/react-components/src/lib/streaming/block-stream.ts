import { BlockCreatedEvent } from "../schema/event";
import { stringToStream } from "./utils";
import {API_BASE_PRODUCTION} from "../client/constants";

/** Convert a BlockCreatedEvent into a Block's streaming URL.
 */
export function getBlockStreamUrl(block: BlockCreatedEvent, apiBase: string = API_BASE_PRODUCTION): string {
    return `${apiBase}block/${block.blockId}/raw`
}

/*
 * Convert a BlockCreatedEvent into a Block Stream.
 */
export async function getBlockStream(block: BlockCreatedEvent, apiBase: string = API_BASE_PRODUCTION): Promise<ReadableStream> {
    const url = getBlockStreamUrl(block, apiBase)
    const response = await fetch(url);
    return response.body as ReadableStream;
}

/* ==========================================================================================
 * Steamship BlockStream
 *
 * A BlockStream is a stream of bytes that correspond to a block in the file. A presumption
 * is made that the user already has access to the Block object itself (which mas metadata
 * concerning the MIME type, tags, etc) and this stream enables streaming the content within.
 *
 * Examples of block content:
 * - Text, as it is being generated
 * - Spoken audio, as it is being generated
 * - Video, as it is being generated
 *
 * =========================================================================================*/

/*
 * A BlockStream streams the bytes from a Steamship Block.
 */
const createMarkdownBlockStreamParserFromBlock = async (block: SteamshipBlock): Promise<ReadableStream<string>> => {
    if (block.mimeType?.startsWith("audio/")) {
        return stringToStream(`[audio](${blockToContentStreamUrl(block)})`)
    } else if (block.mimeType?.startsWith("video/")) {
        return stringToStream(`[video](${blockToContentStreamUrl(block)})`)
    } else if (block.mimeType?.startsWith("image/")) {
        return stringToStream(`![image](${blockToContentStreamUrl(block)})`)
    } else {
        return await blockToContentStream(block);
    }
}

export {
    createMarkdownBlockStreamParserFromBlock,
}