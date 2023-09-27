/**
 * Parameters for creating an instance of an agent.
 *
 */
import {Client} from "../client";
import {AgentInstance} from "../schema";
import package_, {CreatePackageInstanceParams} from "./package";

type CreateAgentInstanceParams = CreatePackageInstanceParams

const create_instance = async (params: CreateAgentInstanceParams, client: Client): Promise<AgentInstance> => {
    return (await package_.create_instance(params, client)) as AgentInstance
}

export type { CreateAgentInstanceParams }

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    create_instance
}