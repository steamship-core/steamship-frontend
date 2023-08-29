/* ==========================================================================================
 * StreamQueue
 *
 * A StreamQueue wraps a queue of Streams, popping the head whenever it is complete and moving
 * on to the next. This enables us to form what appears to be a single stream which is actually
 * stitched together from multiple streams.
 *
 * Since Steamship's native data model permits a single completion to emit multiple blocks in
 * response, and each block may be -- itself -- streamed, the StreamQueue is what enables us
 * to coalesce them into a single stream.
 *
 * TODO: The termination condition for this may need to be more than just "the queue is empty"
 *       if we find ourselves needing to wait for some server-side <ENDED> signal.
 *
 * =========================================================================================*/

class StreamQueue<T> {
    private streams: ReadableStream<T>[];
    public outputStream?: ReadableStream<T>
    public controller?: ReadableStreamDefaultController<T>;
    public isClosed: boolean;
    public streamAddingClosed: boolean;

    constructor() {
        this.streams = []
        this.isClosed = false;
        this.streamAddingClosed = false;
    }

    /*
     * Begin streaming. Returns a ReadableStream that covers the full queue of sub streams.
     */
    public start(): ReadableStream<T> {
        const self = this;
        this.outputStream = new ReadableStream<T>({
            async start(controller): Promise<void> {
                self.controller = controller;
                await self.consumeLoop();
            }
        })
        return this.outputStream;
    }

    /*
     * Halt Streaming.
     */
    public close() {
        if (! this.controller) {
            throw Error("Unable to call close: no ReadableStreamDefaultController exists.")
        }
        if (this.isClosed) {
            throw Error("Unable to call close: no ReadableStreamDefaultController is closed.")
        }
        this.controller.close();
        this.isClosed = true;
    }

    /*
     * Emit a chunk onto the output stream.
     */
    private emit(chunk: T) {
        if (! this.controller) {
            throw Error("Unable to call emit: no ReadableStreamDefaultController exists.")
        }
        if (this.isClosed) {
            throw Error("Unable to call emit: no ReadableStreamDefaultController is closed.")
        }
        this.controller.enqueue(chunk)
    }

    /*
     * The spin-loop that consumes the queue of streams and emits.
     */
    private async consumeLoop() {
        // TODO: Is the spin loop OK here?
        while(! this.shouldFinish()) {
            await this.processNextStream()
        }
        this.controller?.close()
    }

    public length(): number {
        return this.streams?.length || 0
    }

    /*
     * Consume the next available stream, emitting it to the output stream.
     */
    private async processNextStream() {
        if (this.streams.length == 0) {
            // No next stream to process.
            return
        }

        const nextStream = this.dequeue();

        const self = this;
        const reader = nextStream.getReader();
        const read = async (): Promise<void> => {
            const { done, value } = await reader.read();
            if (done) {
                // We're finished
                return;
            } else if (value) {
                self.emit(value)
            }
            return read();
        }
        await read();
    }

    /*
     * Push a new stream to the queue.
     */
    public enqueue(stream: ReadableStream<T>) {
        this.streams.push(stream)
    }

    /*
     * Dequeue the head from the queue
     */
    public dequeue(): ReadableStream<T> {
        if (this.streams.length == 0) {
            throw Error("Unable to call dequeue: the queue was empty.")
        }
        const head = this.streams[0]
        this.streams.shift(); // Index 0 is the head of the queue; .shift() removes the zeroth item.
        return head;
    }

    public shouldFinish(): boolean {
        if (this.streamAddingClosed) {
            return this.streams.length == 0
        } else {
            // We might be adding more streams!
            return false;
        }
    }
}


export {StreamQueue}