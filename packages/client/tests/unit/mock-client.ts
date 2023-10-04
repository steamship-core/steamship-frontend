import {File, PartialFile} from "../../src/schema/file";
import {Block, PartialBlock} from "../../src/schema/block";
import {FileEvent} from "../../src/schema/event";
import {Client} from "../../src";
import {stringToStream} from "../../src/streaming/utils";
import {PartialWorkspace} from "../../src/schema/workspace";
import {PartialPackageInstance} from "../../src/schema/package";
import {PartialTask} from "../../src/schema/task";
import {ClientBase} from "../../src/base"

const MOCK_API_URL = "https://mock.steamship.com/api/v1/"

const TEST_IMAGE_BLOCK: PartialBlock = {
    id: 'test-image-block',
    createdAt: "",
    mimeType: "image/png",
    url: MOCK_API_URL,
    text: `![image](${MOCK_API_URL}block/test-image-block/raw)`
}

const TEST_AUDIO_BLOCK: PartialBlock = {
    createdAt: "",
    id: 'test-audio-block',
    mimeType: "audio/mp3",
    url: MOCK_API_URL,
    text: `[audio](${MOCK_API_URL}block/test-audio-block/raw)`
}

const TEST_VIDEO_BLOCK: PartialBlock = {
    createdAt: "",
    id: 'test-video-block',
    mimeType: "video/mp4",
    url: MOCK_API_URL,
    text: `[video](${MOCK_API_URL}block/test-video-block/raw)`
}

const TEST_TEXT_BLOCK: PartialBlock = {
    createdAt: "",
    id: 'test-text-block',
    mimeType: "text/plain",
    url: "https://steamship.com/test/text-test.txt",
    text: `Hi`
}

const TEST_WORKSPACE: PartialWorkspace = {
    id: "test-workspace-id",
    handle: "test-workspace"
}

export const TEST_FILE: PartialFile = {
    id: 'file-1',
    blocks: [
        TEST_IMAGE_BLOCK,
        TEST_AUDIO_BLOCK,
        TEST_TEXT_BLOCK,
        TEST_VIDEO_BLOCK
    ]
} as PartialFile

export const TEST_TASK: PartialTask = {
    taskId: 'file-1',
    requestId: 'request-1'
} as PartialTask


export const TEST_PACKAGE_INSTANCE: PartialPackageInstance = {
    handle: "test-package-instance",
    invocationUrl: "https://example.org/"
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
    [TEST_FILE.id || '']: TEST_FILE as File
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


export class MockClient extends ClientBase {
    private FILE_STREAM = /\/api\/v1\/file\/(.*)\/stream$/g;
    private BLOCK_GET = /\/api\/v1\/block\/get$/g;
    private BLOCK_STREAM = /\/api\/v1\/block\/(.*)\/raw$/g;

    private WORKSPACE_CREATE = /\/api\/v1\/workspace\/create$/g;
    private PACKAGE_INSTANCE_CREATE = /\/api\/v1\/package\/instance\/create$/g;

    private AGENT_PROMPT = /\/prompt$/g;
    private AGENT_PROMPT_ASYNC = /\/async_prompt/g;

    private fileStream(fileId: string): ReadableStream<FileEvent> {
        const file = FILES[fileId];
        return new ReadableStream<FileEvent>({
            async start(controller): Promise<void> {
                for (let block of file.blocks || []) {
                    controller.enqueue(_blockToEvent(block))
                }
                controller.close()
            }
        })
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

    public async eventStream<T>(path: string, opts: any): Promise<ReadableStream<T>> {
        const url = this.url(path)
        let fileIdMatch = this.match(this.FILE_STREAM, url);
        if (fileIdMatch) {
            return this.fileStream(fileIdMatch[0]) as any
        }
        throw Error()
    }

    public async get(path: string): Promise<Response> {
        const url = this.url(path)

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

        // /workspace/create
        if (this.match(this.WORKSPACE_CREATE, url)) {
            return new MockResponse(JSON.stringify({
                workspace: TEST_WORKSPACE
            })) as unknown as Response
        }

        // /package/instance/create
        if (this.match(this.PACKAGE_INSTANCE_CREATE, url)) {
            return new MockResponse(JSON.stringify({
                packageInstance: TEST_PACKAGE_INSTANCE
            })) as unknown as Response
        }

        throw Error()
    }

    public async invokePackageMethod(api_base: string, path: string, opts?: any): Promise<Response> {
        const url = `${api_base}${path}`

        if (this.match(this.AGENT_PROMPT, url)) {
            return new MockResponse(
                JSON.stringify(TEST_FILE.blocks)
            ) as unknown as Response
        }

        if (this.match(this.AGENT_PROMPT_ASYNC, url)) {
            return new MockResponse(JSON.stringify({
                file: TEST_FILE,
                task: TEST_TASK
            })) as unknown as Response
        }

        return new MockResponse(opts.body) as unknown as Response
    }

    switchWorkspace({workspace, workspaceId}: { workspace?: string; workspaceId?: string }): Client {
        return this;
    }
}


export {
    TEST_AUDIO_BLOCK,
    TEST_VIDEO_BLOCK,
    TEST_IMAGE_BLOCK,
    TEST_TEXT_BLOCK,
    TEST_WORKSPACE
}
