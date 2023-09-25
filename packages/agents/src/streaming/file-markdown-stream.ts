/* ==========================================================================================
 * Steamship FileEventStream
 *
 * A FileStream is a stream of new Blocks added to a File. In the context of chat, these new
 * blocks represent multimedia messages being streamed into the ChatHistory.
 *
 * Portions the FileStream implementation have been adapted from the cohere-stream.
 *
 * =========================================================================================*/

import {FileStreamEvent} from "../schema/event";
import {Client} from "../client";
import {Block} from "../schema/block";
import {createFileEventStreamParserFromFileId, createFileEventStreamParserFromResponse} from "./file-event-stream";
import {streamBlockAsMarkdown} from "./block-markdown-stream";
import {StreamQueue} from "./stream-queue";

const utf8Decoder = new TextDecoder('utf-8')

/*
 * Parse FileStreamEvents from a stream and enqueue the associated blockCreated block to a Block stream controller.
 */
async function sendBlocksToFileBlockController(
    reader: ReadableStreamDefaultReader<FileStreamEvent>,
    controller: ReadableStreamDefaultController<ReadableStream<string>>,
    client: Client
) {
    while (true) {
        const { value, done } = await reader.read()

        if (!value) {
            break
        }

        if (done) {
            break
        }

        const { id, event, data } = value

        if (event != "blockCreated") {
            continue
        }

        const { blockId, createdAt } = data;

        // Get the block
        const blockResponse = await client.post("block/get", {id: blockId})
        const blockResponseJson = await blockResponse.json()
        const block = blockResponseJson.block as Block

        // Get the Markdown stream
        const markdownStream = await streamBlockAsMarkdown(block, client)

        // Now emit the block
        controller.enqueue(markdownStream)
    }

    controller.close()
}

/**
 * Create a stream of Markdown objects from a stream of FileStreamEvent objects.
 * @param eventStream
 * @param client
 */
async function createFileMarkdownStreamFromFileEventStream(eventStream: ReadableStreamDefaultReader<FileStreamEvent>, client: Client): Promise<ReadableStream<ReadableStream<string>>> {
    return new ReadableStream<ReadableStream<string>>({
        async start(controller): Promise<void> {
            if (!eventStream) {
                controller.close()
                return
            }
            await sendBlocksToFileBlockController(eventStream, controller, client)
        }
    })
}


/**
 * Create a stream of Markdown from a Steamship File ID and a Steamship Client.
 * @param fileId
 * @param client
 */
async function createFileMarkdownStreamFromFileId(fileId: string, client: Client): Promise<ReadableStream<string>> {
    const eventStream = await createFileEventStreamParserFromFileId(fileId, client);
    const streamOfMarkdownStreams = await createFileMarkdownStreamFromFileEventStream(eventStream.getReader(), client)
    const streamQueue = new StreamQueue<string>()
    streamQueue.enqueueFromStream(streamOfMarkdownStreams)
    return streamQueue.start();
}


export { createFileMarkdownStreamFromFileId }