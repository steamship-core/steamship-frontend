import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {streamToArray} from "../../../src/streaming/utils";
import {API_BASE_STAGING, Steamship} from "../../../src/client";

import steamship from "../../../src"


describe('file-event-stream',  () => {

    describe('File Event Stream', () => {
        it('should return a sequence of FileStreamEvent objects', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;

                const eventStream = await steamship.file.stream({id: file.id!}, client)

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

    describe('file-markdown-stream',  () => {
        it('should return streams be able to get it', async () => {
            let client = new Steamship({
                apiKey: '',
                apiBase: API_BASE_STAGING
            })

            const fileId = '91FCBF70-3920-44DC-A742-7FF3146B06B5';
            const stream = await client.eventStream(`file/${fileId}/stream`, {});

            const reader = stream.getReader()
            const read = async (): Promise<void> => {
                const {done, value} = await reader.read();
                if (done) {
                    return;
                } else if (value) {
                    console.log(value)
                }
                return read()
            }
            await read();
        }, 1000 * 10)
    })

})