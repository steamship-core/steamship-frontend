import {TEST_WORKSPACE, MockClient} from "../mock-client";
import steamship from "../../../src"

describe('operations',  () => {
    describe('workspace', () => {
        it('create', async () => {
            let client = new MockClient()
            const workspace = await steamship.workspace.create({}, client)
            expect(workspace.id).toEqual(TEST_WORKSPACE.id)
            expect(workspace.handle).toEqual(TEST_WORKSPACE.handle)
        })
    })
})