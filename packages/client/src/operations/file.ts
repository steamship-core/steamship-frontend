import {Client} from "../client";
import {AgentInstance, Block, FileEvent} from "../schema";
import {CreateAgentParams} from "../agent";

/**
 * Creates a new Workspace.
 *
 * @param params
 * @param client
 */
const stream = async (params: {
    id: string
}, client: Client): Promise<ReadableStream<FileEvent>> => {
    return await client.eventStream(`file/${params.id}/stream`, {});
}

/**
 * Fetch the raw content of the file.
 *
 * @param params
 * @param client
 */
const raw = async (params: {
    id: string
}, client: Client): Promise<Response> => {
    return await client.get(`file/${params.id}/raw`, {});
}

/**
 * Fetch a Steamship File.
 *
 * @param params
 * @param client
 */
const get = async (params: {
    id: string
}, client: Client): Promise<File> => {
    let response = await client.post(`file/get`, {id: params.id});
    let json = await response.json()
    return (json?.file || json?.data?.file) as File;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    stream,
    raw,
    get
}