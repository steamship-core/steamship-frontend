import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {createFileEventStreamFromFileId} from "../../../src/streaming/file-event-stream";
import {streamToArray} from "../../../src/streaming/utils";
import {FileEvent} from "../../../src/schema/event";
import {Steamship} from "../../../src/client";
import {createFileMarkdownStreamFromFileId} from "../../../src/streaming/file-markdown-stream";

describe('fetch-bug',  () => {
    it('should be reproducible in a few lines of code', async () => {

        // Create a new client.
        let client = new Steamship({apiKey: '05734E32-F33B-49E0-BD78-FB75F5F36B24'})
        const url = 'file/91FCBF70-3920-44DC-A742-7FF3146B06B5/stream';
        let resp = fetch()


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