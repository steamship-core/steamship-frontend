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
    private streams: ReadableStreamDefaultController<T>[];
    public outputStream: ReadableStream<T>
    public controller?: ReadableStreamDefaultController<T>;
    public isClosed: boolean;

    constructor() {
        this.streams = []
        this.isClosed = false;
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
        // TODO: Implement a loop across the embedded streams.
        // CHALLENGE: Knowing "when a sub-stream is done" may be tricky. But might not. Unsure
        // ASSUMPTION: while(true) seems not wrong here.. with a break when we truly are done.

        // for (const line of lines) {
        //     const event: FileStreamEvent = JSON.parse(line)
        //     if (event.event == "STREAM_FINISHED") {
        //         controller.close()
        //     } else {
        //         controller.enqueue(event)
        //     }
        // }
    }

    /*
     * Push a new stream to the queue.
     */
    public enqueue(stream: ReadableStreamDefaultController<T>) {
        this.streams.push(stream)
    }

    /*
     * Dequeue the head from the queue
     */
    public dequeue() {
        if (this.streams.length == 0) {
            throw Error("Unable to call dequeue: the queue was empty.")
        }
        this.streams.shift(); // Index 0 is the head of the queue; .shift() removes the zeroth item.
    }

}
