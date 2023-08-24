const streamToString = async (stream: ReadableStream) => {
    const reader = stream.getReader();
    const textDecoder = new TextDecoder();
    let result = '';

    async function read() {
        const { done, value } = await reader.read();

        if (done) {
            return result;
        }

        // TODO: It doesn't make sense to me that `value` could be a value..
        if (typeof value == 'string') {
            result += value;
        } else {
            result += textDecoder.decode(value, { stream: true });
        }
        return read();
    }

    return read();
}

export { streamToString }