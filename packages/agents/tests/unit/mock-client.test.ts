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
                const resp = client.get(`file/${file.id || ''}/stream`)
                const jsonl = await resp.text()
                const jsons = jsonl.split('\n')

                expect(jsons.length).toBe(file.blocks?.length)

                let blockId = 0
                expect(jsons.length).toBe(file.blocks?.length)

                for (const json of jsons) {
                    const event = JSON.parse(json)
                    expect(event.id).not.toBeUndefined()
                    expect(event.event).toBe('blockCreated')
                    expect(event.data).not.toBeUndefined()

                    const data = event.data
                    const block = (file.blocks || [])[blockId]
                    expect(data.blockId).toBe(block.id)
                    expect(data.createdAt).toBe(block.createdAt)
                    blockId += 1
                }
            }
        })
    })

    describe('POST block/get', () => {
        it('should return a block', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;
                for (const block of file.blocks || []) {
                    const resp = client.post('block/get', {id: block.id})
                    const got = resp.json() as Block
                    expect(block.id).toBe(got.id)
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
                    const resp = client.get(`block/${block.id}/stream`)
                    expect(resp.body).toBe(block.text)
                }
            }
        })
    })

})