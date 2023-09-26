import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {createFileEventStreamFromFileId} from "../../../src/streaming/file-event-stream";
import {streamToArray} from "../../../src/streaming/utils";
import {FileEvent} from "../../../src/schema/event";
import {Steamship} from "../../../src/client";
import {createFileMarkdownStreamFromFileId} from "../../../src/streaming/file-markdown-stream";

describe('file-event-stream',  () => {

    describe('File Event Stream', () => {
        it('should return a sequence of FileStreamEvent objects', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                const reader = await createFileEventStreamFromFileId(file.id!, client)

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

    describe('file-markdown-stream',  () => {
        it('should return streams be able to get it', async () => {
            let client = new Steamship({apiKey: '05734E32-F33B-49E0-BD78-FB75F5F36B24'})
            const fileId = '91FCBF70-3920-44DC-A742-7FF3146B06B5';
            const reader = (await createFileEventStreamFromFileId(fileId, client)).getReader()
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
        })
    })

})