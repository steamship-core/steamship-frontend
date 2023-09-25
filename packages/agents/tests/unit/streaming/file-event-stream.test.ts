import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {createFileEventStreamParserFromFileId} from "../../../src/streaming/file-event-stream";
import {streamToArray} from "../../../src/streaming/utils";
import {FileStreamEvent} from "../../../src/schema/event";

describe('file-event-stream',  () => {

    describe('File Event Stream', () => {
        it('should return a sequence of FileStreamEvent objects', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                const reader = await createFileEventStreamParserFromFileId(file.id!, client)

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