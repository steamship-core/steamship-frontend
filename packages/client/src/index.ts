import {
    Steamship
} from "./client";

import {
    BlockStreamToMarkdownStream,
    FileEventStreamToBlockStream,
    SteamshipMarkdownStream,
    SteamshipStreamOptions,
} from "./streaming"

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
    Client
} from './schema'

export {
    Steamship,
    BlockStreamToMarkdownStream,
    FileEventStreamToBlockStream,
    SteamshipMarkdownStream,
}

export type {
    SteamshipStreamOptions,
}

export type {
    Client,
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

export default Steamship