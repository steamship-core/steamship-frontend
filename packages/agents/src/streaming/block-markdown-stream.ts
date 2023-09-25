import { stringToStream } from "./utils";
import {Block} from "../schema/block";
import {Client} from "../client";

/** Convert a BlockCreatedEvent into a Block's streaming URL.
 */
export function getBlockStreamUrl(block: Block, client: Client): string {
    return client.url(`block/${block.id}/raw`)
}

/**
 * Turn a Steamship Block into a stream of the Markdown representation of its content.
 *
 * For media, we creat a stream containing a Markdown embed of its stream URL.
 * For text, we create a stream of the text contents of the block.
 *
 * @param block
 * @param client
 */
const streamBlockAsMarkdown = async (block: Block, client: Client): Promise<ReadableStream<string>> => {
    const contentUrl = getBlockStreamUrl(block, client);

    if (block.mimeType?.startsWith("audio/")) {
        return stringToStream(`[audio](${contentUrl})`)
    } else if (block.mimeType?.startsWith("video/")) {
        return stringToStream(`[video](${contentUrl})`)
    } else if (block.mimeType?.startsWith("image/")) {
        return stringToStream(`![image](${contentUrl})`)
    } else {
        const resp = await client.get(`block/${block.id}/raw`);
        return resp.body as ReadableStream;
    }
}

export {
    streamBlockAsMarkdown,
}