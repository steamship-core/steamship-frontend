import {TEST_WORKSPACE, MockClient, FILES} from "../mock-client";
import steamship, {File as SteamshipFile} from "../../../src"
import {streamToArray} from "../../../src/streaming/utils";

describe('operations',  () => {
    describe('block', () => {
        it('stream', async () => {
            let client = new MockClient()
            for (const fileId in FILES) {
                const file = FILES[fileId] as SteamshipFile;

                expect(file.id).not.toBeUndefined()

                // Test getting the file
                const stream = await client.file.stream({id: file.id!})
                const events = await streamToArray(stream, false)
                expect(events?.length).toBe(file?.blocks!.length)
            }
        })
    })
})