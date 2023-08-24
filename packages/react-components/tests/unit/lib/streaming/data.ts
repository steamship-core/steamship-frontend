import {SteamshipBlock} from "../../../../src/lib/streaming/datamodel";

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

export {
    TEST_AUDIO_BLOCK,
    TEST_VIDEO_BLOCK,
    TEST_IMAGE_BLOCK,
    TEST_TEXT_BLOCK
}