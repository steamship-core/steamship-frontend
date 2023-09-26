import {streamToArray, streamToString, stringToStream} from "../../../src/streaming/utils"

import {createFileMarkdownStreamFromFileId} from "../../../src/streaming/file-markdown-stream";
import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {API_BASE_STAGING, Steamship} from "../../../src/client";

describe('file-markdown-stream',  () => {
    it('should return streams in sequence', async () => {
        let client = new MockClient()

        for (const fileId in FILES) {
            const file = FILES[fileId] as SteamshipFile;
            const reader = await createFileMarkdownStreamFromFileId(file.id!, client)
            const markdownArray = await streamToArray(reader, true)

            expect(markdownArray.length).toEqual(file.blocks?.length)

            for (let i = 0; i < markdownArray.length; i++) {
                const markdown = markdownArray[i];
                const fileBlock = (file.blocks || [])[i]
                expect(markdown).toBe(fileBlock.text)
            }
        }
    })
})

describe('file-markdown-stream',  () => {
    it('should return streams be able to get it', async () => {
        let client = new Steamship({
            apiKey: '05734E32-F33B-49E0-BD78-FB75F5F36B24',
            apiBase: API_BASE_STAGING
        })
        const fileId = '91FCBF70-3920-44DC-A742-7FF3146B06B5';
        const reader = (await createFileMarkdownStreamFromFileId(fileId, client)).getReader()
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