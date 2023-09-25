import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {streamToArray} from "../../../src/streaming/utils";
import {createFileBlockStreamFromFileId} from "../../../src/streaming/file-block-stream";

describe('file-block-stream',  () => {

    describe('File Block Stream', () => {
        it('should return a sequence of Block objects', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                const reader = await createFileBlockStreamFromFileId(file.id!, client)

                const blockArray = await streamToArray(reader, false)

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

})