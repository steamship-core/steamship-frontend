import {createMarkdownBlockStreamParserFromBlock} from '../../../src/streaming/block-stream'
import {StreamQueue} from "../../../src/streaming/stream-queue"
import {streamToString, stringToStream} from "../../../src/streaming/utils"

import {
    TEST_IMAGE_BLOCK,
    TEST_AUDIO_BLOCK,
    TEST_VIDEO_BLOCK,
    TEST_TEXT_BLOCK,
    TEST_FILE_STREAM,
    fileStreamEventsToJsonLines
} from "./data"
import {createFileEventStreamParser, FileStreamEvent} from "../../../src/streaming/file-stream";
import {SteamshipMarkdownStreamFromReader} from "../../../src/streaming/markdown-stream";

describe('markdown-stream',  () => {

    it('should return streams in sequence', async () => {
        const input = TEST_FILE_STREAM
        const inputStream: ReadableStream = stringToStream(fileStreamEventsToJsonLines(input))
        const markdownStream = SteamshipMarkdownStreamFromReader(inputStream) // TODO: Typing wrinkle.

        const output = streamToString(markdownStream)
        let expectedOutput = '';

        // Add the blocks to the queue
        for (let event of input) {
            if (event.event == "BLOCK_APPENDED") {
                expectedOutput += event.data?.text || ''
            }
        }

        expect(output).toEqual(expectedOutput)
    })

})