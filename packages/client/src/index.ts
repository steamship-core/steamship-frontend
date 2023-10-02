import {
    Client,
    Steamship
} from "./client";

import {
    BlockStreamToMarkdownStream,
    FileEventStreamToBlockStream,
} from "./streaming"

import operations from "./operations"

import type {
    Block,
    ServerSentEvent,
    BlockCreatedPayload,
    FileEvent,
    File,
    Tag,
    Task,
    Workspace,
    IsUserOwned,
    IsWorkspaceContained,
    IsSteamshipModel,
    HasHandle,
    PackageInstance,
    AgentInstance,
} from './schema'

export type {
    Client
}

export {
    Steamship,
    BlockStreamToMarkdownStream,
    FileEventStreamToBlockStream,
}

export type {
    Block,
    ServerSentEvent,
    BlockCreatedPayload,
    FileEvent,
    File,
    Tag,
    Task,
    Workspace,
    IsUserOwned,
    IsWorkspaceContained,
    IsSteamshipModel,
    HasHandle,
    PackageInstance,
    AgentInstance,
}

/**
 * This permits usage like:
 *
 * steamship.agents.create(..)
 * steamship.workspace.create(..)
 *
 */
export default operations