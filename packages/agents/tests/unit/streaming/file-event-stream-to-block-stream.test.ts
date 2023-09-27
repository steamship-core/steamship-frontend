import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {streamToArray} from "../../../src/streaming/utils";
import {FileEventStreamToBlockStream} from "../../../src/streaming/file-event-stream-to-block-stream";
import {API_BASE_STAGING, Steamship} from "../../../src/client";
import steamship from "../../../src";

describe('file-block-stream',  () => {

    describe('File Block Stream', () => {
        it('should return a sequence of Block objects', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;

                const eventStream = await steamship.file.stream({id: file.id!}, client)
                const blockStream = eventStream.pipeThrough(FileEventStreamToBlockStream(client))

                const blockArray = await streamToArray(blockStream, false)

                expect(blockArray.length).toEqual(file.blocks?.length)

                for (let i = 0; i < blockArray.length; i++) {
                    const block = blockArray[i];
                    const fileBlock = (file.blocks || [])[i]

                    expect(block.id).toBe(fileBlock.id)
                    expect(block.createdAt).toBe(fileBlock.createdAt)
                    expect(block.mimeType).toBe(fileBlock.mimeType)
                    expect(block.text).toBe(fileBlock.text)
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
            const eventStream = await client.eventStream(`file/${fileId}/stream?timeoutSeconds=3`, {});
            const blockStream = eventStream.pipeThrough(FileEventStreamToBlockStream(client))

            const reader = blockStream.getReader()
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