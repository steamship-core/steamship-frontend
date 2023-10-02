import {TEST_WORKSPACE, MockClient, FILES, TEST_PACKAGE_INSTANCE} from "../mock-client";
import steamship, {File as SteamshipFile} from "../../../src"
import {streamToArray} from "../../../src/streaming/utils";


describe('operations',  () => {
    describe('package', () => {
        it('create_instance', async () => {
            let client = new MockClient();

            let pkg = await steamship.package.create_instance({
                package: TEST_PACKAGE_INSTANCE.handle!
            }, client)

            expect(pkg.handle).toBe(TEST_PACKAGE_INSTANCE.handle)
            expect(pkg.invocationUrl).toBe(TEST_PACKAGE_INSTANCE.invocationUrl)
        })

        it('invoke_instance', async () => {
            let client = new MockClient();

            let pkg = await steamship.package.create_instance({
                package: TEST_PACKAGE_INSTANCE.handle!
            }, client)

            const hi = {"hello": "world"}

            let resp = await steamship.package.invoke({
                base_url: pkg.invocationUrl,
                method: "echo",
                payload: hi
            }, client)

            let json = await resp.json()

            expect(json).toStrictEqual(hi)
        })

    })
})