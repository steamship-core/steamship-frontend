import {FILES, MockClient} from "./mock-client";
import {File as SteamshipFile} from '../../src/schema/file'
import {Block} from "../../src/schema/block";

describe('mock-client',  () => {
    describe('GET file/:id/stream', () => {
        it('should return the right sequence of FileStreamEvent objects', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;

                expect(file.id).not.toBeUndefined()

                // Test getting the file
                const resp = await client.get(`file/${file.id || ''}/stream`)
                const text = await resp.text()
                const lines = text.split('\n')
                expect(lines?.length).toBe((file?.blocks?.length || 0) * 4)
            }
        })
    })

    describe('POST block/get', () => {
        it('should return a block', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                for (const block of file.blocks || []) {
                    const resp = await client.post('block/get', {id: block.id})
                    const got = await resp.json()
                    expect(got?.block?.id).toBe(block.id)
                }
            }
        })
    })

    describe('POST block/:id/stream', () => {
        it('should return a block stream', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                for (const block of file.blocks || []) {
                    const resp = await client.get(`block/${block.id}/raw`)
                    expect(await resp.text()).toBe(block.text)
                }
            }
        })
    })

})