import {Client} from "../client";
import {Workspace} from "../schema";

/**
 * Creates a new Workspace.
 *
 * @param params
 * @param client
 */
const create = async (params: {
    handle?: string
    fetch_if_exists?: boolean
}, client: Client): Promise<Workspace> => {
    const {handle, fetch_if_exists=true} = params
    const response = await client.post('workspace/create', {handle, fetch_if_exists})
    const json = await response.json()
    return json?.workspace as Workspace
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    create
}