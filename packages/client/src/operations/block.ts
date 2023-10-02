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
    try {
        let response = await client.post(`block/get`, {id: params.id});
        let json = await response.json()
        const block = (json?.block || json?.data?.block) as Block;
        if (!block) {
            const delay = (ms:number) => new Promise(res => setTimeout(res, ms));
            await delay(5000);
            let response = await client.post(`block/get`, {id: params.id});
            let json = await response.json()
            return (json?.block || json?.data?.block) as Block;
        }
        return block
    } catch (ex) {
        // Wait for 2s
        const delay = (ms:number) => new Promise(res => setTimeout(res, ms));
        await delay(5000);
        let response = await client.post(`block/get`, {id: params.id});
        let json = await response.json()
        return (json?.block || json?.data?.block) as Block;


        // console.log(ex)
        // throw ex
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    raw,
    get
}