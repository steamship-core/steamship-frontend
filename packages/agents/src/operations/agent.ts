/**
 * Parameters for creating an instance of an agent.
 *
 */
import {Client} from "../client";
import {Block} from "../schema";
import {StreamingResponse} from "../schema/agent";
import package_ from "./package"

type AgentRespondParams = {
    /**
     * The base URL of the running agent instance.
     */
    url: string

    /**
     * Input for the agent.
     */
    input: {
        /**
         * The new user message to respond to.
         */
        prompt: string

        /**
         * The ID of the conversation context for conversation history retrieval.
         */
        context_id: string
    }
}

/**
 * Respond to the provided input asynchronously, returning a Task representing completion and a File object
 * in which the response will be asynchronously streamed.
 *
 * @param params
 * @param client
 */
const respond_async = async (params: AgentRespondParams, client: Client): Promise<StreamingResponse> => {
    const resp = await package_.invoke({
        base_url: params.url,
        method: "async_prompt",
        payload: params.input,
        verb: "POST"
    }, client)
    const json = await resp.json()
    return json as StreamingResponse;
}


/**
 * Respond to the provided input synchronously, returning a list of Block objects.
 *
 * @param params
 * @param client
 */
const respond = async (params: AgentRespondParams, client: Client): Promise<Block[]> => {
    const resp = await package_.invoke({
        base_url: params.url,
        method: "prompt",
        payload: params.input,
        verb: "POST"
    }, client)
    const json = await resp.json()
    return json as Block[];
}

export type { AgentRespondParams }


// eslint-disable-next-line import/no-anonymous-default-export
export default {
    respond,
    respond_async
}