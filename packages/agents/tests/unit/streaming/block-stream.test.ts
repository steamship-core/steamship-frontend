import {createMarkdownBlockStreamParserFromBlock} from '../../../src/streaming/block-stream'
import {streamToString} from "../../../src/streaming/utils"

import {TEST_IMAGE_BLOCK, TEST_AUDIO_BLOCK, TEST_VIDEO_BLOCK, TEST_TEXT_BLOCK} from "./data"

describe('markdown-block-stream',  () => {

    describe('Image Block', () => {
        it('should return a Markdown image', async () => {
            const reader: ReadableStream<string> = await createMarkdownBlockStreamParserFromBlock(TEST_IMAGE_BLOCK)
            const str = await streamToString(reader)
            expect(str).toEqual(TEST_IMAGE_BLOCK.text)
        })
    })

    describe('Audio Block', () => {
        it('should return a Markdown link to a audio file', async () => {
            const reader: ReadableStream<string> = await createMarkdownBlockStreamParserFromBlock(TEST_AUDIO_BLOCK)
            const str = await streamToString(reader)
            expect(str).toEqual(TEST_AUDIO_BLOCK.text)
        })
    })

    describe('Video Block', () => {
        it('should return a Markdown link to a video file ', async () => {
            const reader: ReadableStream<string> = await createMarkdownBlockStreamParserFromBlock(TEST_VIDEO_BLOCK)
            const str = await streamToString(reader)
            expect(str).toEqual(TEST_VIDEO_BLOCK.text)
        })
    })

    describe('Text Block', () => {
        it('should return a stream to the text content of the block ', async () => {
            const reader: ReadableStream<string> = await createMarkdownBlockStreamParserFromBlock(TEST_TEXT_BLOCK)
            const str = await streamToString(reader)
            expect(str).toEqual(TEST_TEXT_BLOCK.text)
        })
    })

})