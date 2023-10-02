import {FILES, MockClient} from "../mock-client";
import {File as SteamshipFile} from "../../../src/schema/file";
import {streamToArray} from "../../../src/streaming/utils";
import {API_BASE_STAGING, Steamship} from "../../../src/client";

import steamship from "../../../src"
import {SteamshipMarkdownStream} from "../../../src/streaming/steamship-stream";

const dumpStream = async (stream: ReadableStream<string>) => {
    let ret = ""
    let done = false;
    let reader = stream.getReader()

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (done) {
            break
        }
        ret += value
        console.log(value)
    }

    return ret
}


describe('steamship-stream',  () => {
    it('should stream', async () => {
        let client = new Steamship({apiKey:"C2AD9390-2755-40E1-8631-84AC3525DC81"})

        const response = await steamship.agent.respond_async({
            url:  "https://ted.steamship.run/ted-test-telegram-stream-15a-h9wco5/ted-test-telegram-stream-15a/",
            input: {
                prompt: "Hi there! Tell me a story!",
                context_id: "my-chat-session-id-5"
            },
        }, client)

        const stream = await SteamshipMarkdownStream(response, client)
        await dumpStream(stream)
    }, 1000 * 20)
})
