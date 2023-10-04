import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {streamToArray, streamToString} from "../../../src/streaming/utils";
import {BlockStreamToMarkdownStream} from "../../../src";
import {FileEventStreamToBlockStream} from "../../../src";

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

})