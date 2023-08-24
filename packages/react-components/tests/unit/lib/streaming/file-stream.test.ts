import {createFileStreamParser, FileStreamEvent} from '../../../../src/lib/streaming/file-stream'
import {streamToString, streamToArray, stringToStream} from "../../../../src/lib/streaming/utils"

import {TEST_FILE_STREAM, fileStreamEventsToJsonLines} from "./data"

describe('file-stream',  () => {

    describe('File Stream', () => {
        it('should return a sequence of FileStreamEvent objects', async () => {

            const input = TEST_FILE_STREAM
            const inputStream = stringToStream(fileStreamEventsToJsonLines(input))

            const reader: ReadableStream<FileStreamEvent> = await createFileStreamParser(inputStream.getReader())

            const output = await streamToArray(reader, false)

            expect(output.length).toEqual(input.length)

            for (let i = 0; i < output.length; i++) {
                const inputItem = input[i]
                const outputItem = output[i]
                expect(outputItem).toEqual(inputItem)
            }
        })
    })

})