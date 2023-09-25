
export type ServerSentEvent<T> = {
    id: string,
    event: string
    data: T
}

export type BlockCreatedEvent = {
    blockId: string,
    createdAt: string
}

export interface FileStreamEvent extends ServerSentEvent<BlockCreatedEvent> {
    id: string,
    event: "blockCreated",
    data: BlockCreatedEvent
}
