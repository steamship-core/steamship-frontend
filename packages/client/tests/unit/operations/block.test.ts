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
                    const raw = await steamship.block.raw({id: block.id!}, client)
                    expect(await raw.text()).toBe(block.text)
                }
            }
        })

        it('get', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                for (const block of file.blocks || []) {
                    const got = await steamship.block.get({id: block.id!}, client)
                    expect(got.id).toBe(block.id)
                }
            }
        })

    })
})