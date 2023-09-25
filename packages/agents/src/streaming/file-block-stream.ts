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
import {createFileEventStreamParserFromResponse} from "./file-event-stream";

const utf8Decoder = new TextDecoder('utf-8')

/*
 * Parse FileStreamEvents from a stream and enqueue the associated blockCreated block to a Block stream controller.
 */
async function sendBlocksToFileBlockController(
    reader: ReadableStreamDefaultReader<FileStreamEvent>,
    controller: ReadableStreamDefaultController<Block>,
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

        // Now emit the block
        controller.enqueue(block)
    }

    controller.close()
}

/**
 * Create a stream of Block objects from a streqam of FileStreamEvent objects.
 * @param eventStream
 * @param client
 */
async function createFileBlockStreamFromFileEventStream(eventStream: ReadableStreamDefaultReader<FileStreamEvent>, client: Client): Promise<ReadableStream<Block>> {
    return new ReadableStream<Block>({
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
 * Create a stream of FileStreamEVent from a Steamship File ID and a Steamship Client.
 * @param fileId
 * @param client
 */
async function createFileBlockStreamFromFileId(fileId: string, client: Client): Promise<ReadableStream<Block>> {
    const response = await client.get(`file/${fileId}/stream`);
    const eventStream = createFileEventStreamParserFromResponse(response);
    return  createFileBlockStreamFromFileEventStream(eventStream.getReader(), client)
}


export { createFileBlockStreamFromFileEventStream, createFileBlockStreamFromFileId }