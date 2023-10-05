import {Steamship, SteamshipMarkdownStream} from "../../../src";
import {streamToString} from "../../../src/streaming/utils";
import {API_BASE_STAGING} from "../../../src/schema/client";

describe('file-block-stream',  () => {

    describe('File Block Stream', () => {
        it('should return a sequence of Block objects', async () => {

            const BASE_URL = "https://foo-bar.apps.staging.steamship.com/ai-adventure-game-beta-e86-zl3tjv/ai-adventure-game-beta-e86/"

            const prompt = "hi"
            const context_id = "foo"

            // Create a Steamship client
            const steamship = new Steamship({apiKey: "05334E32-D33B-19E0-AD73-FC75F5F36B24", apiBase: API_BASE_STAGING})

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

            // Adapt the Streamship Blockstream into a Markdown Stream
            const stream = await SteamshipMarkdownStream(response, steamship, {streamTimeoutSeconds: 2})

            const str = await streamToString(stream)
            console.log(str)
        }, 1000 * 20)
    })

})




