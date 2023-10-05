import {Steamship, SteamshipMarkdownStream} from "../../../src";
import {streamToString} from "../../../src/streaming/utils";
import {API_BASE_STAGING} from "../../../src/schema/client";

// // """
// curl -i \
//  -H "Accept: application/json" \
//  -H "Content-Type: application/json" \
//  -H "Authorization: Bearer 11637B07-25F4-4B26-99BA-C6D1EBFD3DD4" \
//  -H "x-workspace-handle: ai-adventure-game-beta-39e-0v0bko" \
//  https://api.steamship.com/api/v1/file/19AC272E-8F4D-40CE-8EA9-5A566D1ABA17/stream?timeoutSeconds=2&tagKindFilter=request-id&tagNameFilter=152A3036-140D-4327-9413-AD6DFC6E4C1D
// // """'



describe('file-block-stream',  () => {

    describe('File Block Stream', () => {
        it('should return a sequence of Block objects', async () => {

            const BASE_URL = "https://ted.steamship.run/ai-adventure-game-beta-80e-h7vmhd/ai-adventure-game-beta-80e/"

            const prompt = "hi"
            const context_id = "foo-14"

            // Create a Steamship client
            const steamship = new Steamship({apiKey: ""})

            // See https://docs.steamship.com/javascript_client for information about:
            // - The BASE_URL where your running Agent lives
            // - The context_id which mediates your Agent's server-side chat history
            const response = await steamship.agent.respondAsync({
                url: BASE_URL,
                input: {
                    prompt,
                    context_id
                },
            })

            // const response: any = {
            //     task: {requestId: "9A25A2D4-78DA-4C7C-B4E7-2A9526A5CEDA"},
            //     file: {id: "250C68B5-103E-4D82-9C72-CA3E861F8031"}
            // }

            // Adapt the Streamship Blockstream into a Markdown Stream
            const stream = await SteamshipMarkdownStream(response, steamship, {streamTimeoutSeconds: 60})

            const str = await streamToString(stream)
            console.log(str)

            // const str = await streamToString(stream)
        }, 1000 * 200)
    })

})




