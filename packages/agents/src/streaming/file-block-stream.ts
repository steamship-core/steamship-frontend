/* ==========================================================================================
 * Steamship FileEventStream
 *
 * A FileStream is a stream of new Blocks added to a File. In the context of chat, these new
 * blocks represent multimedia messages being streamed into the ChatHistory.
 *
 * Portions the FileStream implementation have been adapted from the cohere-stream.
 *
 * =========================================================================================*/

import {FileEvent} from "../schema/event";
import {Client} from "../client";
import {Block} from "../schema/block";
import {createFileEventStreamParserFromFileId} from "./file-event-stream";

const utf8Decoder = new TextDecoder('utf-8')

/*
 * Parse FileStreamEvents from a stream and enqueue the associated blockCreated block to a Block stream controller.
 */
async function sendBlocksToFileBlockController(
    reader: ReadableStreamDefaultReader<FileEvent>,
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

        if (!blockId) {
            controller.error(new Error(`No blockId present in File Stream Event.`))
            break
        }

        console.log("Yahooooo")
        const yahoo = await fetch("https://yahoo.com")
        console.log("Yaho")

        // Get the block
        const blockResponse = await client.post("block/get", {id: blockId})
        if (!blockResponse.ok) {
            controller.error(new Error(`Unable to fetch block returned by File Stream. ${await blockResponse.text()}`))
            break        
        }

        console.log("Block response ok")
        
        try {
            const blockResponseJson = await blockResponse.json()
            const block = blockResponseJson.block as Block
            // Now emit the block
            controller.enqueue(block)
        } catch (e) {
            controller.error(e)
            break
        }
    }

    controller.close()
}

/**
 * Create a stream of Block objects from a streqam of FileStreamEvent objects.
 * @param eventStream
 * @param client
 */
async function createFileBlockStreamFromFileEventStream(eventStream: ReadableStreamDefaultReader<FileEvent>, client: Client): Promise<ReadableStream<Block>> {
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
    const eventStream = await createFileEventStreamParserFromFileId(fileId, client);
    return  createFileBlockStreamFromFileEventStream(eventStream.getReader(), client)
}


export { createFileBlockStreamFromFileEventStream, createFileBlockStreamFromFileId }