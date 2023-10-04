import {TEST_WORKSPACE, MockClient, FILES} from "../mock-client";
import steamship, {File as SteamshipFile} from "../../../src"
import {streamToArray} from "../../../src/streaming/utils";

describe('operations',  () => {
    describe('file', () => {
        it('raw', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                for (const block of file.blocks || []) {
                    const raw = await client.block.raw({id: block.id!})
                    expect(await raw.text()).toBe(block.text)
                }
            }
        })

        it('get', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                for (const block of file.blocks || []) {
                    const got = await client.block.get({id: block.id!})
                    expect(got.id).toBe(block.id)
                }
            }
        })

    })
})