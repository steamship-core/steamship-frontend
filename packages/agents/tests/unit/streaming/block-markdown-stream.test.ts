import {streamToString} from "../../../src/streaming/utils"

import {TEST_IMAGE_BLOCK, TEST_AUDIO_BLOCK, TEST_VIDEO_BLOCK, TEST_TEXT_BLOCK, MockClient} from "../mock-client"
import {streamBlockAsMarkdown} from "../../../src/streaming/block-markdown-stream";

describe('markdown-block-stream',  () => {
    let client = new MockClient()

    describe('Image Block', () => {
        it('should return a Markdown image', async () => {
            const reader: ReadableStream<string> = await streamBlockAsMarkdown(TEST_IMAGE_BLOCK, client)
            const str = await streamToString(reader)
            expect(str).toEqual(TEST_IMAGE_BLOCK.text)
        })
    })

    describe('Audio Block', () => {
        it('should return a Markdown link to a audio file', async () => {
            const reader: ReadableStream<string> = await streamBlockAsMarkdown(TEST_AUDIO_BLOCK, client)
            const str = await streamToString(reader)
            expect(str).toEqual(TEST_AUDIO_BLOCK.text)
        })
    })

    describe('Video Block', () => {
        it('should return a Markdown link to a video file ', async () => {
            const reader: ReadableStream<string> = await streamBlockAsMarkdown(TEST_VIDEO_BLOCK, client)
            const str = await streamToString(reader)
            expect(str).toEqual(TEST_VIDEO_BLOCK.text)
        })
    })

    describe('Text Block', () => {
        it('should return a stream to the text content of the block ', async () => {
            const reader: ReadableStream<string> = await streamBlockAsMarkdown(TEST_TEXT_BLOCK, client)
            const str = await streamToString(reader)
            expect(str).toEqual(TEST_TEXT_BLOCK.text)
        })
    })

})