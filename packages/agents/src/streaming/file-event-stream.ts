import {Block} from "../schema/block";
import {FileEvent, BlockCreatedPayload, ServerSentEvent} from "../schema/event";
import {Client} from "../client";
import {createFileBlockStreamFromFileEventStream} from "./file-block-stream";
import * as EventSource from "eventsource"

const utf8Decoder = new TextDecoder('utf-8')

/*
 * Processes each line of the file stream. Each line is expected to be a UTF-8 string containing a JSON object
 * that represents a FileStreamEvent.
 */
async function sendStringsToFileStreamEventController(
    lines: string[],
    controller: ReadableStreamDefaultController<FileEvent>
) {
    var eventInProgress: Record<string, any> = {}

    for (const aline of lines) {
        let line = aline.trim()
        if (line == '') {
            // The engine seems to do this nesting that we want to fix.
            if (eventInProgress.event && eventInProgress.data[eventInProgress.event]) {
                eventInProgress.data = eventInProgress.data[eventInProgress.event]
            }
            controller.enqueue(eventInProgress as FileEvent)
            eventInProgress = {}
        } else {
            if (line.startsWith('id: ')) {
                eventInProgress['id'] = line.split('id: ')[1].trim()
            } else if (line.startsWith('event: ')) {
                eventInProgress['event'] = line.split('event: ')[1].trim()
            } else if (line.startsWith('data: ')) {
                eventInProgress['data'] = JSON.parse(line.split('data: ')[1].trim())
            }
        }
    }
}

/*
 * Parses UTF-8 lines out of the stream of bytes and passes those lines to `processLines` for interpretation.
 */
async function sendBytesToFileStreamEventController(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    controller: ReadableStreamDefaultController<FileEvent>
) {
    let segment = ''

    while (true) {
        let chunk, done
        try {
            let read = await reader.read()
            chunk = read.value
            done = read.done
        } catch(e) {
            controller.error(e)
            return
        }

        if (done) {
            break
        }

        let chunkStr = (typeof chunk == 'string') ? chunk : utf8Decoder.decode(chunk as any, { stream: true })

        if (chunkStr.startsWith("{\"status") && chunkStr.includes("\"state\":\"failed\"")) {
            controller.error(new Error(chunkStr))
            return
        }

        segment += chunkStr

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
function createFileStreamParser(reader: ReadableStreamDefaultReader): ReadableStream<FileEvent> {
    return new ReadableStream<FileEvent>({
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
function createFileStreamParserFromResponse(res: Response): ReadableStream<FileEvent> {
    const reader = res.body?.getReader()
    if (!reader) {
        throw Error("No body in response.")
    }
    return createFileStreamParser(reader)
}

/**
 * Create a stream of FileStreamEVent from a Steamship File ID and a Steamship Client.
 * @param fileId
 * @param client
 */
async function createFileEventStreamFromFileId(fileId: string, client: Client): Promise<ReadableStream<FileEvent>> {
    return new ReadableStream<FileEvent>({
        async start(controller): Promise<void> {
            await client.stream(`file/${fileId}/stream`, {
                onmessage(m: FileEvent) {
                    controller.enqueue(m)
                },
                onerror(e: Error) {
                    controller.error(e)
                }
            })
            // await sendBytesToFileStreamEventController(reader, controller)
        }
    })

}


export { createFileStreamParser, createFileStreamParserFromResponse, createFileEventStreamFromFileId }