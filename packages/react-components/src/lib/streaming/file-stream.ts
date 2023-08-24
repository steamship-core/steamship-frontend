/*
 * Sketch at how we might implement the SteamshipStream class.
 */

import {SteamshipBlock} from "./datamodel";

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

/*
 * Processes each line of the file stream. Each line is expected to be a UTF-8 string containing a JSON object
 * that represents a FileStreamEvent.
 */
async function sendStringsToFileStreamEventController(
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

/*
 * Parses UTF-8 lines out of the stream of bytes and passes those lines to `processLines` for interpretation.
 */
async function sendBytesToFileStreamEventController(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    controller: ReadableStreamDefaultController<FileStreamEvent>
) {
    let segment = ''

    while (true) {
        const { value: chunk, done } = await reader.read()
        if (done) {
            break
        }

        // TODO: I think something might be wrong if chunk can be a string here..
        segment += (typeof chunk == 'string') ? chunk : utf8Decoder.decode(chunk as any, { stream: true })

        const linesArray = segment.split(/\r\n|\n|\r/g)
        segment = linesArray.pop() || ''

        await sendStringsToFileStreamEventController(linesArray, controller)
    }

    if (segment) {
        const linesArray = [segment]
        await sendStringsToFileStreamEventController(linesArray, controller)
    }

    controller.close()
}

/*
 * A FileStream decodes a list of FileStreamEvent Server Sent Events. Each announces when a new block
 * has been appended to a file.
 */
function createFileStreamParser(reader: ReadableStreamDefaultReader): ReadableStream<FileStreamEvent> {
    return new ReadableStream<FileStreamEvent>({
        async start(controller): Promise<void> {
            if (!reader) {
                controller.close()
                return
            }
            await sendBytesToFileStreamEventController(reader, controller)
        }
    })
}

/*
 * A FileStream decodes a list of FileStreamEvent Server Sent Events. Each announces when a new block
 * has been appended to a file.
 */
function createFileStreamParserFromResponse(res: Response): ReadableStream<FileStreamEvent> {
    const reader = res.body?.getReader()
    if (!reader) {
        throw Error("No body in response.")
    }
    return createFileStreamParser(reader)
}

export { createFileStreamParser, createFileStreamParserFromResponse }