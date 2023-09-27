import {Client} from "../client";
import {Block} from "../schema";

/**
 * Fetch the raw content of the block.
 *
 * @param params
 * @param client
 */
const raw = async (params: {
    id: string
}, client: Client): Promise<Response> => {
    return await client.get(`block/${params.id}/raw`, {});
}

/**
 * Fetch the raw content of the block.
 *
 * @param params
 * @param client
 */
const get = async (params: {
    id: string
}, client: Client): Promise<Block> => {
    let response = await client.post(`block/get`, {id: params.id});
    let json = await response.json()
    return (json?.block || json?.data?.block) as Block;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    raw,
    get
}