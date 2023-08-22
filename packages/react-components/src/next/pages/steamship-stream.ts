/*
 * Sketch at how we might implement the SteamshipStream class.
 */

import {
    type AIStreamCallbacksAndOptions,
    createCallbacksTransformer
} from 'ai/ai-stream'
import { createStreamDataTransformer } from 'ai/stream-data'

/* ==========================================================================================
 * Core Steamship Datamodel
 *
 * The following types represent Steamship's core datamodel:
 * - A File records ChatHistory
 * - A Block is a multimedia unit of ChatHistory
 * - A Tag is an annotation atop a File or Block that carries additional metadata
 *
 * =========================================================================================*/

export type SteamshipModelObject = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type SteamshipWorkspaceContainedObject = SteamshipModelObject & {
    workspaceId?: string;
}

export type SteamshipFile = SteamshipWorkspaceContainedObject & {
    tags?: SteamshipTag[];
}

export type SteamshipTag = SteamshipWorkspaceContainedObject & {
    fileId?: string;
    blockId?: string;
    startIdx?: number;
    endIdx?: number;
    kind: string;
    name?: string;
    value?: any;
    text?: string;
}

export type SteamshipBlock = SteamshipWorkspaceContainedObject & {
    fileId?: string;
    text?: string;
    tags?: SteamshipTag[];
    contentUrl?: string;
    mimeType?: string;
    url?: string;
    index?: number;
    publicData?: boolean;
}

/* ==========================================================================================
 * Steamship FileStream
 *
 * A FileStream is a stream of new Blocks added to a File. In the context of chat, these new
 * blocks represent multimedia messages being streamed into the ChatHistory.
 *
 * Portions the FileStream implementation have been adapted from the cohere-stream.
 *
 * =========================================================================================*/

export type FileStreamEvent = {
    id?: string,
    event?: "BLOCK_APPENDED" | "STREAM_FINISHED"
    data?: SteamshipBlock
}

const utf8Decoder = new TextDecoder('utf-8')

async function processLines(
    lines: string[],
    controller: ReadableStreamDefaultController<FileStreamEvent>
) {
    for (const line of lines) {
        const event: FileStreamEvent = JSON.parse(line)
        if (event.event == "STREAM_FINISHED") {
            controller.close()
        } else {
            controller.enqueue(event)
        }
    }
}


async function readAndProcessFileStreamLines(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    controller: ReadableStreamDefaultController<FileStreamEvent>
) {
    let segment = ''

    while (true) {
        const { value: chunk, done } = await reader.read()
        if (done) {
            break
        }

        segment += utf8Decoder.decode(chunk as any, { stream: true })

        const linesArray = segment.split(/\r\n|\n|\r/g)
        segment = linesArray.pop() || ''

        await processLines(linesArray, controller)
    }

    if (segment) {
        const linesArray = [segment]
        await processLines(linesArray, controller)
    }

    controller.close()
}


/*
 * A FileStream decodes a list of FileStreamEvent Server Sent Events. Each announces when a new block
 * has been appended to a file.
 */
function createFileStreamParser(res: Response): ReadableStream<FileStreamEvent> {
    const reader = res.body?.getReader()

    return new ReadableStream<FileStreamEvent>({
        async start(controller): Promise<void> {
            if (!reader) {
                controller.close()
                return
            }
            await readAndProcessFileStreamLines(reader, controller)
        }
    })
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
function createBlockStreamParserFromBlock(block: SteamshipBlock): ReadableStream<string> {
    if (block.mimeType?.startsWith("audio/")) {
        // TODO: Return a completed stream of:
        //
        // ![](filename.mp3)
        //
    } else if {

    }
    return res.body?.getReader()
}


/* ==========================================================================================
 * StreamQueue
 *
 * A StreamQueue wraps a queue of Streams, popping the head whenever it is complete and moving
 * on to the next. This enables us to form what appears to be a single stream which is actually
 * stitched together from multiple streams.
 *
 * Since Steamship's native data model permits a single completion to emit multiple blocks in
 * response, and each block may be -- itself -- streamed, the StreamQueue is what enables us
 * to coalesce them into a single stream.
 *
 * TODO: The termination condition for this may need to be more than just "the queue is empty"
 *       if we find ourselves needing to wait for some server-side <ENDED> signal.
 *
 * =========================================================================================*/

class StreamQueue<T> {
    private streams: ReadableStreamDefaultController<T>[];
    public outputStream: ReadableStream<T>
    public controller?: ReadableStreamDefaultController<T>;
    public isClosed: boolean;

    constructor() {
        this.streams = []
        this.isClosed = false;
    }

    /*
     * Begin streaming. Returns a ReadableStream that covers the full queue of sub streams.
     */
    public start(): ReadableStream<T> {
        const self = this;
        this.outputStream = new ReadableStream<FileStreamEvent>({
            async start(controller): Promise<void> {
                self.controller = controller;
                await self.consumeLoop();
            }
        })
        return this.outputStream;
    }

    /*
     * Halt Streaming.
     */
    public close() {
        if (! this.controller) {
            throw Error("Unable to call close: no ReadableStreamDefaultController exists.")
        }
        if (this.isClosed) {
            throw Error("Unable to call close: no ReadableStreamDefaultController is closed.")
        }
        this.controller.close();
        this.isClosed = true;
    }

    /*
     * Emit a chunk onto the output stream.
     */
    private emit(chunk: T) {
        if (! this.controller) {
            throw Error("Unable to call emit: no ReadableStreamDefaultController exists.")
        }
        if (this.isClosed) {
            throw Error("Unable to call emit: no ReadableStreamDefaultController is closed.")
        }
        this.controller.enqueue(chunk)
    }

    /*
     * The spin-loop that consumes the queue of streams and emits.
     */
    private async consumeLoop() {
        // TODO: Implement a loop across the embedded streams.
        // CHALLENGE: Knowing "when a sub-stream is done" may be tricky. But might not. Unsure
        // ASSUMPTION: while(true) seems not wrong here.. with a break when we truly are done.

        // for (const line of lines) {
        //     const event: FileStreamEvent = JSON.parse(line)
        //     if (event.event == "STREAM_FINISHED") {
        //         controller.close()
        //     } else {
        //         controller.enqueue(event)
        //     }
        // }
    }

    /*
     * Push a new stream to the queue.
     */
    public enqueue(stream: ReadableStreamDefaultController<T>) {
        this.streams.push(stream)
    }

    /*
     * Dequeue the head from the queue
     */
    public dequeue() {
        if (this.streams.length == 0) {
            throw Error("Unable to call dequeue: the queue was empty.")
        }
        this.streams.shift(); // Index 0 is the head of the queue; .shift() removes the zeroth item.
    }

}

/* ==========================================================================================
 * SteamshipMarkdownStream
 *
 * A SteamshipMarkdownStream emits Markdown containing text, images, audio, and video
 * generated by an LLM or Multimodal Agent.
 *
 * Since Steamship's native data model is to respond to completion requests with a "stream of
 * multi-modal streams", the SteamshipMarkdownStream wrapper funnels these into a single
 * text-only stream using Markdown to represent media.
 *
 * Video and Audio are embedded as links since Markdown lacks native support for these types.
 *
 * =========================================================================================*/

export function SteamshipMarkdownStream(
    reader: Response,
    callbacks?: AIStreamCallbacksAndOptions
): ReadableStream {
    return createParser(reader)
        .pipeThrough(createCallbacksTransformer(callbacks))
        .pipeThrough(
            createStreamDataTransformer(callbacks?.experimental_streamData)
        )
}