import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {streamToArray, streamToString} from "../../../src/streaming/utils";
import {API_BASE_STAGING, Steamship} from "../../../src/client";
import {BlockStreamToMarkdownStream} from "../../../src/streaming/block-stream-to-markdown-stream";
import {FileEventStreamToBlockStream} from "../../../src/streaming/file-event-stream-to-block-stream";

describe('file-block-stream',  () => {

    describe('File Block Stream', () => {
        it('should return a sequence of Block objects', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;

                const eventStream = await client.eventStream(`file/${file.id!}/stream`, {});
                const blockStream = eventStream.pipeThrough(FileEventStreamToBlockStream(client))
                const markdownStream = blockStream.pipeThrough(BlockStreamToMarkdownStream(client))

                const outputString = await streamToString(markdownStream)

                let expectedString = ""
                for (let block of file.blocks || []) {
                    expectedString += block.text + "\n\n"
                }

                expect(outputString).toBe(expectedString)
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
            const markdownStream = blockStream.pipeThrough(BlockStreamToMarkdownStream(client))

            const outputString = await streamToString(markdownStream)

            console.log(outputString)
        }, 1000 * 10)
    })

})