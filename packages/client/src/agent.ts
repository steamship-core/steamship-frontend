/**
 * Parameters for creating an instance of an agent.
 *
 */
import {Client} from "./client";
import {AgentInstance} from "./schema";

type CreateAgentParams = {
    /**
     * Handle of the agent you are creating an instance of. This is a remote service deployed to Steamship.
     */
    agent: string;

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
    config?: string
}


const create_agent = async (params: CreateAgentParams, client: Client): AgentInstance => {
    if (!params.handle) {
        // We'll need to create a workspace for this agent.

    }


}

export type { CreateAgentParams }
