import {FileEventStreamToBlockStream} from "./file-event-stream-to-block-stream";
import {BlockStreamToMarkdownStream} from "./block-stream-to-markdown-stream";

/**
 * Stream Agent responses from Steamship.
 *
 * Note:   Thie file is intended to be submitted to @vercel/ai and is modeled after Replicate's contribution here:
 *         https://github.com/vercel/ai/blob/main/packages/core/streams/replicate-stream.ts
 *
 * RFC:    Similar to Repliacte, we could consider providing:
 *           1) A single "respond" method that creates/fetches the package and then invokes response
 *           2) A helper method (SteamshipStream) that converts this response into a Markdown stream
 *
 *         Alternative:
 *           1) Have an 'Agent' class that one first creates
 *           2) Invoke the `generate` method on that Agent class
 *
 * Steamship Agents act like LLMs, but they are stateful, remembering your conversation history.
 *
 * @example
 * const response = await steamship.agents.respond({
 *  agent: {
 *      "handle": "ai-dungeon",
 *      "instance": "my-instance-handle",
 *  },
 *  input: {
 *    prompt: messages.join('\n')
 *  },
 * })
 *
 * const stream = await SteamshipStream(response)
 * return new StreamingTextResponse(stream)
 *
 */
export async function SteamshipStream(
    res: Prediction,
    cb?: AIStreamCallbacksAndOptions,
): Promise<ReadableStream> {

    // 1. Parse response from agent. This will contain information necessaty to get the stream URL
    const chatFileId = null;
    const responseId = null;
    const responseTimeout = null;

    // 2. Create a stream wrapping that.
    const eventStream = await client.eventStream(`file/${fileId}/stream?timeoutSeconds=3`, {});
    const blockStream = eventStream.pipeThrough(FileEventStreamToBlockStream(client))
    const markdownStream = blockStream.pipeThrough(BlockStreamToMarkdownStream(client))

    return AIStream(markdownStream)
}