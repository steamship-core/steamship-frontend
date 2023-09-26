import {File} from "../../src/schema/file";
import {Block} from "../../src/schema/block";
import {FileEvent} from "../../src/schema/event";
import {Client} from "../../src/client";
import {stringToStream} from "../../src/streaming/utils";

const MOCK_API_URL = "https://mock.steamship.com/api/v1/"

const TEST_IMAGE_BLOCK: Block = {
    id: 'test-image-block',
    createdAt: "",
    mimeType: "image/png",
    url: MOCK_API_URL,
    text: `![image](${MOCK_API_URL}block/test-image-block/raw)`
}

const TEST_AUDIO_BLOCK: Block = {
    createdAt: "",
    id: 'test-audio-block',
    mimeType: "audio/mp3",
    url: MOCK_API_URL,
    text: `[audio](${MOCK_API_URL}block/test-audio-block/raw)`
}

const TEST_VIDEO_BLOCK: Block = {
    createdAt: "",
    id: 'test-video-block',
    mimeType: "video/mp4",
    url: MOCK_API_URL,
    text: `[video](${MOCK_API_URL}block/test-video-block/raw)`
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
function _blockToEvent(block: Block): FileEvent {
    return <FileEvent>{
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
 * @param file
 */
function _fileToEvents(file: File): string {
    let eventStrings = []
    for (const block of file.blocks || []) {
        const event = _blockToEvent(block)
        eventStrings.push(`event: ${event.event}`)
        eventStrings.push(`id: ${event.id}`)
        eventStrings.push(`data: ${JSON.stringify({[event.event]: event.data})}`)
        eventStrings.push('')
    }
    return eventStrings.join("\n") + '\n'
}

export class MockResponse {
    _body: string
    body: ReadableStream<Uint8Array>

    public ok: boolean = true

    public constructor(body: string) {
        this._body = body;
        this.body = new Blob([body]).stream()
    }

    public json(): any {
        return JSON.parse(this._body)
    }

    public text(): any {
        return this._body
    }

}


export class MockClient implements Client {
    private FILE_STREAM = /\/api\/v1\/file\/(.*)\/stream$/g;
    private BLOCK_GET = /\/api\/v1\/block\/get$/g;
    private BLOCK_STREAM = /\/api\/v1\/block\/(.*)\/raw$/g;

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
            return {block}
        }
        throw Error(`BlockId ${blockId} not found`)
    }

    private match(regex: RegExp, path: string): string[] {
        const matches = [...(path as any).matchAll(regex)].map((m) => [m[1], m[2]]);
        return matches[0]
    }

    public url(path: string): string {
        return `${MOCK_API_URL}${path}`
    }

    public async stream(path: string, opts: any): Promise<void> {
        const url = this.url(path)

        let fileIdMatch = this.match(this.FILE_STREAM, url);
        if (fileIdMatch) {
            for (let block of FILES[fileIdMatch[0]]?.blocks || []) {
                opts.onmessage(_blockToEvent(block))
            }
        }
    }

    public async get(path: string): Promise<Response> {
        const url = this.url(path)

        // file/:id/stream
        let fileIdMatch = this.match(this.FILE_STREAM, url);
        if (fileIdMatch) {
            return new MockResponse(this.fileStream(fileIdMatch[0])) as unknown as Response
        }

        // block/:id/raw
        let blockIdMatch = this.match(this.BLOCK_STREAM, url);
        if (blockIdMatch) {
            return new MockResponse(this.blockStream(blockIdMatch[0])) as unknown as Response
        }

        throw Error()
    }

    public async post(path: string, payload: any): Promise<Response> {
        const url = this.url(path)

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
