import {TEST_WORKSPACE, MockClient, FILES, TEST_PACKAGE_INSTANCE} from "../mock-client";
import steamship, {File as SteamshipFile} from "../../../src"
import {streamToArray} from "../../../src/streaming/utils";


describe('operations',  () => {
    describe('package', () => {
        it('create_instance', async () => {
            let client = new MockClient();

            let pkg = await client.package.createInstance({
                package: TEST_PACKAGE_INSTANCE.handle!
            })

            expect(pkg.handle).toBe(TEST_PACKAGE_INSTANCE.handle)
            expect(pkg.invocationUrl).toBe(TEST_PACKAGE_INSTANCE.invocationUrl)
        })

        it('invoke_instance', async () => {
            let client = new MockClient();

            let pkg = await client.package.createInstance({
                package: TEST_PACKAGE_INSTANCE.handle!
            })

            const hi = {"hello": "world"}

            let resp = await client.package.invoke({
                base_url: pkg.invocationUrl,
                method: "echo",
                payload: hi
            })

            let json = await resp.json()

            expect(json).toStrictEqual(hi)
        })

    })
})