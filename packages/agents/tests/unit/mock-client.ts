import {File} from "../../src/schema/file";
import {Block} from "../../src/schema/block";
import {FileStreamEvent} from "../../src/schema/event";
import {Client} from "../../src/client";
import {stringToStream} from "../../src/streaming/utils";

const MOCK_STREAM_URL = "https://example.org"

const TEST_IMAGE_BLOCK: Block = {
    id: 'test-image-block',
    createdAt: "",
    mimeType: "image/png",
    url: MOCK_STREAM_URL,
    text: `![image](${MOCK_STREAM_URL})`
}

const TEST_AUDIO_BLOCK: Block = {
    createdAt: "",
    id: 'test-audio-block',
    mimeType: "audio/mp3",
    url: MOCK_STREAM_URL,
    text: `[audio](${MOCK_STREAM_URL})`
}

const TEST_VIDEO_BLOCK: Block = {
    createdAt: "",
    id: 'test-video-block',
    mimeType: "video/mp4",
    url: MOCK_STREAM_URL,
    text: `[video](${MOCK_STREAM_URL})`
}

const TEST_TEXT_BLOCK: Block = {
    createdAt: "",
    id: 'test-text-block',
    mimeType: "text/plain",
    url: "https://steamship.com/test/text-test.txt",
    text: `Hi`
}

export const TEST_FILE: File = {
    id: 'file-1',
    blocks: [
        TEST_IMAGE_BLOCK,
        TEST_AUDIO_BLOCK,
        TEST_TEXT_BLOCK,
        TEST_VIDEO_BLOCK
    ]
}


/**
 * Transforms a Block to a FileStreamEvent about the block
 * @param block
 */
function _blockToEvent(block: Block): FileStreamEvent {
    return <FileStreamEvent>{
        id: block.id,
        event: "blockCreated",
        data: {
            blockId: block.id,
            createdAt: block.createdAt
        }
    }
}

/**
 * List of files
 */
export const FILES: Record<string, File> = {
    [TEST_FILE.id || '']: TEST_FILE
}

let BLOCKS: Record<string, Block> = {}
for (let file in FILES) {
    for (let block of FILES[file].blocks || []) {
        BLOCKS[block.id || ''] = block
    }
}

/**
 * Transforms a File to a JSONL of BlockStreamEvents about the File.
 * @param block
 */
function _fileToEvents(file: File): string {
    let eventStrings = []
    for (const block of file.blocks || []) {
        const event = _blockToEvent(block)
        eventStrings.push(JSON.stringify(event))
    }
    return eventStrings.join("\n")
}

export class MockBody {
    body: string

    public constructor(body: string) {
        this.body = body
    }

    public json(): any {
        return JSON.parse(this.body)
    }

    public text(): any {
        return this.body
    }

    public getReader(): ReadableStreamReader<any> {
        const self = this;
        const stream = stringToStream(self.body)
        return stream.getReader()
    }
}

export class MockResponse {
    body: MockBody

    public constructor(body: string) {
        this.body = new MockBody(body)
    }

    public json(): any {
        return this.body.json()
    }

    public text(): string {
        return this.body.text()
    }

}


export class MockClient implements Client {
    private FILE_STREAM = /^\/api\/v1\/file\/(.*)\/stream$/g;
    private BLOCK_GET = /^\/api\/v1\/block\/get$/g;
    private BLOCK_STREAM = /^\/api\/v1\/block\/(.*)\/stream$/g;

    private fileStream(fileId: string) {
        const file = FILES[fileId];
        if (file) {
            return _fileToEvents(file)
        }
        throw Error(`FileId ${fileId} not found`)
    }

    private blockStream(blockd: string) {
        const block = BLOCKS[blockd];
        if (block) {
            return block.text || ''
        }
        throw Error(`BlockId ${blockd} not found`)
    }

    private blockGet(blockId: string) {
        const block = BLOCKS[blockId];
        if (block) {
            return block
        }
        throw Error(`BlockId ${blockId} not found`)
    }

    private match(regex: RegExp, path: string): string[] {
        const matches = [...(path as any).matchAll(regex)].map((m) => [m[1], m[2]]);
        return matches[0]
    }

    public get(path: string): Response {
        const url = `/api/v1/${path}`

        // file/:id/stream
        let fileIdMatch = this.match(this.FILE_STREAM, url);
        if (fileIdMatch) {
            return new MockResponse(this.fileStream(fileIdMatch[0])) as unknown as Response
        }

        // block/:id/stream
        let blockIdMatch = this.match(this.BLOCK_STREAM, url);
        if (blockIdMatch) {
            return new MockResponse(this.blockStream(blockIdMatch[0])) as unknown as Response
        }

        throw Error()
    }

    public post(path: string, payload: any): Response {
        const url = `/api/v1/${path}`

        // /block/get
        let fileIdMatch = this.match(this.BLOCK_GET, url);
        if (fileIdMatch) {
            return new MockResponse(JSON.stringify(this.blockGet(payload.id))) as unknown as Response
        }

        throw Error()
    }
}


export {
    TEST_AUDIO_BLOCK,
    TEST_VIDEO_BLOCK,
    TEST_IMAGE_BLOCK,
    TEST_TEXT_BLOCK,
}
