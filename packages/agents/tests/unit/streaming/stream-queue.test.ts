import {StreamQueue} from "../../../src/streaming/stream-queue"
import {streamToString} from "../../../src/streaming/utils"

import {TEST_IMAGE_BLOCK, TEST_AUDIO_BLOCK, TEST_VIDEO_BLOCK, TEST_TEXT_BLOCK, MockClient} from "../mock-client"
import {streamBlockAsMarkdown} from "../../../src/streaming/block-markdown-stream";

describe('stream-queue',  () => {
    let client = new MockClient()

    describe('multi-stream handling', () => {
        it('should return streams in sequence', async () => {
            const blocks = [TEST_TEXT_BLOCK, TEST_TEXT_BLOCK, TEST_AUDIO_BLOCK]
            const streamQueue = new StreamQueue<string>()
            let expectedOutput = '';

            // Add the blocks to the queue
            for (let block of blocks) {
                streamQueue.enqueue(await streamBlockAsMarkdown(block, client))
                expectedOutput += block.text
            }

            streamQueue.streamAddingClosed = true;

            // We should have one sub-stream for each block
            expect(streamQueue.length()).toEqual(blocks.length)

            const outputStream = streamQueue.start()
            const streamQueueOutput = await streamToString(outputStream)

            // We should have no sub streams since we've consumed them.
            expect(streamQueue.length()).toEqual(0)

            // The output should match the concatenation of each sub-stream
            expect(streamQueueOutput).toEqual(expectedOutput)
        })
    })

})