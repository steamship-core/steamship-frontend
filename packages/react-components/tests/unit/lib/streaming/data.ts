import {SteamshipBlock} from "../../../../src/lib/streaming/datamodel";
import {FileStreamEvent} from "../../../../src/lib/streaming/file-stream";

const MOCK_STREAM_URL = "https://example.org"

const TEST_IMAGE_BLOCK: SteamshipBlock = {
    mimeType: "image/png",
    url: MOCK_STREAM_URL,
    text: `![image](${MOCK_STREAM_URL})`
}

const TEST_AUDIO_BLOCK: SteamshipBlock = {
    mimeType: "audio/mp3",
    url: MOCK_STREAM_URL,
    text: `[audio](${MOCK_STREAM_URL})`
}

const TEST_VIDEO_BLOCK: SteamshipBlock = {
    mimeType: "video/mp4",
    url: MOCK_STREAM_URL,
    text: `[video](${MOCK_STREAM_URL})`
}

const TEST_TEXT_BLOCK: SteamshipBlock = {
    mimeType: "text/plain",
    url: "https://steamship.com/test/text-test.txt",
    text: `Hi`
}

const TEST_TEXT_FILE_EVENT_1: FileStreamEvent = {
    id: "1",
    event: "BLOCK_APPENDED",
    data: TEST_TEXT_BLOCK
}


const TEST_FILE_STREAM: FileStreamEvent[] = [
    TEST_TEXT_FILE_EVENT_1
]

const fileStreamEventsToJsonLines = (events: FileStreamEvent[]): string => {
    return events.map((event) => {
        return JSON.stringify(event)
    }).join("\n")
}

export {
    TEST_AUDIO_BLOCK,
    TEST_VIDEO_BLOCK,
    TEST_IMAGE_BLOCK,
    TEST_TEXT_BLOCK,
    TEST_FILE_STREAM,
    fileStreamEventsToJsonLines
}