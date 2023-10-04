import {FileEventStreamToBlockStream} from "./file-event-stream-to-block-stream";
import {BlockStreamToMarkdownStream} from "./block-stream-to-markdown-stream";
import {StreamingResponse} from "../schema/agent";
import {Client} from "../client";

export type SteamshipStreamOptions = {
    streamTimeoutSeconds?: number
    tagKindFilter?: string
    tagNameFilter?: string
    minDatetime?: string
}

function _dictToURI(dict: Record<string, any>): string {
    var str = [];
    for(var p in dict){
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(dict[p]));
    }
    return str.join("&")
}

/**
 * Stream a Steamship Agent response as multi-modal Markdown.
 *
 * Steamship Agents act like LLMs, but they are stateful, remembering your conversation history.
 *
 * @example
 * const response = await steamship.agent.respond({
 *  url: "https://username.steamship.com/workspace-name/agent-name",
 *  input: {
 *    prompt: messages.join('\n'),
 *    context_id: "my-chat-session-id"
 *  },
 * })
 *
 * const stream = await SteamshipStream(response)
 * return new StreamingTextResponse(stream)
 *
 */
export async function SteamshipMarkdownStream(
    res: StreamingResponse,
    client: Client,
    opts?: SteamshipStreamOptions,
): Promise<ReadableStream> {
    try {

    // 1. Parse response from agent. This will contain information necessaty to get the stream URL
    const chatFileId = res?.file?.id;
    const requestId = res?.task?.requestId || (res?.task as any)["request_id"]

    client = client.switchWorkspace({
        workspace: undefined,
        workspaceId: res?.file?.workspaceId || (res?.file as any).workspace_id
    })

    // 2. Prepare the filter over the ChatHistory so that we only stream what we're interested in
    let filterDict: Record<string, any> = {
        timeoutSeconds: opts?.streamTimeoutSeconds || 60
    }
    if (requestId) {
        filterDict["tagKindFilter"] = 'request-id'
        filterDict["tagNameFilter"] = requestId
    }
    if (opts?.minDatetime) {
        filterDict["minDatetime"] = opts?.minDatetime
    }
    const queryArgs = _dictToURI(filterDict)
    const _url = `file/${chatFileId}/stream?${queryArgs}`

    // 2. Create a stream of markdown wrapping.
        const eventStream = await client.eventStream(_url, {});
        const blockStream = eventStream.pipeThrough(FileEventStreamToBlockStream(client))
        return blockStream.pipeThrough(BlockStreamToMarkdownStream(client))
    } catch (ex) {
        console.log(ex)
        throw ex
    }
}
