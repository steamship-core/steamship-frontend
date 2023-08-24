const streamToArray = async (stream: ReadableStream, decodeAsText: boolean = true) => {
    const reader = stream.getReader();
    const textDecoder = new TextDecoder();
    let result: any[] = [];

    async function read() {
        const { done, value } = await reader.read();

        if (done) {
            return result;
        }

        // TODO: It doesn't make sense to me that `value` could be a value..
        if (typeof value == 'string') {
            result.push(value);
        } else {
            if (decodeAsText) {
                result.push(textDecoder.decode(value, { stream: true }))
            } else {
                result.push(value)
            }
        }
        return read();
    }

    return read();
}

const streamToString = async (stream: ReadableStream) => {
    const arr = await streamToArray(stream)
    return arr.join('');
}

/*
 * Converts a string into a Readable Stream.
 */
const stringToStream = (s: string): ReadableStream => {
    return new ReadableStream({
        start(controller){
            controller.enqueue(s);
            controller.close();
        }
    });
}

export { streamToString, streamToArray, stringToStream }