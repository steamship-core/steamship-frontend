import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {createFileStreamParserFromResponse} from "../../../src/streaming/file-stream";
import {streamToArray} from "../../../src/streaming/utils";
import {FileStreamEvent} from "../../../src/schema/event";

describe('file-stream',  () => {

    describe('File Stream', () => {
        it('should return a sequence of FileStreamEvent objects', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                const response = client.get(`file/${file.id || ''}/stream`)
                const reader: ReadableStream<FileStreamEvent> = await createFileStreamParserFromResponse(response)

                const eventArray = await streamToArray(reader, false)

                expect(eventArray.length).toEqual(file.blocks?.length)

                for (let i = 0; i < eventArray.length; i++) {
                    const event = eventArray[i];
                    expect(event.id).not.toBeUndefined()
                    expect(event.event).toBe('blockCreated')
                    expect(event.data).not.toBeUndefined()

                    const data = event.data
                    const block = (file.blocks || [])[i]
                    expect(data.blockId).toBe(block.id)
                    expect(data.createdAt).toBe(block.createdAt)
                }


            }



        })
    })

})