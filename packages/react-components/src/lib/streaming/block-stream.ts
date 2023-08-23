import {
    type AIStreamCallbacksAndOptions,
    createCallbacksTransformer
} from 'ai/ai-stream'
import { createStreamDataTransformer } from 'ai/stream-data'
import { SteamshipBlock} from "./datamodel";

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
function createBlockStreamParserFromBlock(block: SteamshipBlock): ReadableStream<string> {
    if (block.mimeType?.startsWith("audio/")) {
        return new ReadableStream("[audio file](LINK)")
    } else if (block.mimeType?.startsWith("video/")) {
        return new ReadableStream("[video file](LINK)")
    } else if (block.mimeType?.startsWith("image/")) {
        return new ReadableStream("![image](LINK)")
    } else {
        // TODO: Create blockstream of bytes, which in this case represents the UTF-8return createBlockStreamParserAsText(block)
    }
}
