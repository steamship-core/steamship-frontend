import {
    type AIStreamCallbacksAndOptions,
    createCallbacksTransformer
} from 'ai/ai-stream'
import { createStreamDataTransformer } from 'ai/stream-data'
import { SteamshipBlock} from "./datamodel";


const decoder = new TextDecoder("utf-8");
const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });

/*
 * Fetches the URL at which the Steamship Block's contents can be streamed.
 */
const blockToContentStreamUrl = (b: SteamshipBlock): string => {
    return "https://example.org"
}

/*
 * Returns the Steamship block's contents as a stream.
 */
const blockToContentStream = async (block: SteamshipBlock): Promise<ReadableStream> => {
    const streamUrl = "https://example";
    const response = await fetch(blockToContentStreamUrl(block));
    return response.body;
}

/*
 * Converts a string into a Readable Stream.
 */
const stringToReadableStream = (s: string): ReadableStream => {
    return new ReadableStream({
        start(controller){
            controller.enqueue(s);
            controller.close();
        }
    });
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
function createBlockStreamParser(res: Response): ReadableStreamDefaultReader<Uint8Array> {
    return res.body?.getReader()
}

/*
 * A BlockStream streams the bytes from a Steamship Block.
 */
const createBlockStreamParserFromBlock = async (block: SteamshipBlock): Promise<ReadableStream<string>> => {
    if (block.mimeType?.startsWith("audio/")) {
        return stringToReadableStream("[audio file](LINK)")
    } else if (block.mimeType?.startsWith("video/")) {
        return stringToReadableStream("[video file](LINK)")
    } else if (block.mimeType?.startsWith("image/")) {
        return stringToReadableStream("![image](LINK)")
    } else {
        return await blockToContentStream(block);
    }
}
