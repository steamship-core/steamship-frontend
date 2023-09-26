import {Block} from "../schema/block";
import {FileEvent, BlockCreatedPayload, ServerSentEvent} from "../schema/event";
import {Client} from "../client";
import {createFileBlockStreamFromFileEventStream} from "./file-block-stream";
import * as EventSource from "eventsource"

import { createParser } from "eventsource-parser";


export function createFileStreamParserFromResponse(
    res: Response,
): ReadableStream {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    let counter = 0

    const stream = new ReadableStream({
        async start(controller): Promise<void> {
            function onParse(event: ParsedEvent | ReconnectInterval): void {

                if (event.type === 'event') {
                    const data = event.data
                    if (data === '[DONE]') {
                        controller.close()
                        return
                    }
                    try {
                        const json = JSON.parse(data)
                        const text =
                            json.choices[0]?.delta?.content ?? json.choices[0]?.text ?? ''

                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            return
                        }

                        const queue = encoder.encode(`${JSON.stringify(text)}\n`)
                        controller.enqueue(queue)

                        counter++
                    } catch (e) {
                        controller.error(e)
                    }
                }
            }

            const parser = createParser(onParse)
            // [Asynchronously iterate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) the response's body
            for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk))
            }
        }
    })

    return stream
}

/**
 * Create a stream of FileStreamEVent from a Steamship File ID and a Steamship Client.
 * @param fileId
 * @param client
 */
async function createFileEventStreamFromFileId(fileId: string, client: Client): Promise<ReadableStream<FileEvent>> {
    const resp = await client.get(`file/${fileId}/stream?timeoutSeconds=30`)
    return createFileStreamParserFromResponse(resp)
}


export { createFileStreamParser, createFileEventStreamFromFileId }