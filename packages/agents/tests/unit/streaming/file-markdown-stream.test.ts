import {streamToArray, streamToString, stringToStream} from "../../../src/streaming/utils"

import {createFileMarkdownStreamFromFileId} from "../../../src/streaming/file-markdown-stream";
import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";

describe('file-markdown-stream',  () => {
    it('should return streams in sequence', async () => {
        let client = new MockClient()

        for (const fileId in FILES) {
            const file = FILES[fileId] as SteamshipFile;
            const reader = await createFileMarkdownStreamFromFileId(file.id!, client)
            const markdownArray = await streamToArray(reader, false)

            expect(markdownArray.length).toEqual(file.blocks?.length)

            for (let i = 0; i < markdownArray.length; i++) {
                const markdown = markdownArray[i];
                const fileBlock = (file.blocks || [])[i]
                expect(markdown).toBe(fileBlock.text)
            }
        }
    })

})