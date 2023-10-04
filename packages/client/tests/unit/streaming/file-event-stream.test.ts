import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {streamToArray} from "../../../src/streaming/utils";
import {Steamship} from "../../../src/client";
import {API_BASE_STAGING} from "../../../src/schema/client";


describe('file-event-stream',  () => {
    describe('File Event Stream', () => {
        it('should return a sequence of FileStreamEvent objects', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;

                const eventStream = await client.file.stream({id: file.id!})

                const eventArray = await streamToArray(eventStream, false)

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