import {TEST_WORKSPACE, MockClient, FILES, TEST_PACKAGE_INSTANCE, TEST_FILE, TEST_TASK} from "../mock-client";
import steamship, {File as SteamshipFile} from "../../../src"
import {streamToArray} from "../../../src/streaming/utils";


describe('operations',  () => {
    describe('agent', () => {
        it('respond', async () => {
            let client = new MockClient();

            let pkg = await steamship.package.create_instance({
                package: TEST_PACKAGE_INSTANCE.handle!
            }, client)

            let url = pkg.invocationUrl
            let input = {url, input: {
                prompt: "Hi",
                context_id: "context_id"
            }}

            let blocks = await steamship.agent.respond(input, client)

            expect(blocks).toEqual(TEST_FILE.blocks)
        })

        it('respond_async', async () => {
            let client = new MockClient();

            let pkg = await steamship.package.create_instance({
                package: TEST_PACKAGE_INSTANCE.handle!
            }, client)

            let url = pkg.invocationUrl
            let input = {url, input: {
                    prompt: "Hi",
                    context_id: "context_id"
                }}

            let {file, task} = await steamship.agent.respond_async(input, client)

            expect(file).not.toBeUndefined()
            expect(task).not.toBeUndefined()

            expect(task.requestId).not.toBeUndefined()
            expect(file.id).not.toBeUndefined()

            expect(task).toEqual(TEST_TASK)
            expect(file).toEqual(TEST_FILE)
        })
    })
})