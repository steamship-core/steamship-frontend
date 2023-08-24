import { SteamshipBlock} from "./datamodel";
import { stringToStream } from "./utils";

/*
 * Fetches the URL at which the Steamship Block's contents can be streamed.
 */
const blockToContentStreamUrl = (b: SteamshipBlock): string => {
    return b.url || "";
}

/*
 * Returns the Steamship block's contents as a stream.
 */
const blockToContentStream = async (block: SteamshipBlock): Promise<ReadableStream> => {
    const response = await fetch(blockToContentStreamUrl(block));
    return response.body as any;
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