/*
 * Sketch at how we might implement the SteamshipStream class.
 */

import {
    type AIStreamCallbacksAndOptions,
    createCallbacksTransformer
} from 'ai/ai-stream'
import { createStreamDataTransformer } from 'ai/stream-data'

/* ==========================================================================================
 * Core Steamship Datamodel
 *
 * The following types represent Steamship's core datamodel:
 * - A File records ChatHistory
 * - A Block is a multimedia unit of ChatHistory
 * - A Tag is an annotation atop a File or Block that carries additional metadata
 *
 * =========================================================================================*/

export type SteamshipModelObject = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type SteamshipWorkspaceContainedObject = SteamshipModelObject & {
    workspaceId?: string;
}

export type SteamshipFile = SteamshipWorkspaceContainedObject & {
    tags?: SteamshipTag[];
}

export type SteamshipTag = SteamshipWorkspaceContainedObject & {
    fileId?: string;
    blockId?: string;
    startIdx?: number;
    endIdx?: number;
    kind: string;
    name?: string;
    value?: any;
    text?: string;
}

export type SteamshipBlock = SteamshipWorkspaceContainedObject & {
    fileId?: string;
    text?: string;
    tags?: SteamshipTag[];
    contentUrl?: string;
    mimeType?: string;
    url?: string;
    index?: number;
    publicData?: boolean;
}
