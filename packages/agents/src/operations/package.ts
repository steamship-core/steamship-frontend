/**
 * Parameters for creating an instance of an agent.
 *
 */
import {Client} from "../client";
import {PackageInstance} from "../schema";
import workspace from "./workspace"

type CreatePackageInstanceParams = {
     /**
     * Handle of the agent you are creating an instance of. This is a remote service deployed to Steamship.
     */
    package: string;

    /**
     * Optional Version of the agent you are creating.
     */
    version?: string

    /**
     * Optional handle identifying this particular agent instance. This uniquely identifies the data and chat history
     * that will be maintained by the instance.
     */
    handle?: string

    /**
     * Optional configuration to pass to the agent upon construction.
     */
    config?: Record<string, any>

    /**
     * Fetch if exists
     */
    fetchIfExists?: boolean
}


const create_instance = async (params: CreatePackageInstanceParams, client: Client): Promise<PackageInstance> => {
    if (!params.handle) {
        // We'll need to create a workspace for this agent so we can make sure to get/fetch the Agent in its own
        // workspace.
        const workspace_ = await workspace.create({}, client)
        params.handle = workspace_.handle;
    }

    const {version, handle, fetchIfExists=true, config} = params
    const response = await client.post('package/instance/create', {
        packageHandle: params.package,
        packageVersionHandle: version,
        handle: handle,
        fetchIfExists: fetchIfExists,
        config: config
    })
    const json = await response.json()
    return json?.workspace as PackageInstance
}

export type { CreatePackageInstanceParams }

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    create_instance
}