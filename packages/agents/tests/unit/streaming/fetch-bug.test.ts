import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {createFileEventStreamFromFileId} from "../../../src/streaming/file-event-stream";
import {streamToArray} from "../../../src/streaming/utils";
import {FileEvent} from "../../../src/schema/event";
import {API_BASE_STAGING, Steamship} from "../../../src/client";
import {createFileMarkdownStreamFromFileId} from "../../../src/streaming/file-markdown-stream";

describe('fetch-bug',  () => {
    it('should be reproducible in a few lines of code', async () => {

        // Create a new client.
        let client = new Steamship({
            apiKey: '05734E32-F33B-49E0-BD78-FB75F5F36B24',
            apiBase: API_BASE_STAGING
        })

        // tagKindFilter=request-id&tagNameFilter={req_id}&timeoutSeconds=30
        const url = 'file/91FCBF70-3920-44DC-A742-7FF3146B06B5/stream?timeoutSeconds=30';

        let resp1 = await fetch("https://yahoo.com")
        console.log(resp1.ok)

        const stream = await client.stream(url, {})
        const reader = stream.getReader();

        let resp2 = await fetch("https://yahoo.com")
        console.log(resp2.ok)

        const sleep = async (): Promise<void> => {
        }

        const read = async (): Promise<void> => {
            const r = await reader.read()
            console.log(r)
            return read()
        }
        await read();


    }, 1000000)

})