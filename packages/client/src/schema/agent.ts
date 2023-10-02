import {PackageInstance} from "./package";
import {Task} from "./task";
import {File} from "./file";

/**
 * Agent Instance.
 *
 * Agent Instances are instances of AI agents running in the cloud.
 *
 */
export type AgentInstance = PackageInstance;

export type StreamingResponse = {
    task: Task;
    file: File;
}