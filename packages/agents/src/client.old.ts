import {createParser} from "eventsource-parser";

export const API_BASE_PRODUCTION = "https://api.steamship.com/api/v1/"
export const API_BASE_STAGING = "https://api.staging.steamship.com/api/v1/"
export const API_BASE_DEVELOPMENT = "http://localhost:8080/api/v1/"

export const APP_BASE_PRODUCTION = "https://api.steamship.run/"
export const APP_BASE_STAGING = "https://apps.staging.steamship.com/"
export const APP_BASE_DEVELOPMENT = "http://localhost:8081/"

import {fetchEventSource} from '@microsoft/fetch-event-source';
import { CustomEventDataType, CustomEventType, SSE, SSEOptions, SSEOptionsMethod } from "./sse";
import EventSource from "./eventsource"

/* Shim for fetchEventSource
* https://github.com/Azure/fetch-event-source/issues/39
*/
if (!globalThis.window) {
    globalThis.window = {
        fetch: globalThis.fetch,
        setTimeout: (fn: any, timeout: any) => globalThis.setTimeout(fn, timeout),
        clearTimeout: (t: any) => globalThis.clearTimeout(t),
    } as unknown as (Window & typeof globalThis);
}
if (!globalThis.document) {
    globalThis.document = { removeEventListener: () => {} } as unknown as Document;
}


export type Configuration = {
    apiBase?: string,
    appBase?: string,
    apiKey?: string
}

export const DEFAULT_CONFIGURATION = {
    apiBase: API_BASE_PRODUCTION,
    appBase: API_BASE_PRODUCTION,
}

/**
 * Interface for a Steamship client.
 */
export interface Client {
    url(path: string): string;
    get(path: string): Promise<Response>;
    post(path: string, payload: any): Promise<Response>
    stream(path: string, opts: any): Promise<ReadableStream>
}

/**
 * Steamship API client.
 *
 * Intended for use consuming Steamship's API.
 */
export class Steamship implements Client {
    config: Configuration

    /**
     * Create a new Steamship API client.
     *
     * @param config
     */
    constructor(config: Configuration) {
        this.config = {...DEFAULT_CONFIGURATION, ...config}
    }

    public url(path: string): string {
        return `${this.config.apiBase}${path}`
    }

    /**
     * Invoke an API method on Steamship.
     *
     * @param path API Path rooted in apiBase provided in the configuration object.
     * @param opts Javascript `fetch` options. API Key and Content-Type are auto-applied.
     */
    public async call(path: string, opts: any): Promise<Response> {
        // Transform 'file/get' into https://url/api/v1/file/get
        const _url = this.url(path)

        // Make sure the headers are applied correctly
        let _headers: Record<string, string> = {}
        if (this.config.apiKey) {
            _headers["Authorization"] = `Bearer ${this.config.apiKey}`
        }
        _headers = {
            ..._headers,
            // 'Content-Type': 'application/json',
            ...opts['headers']
        }
        opts['headers'] = _headers

        // Return a fetch against the server
        const resp = await fetch(_url, opts)
        return resp
    }

    /**
     * Perform a `get` against the Steamship API.
     * @param path API Path rooted in apiBase provided in the configuration object.
     */
    public async get(path: string): Promise<Response> {
        return this.call(path, {method: "GET"})
    }

    /**
     * Perform a 'post' against the Steamship API
     * @param path API Path rooted in apiBase provided in the configuration object.
     * @param payload Payload, as a JSON object, to be provided as JSON to Steamship.
     */
    public async post(path: string, payload: any): Promise<Response> {
        return this.call(path, {
            method: "POST",
            body: JSON.stringify(payload)
        })
    }

    // /**
    //  * Wraps Microsoft's fetchEventSource implementation with auth.
    //  * @param path
    //  * @param opts
    //  */
    // public async stream(path: string, opts: any): Promise<any> {
    //     // Transform 'file/get' into https://url/api/v1/file/get
    //     const _url = this.url(path)
    //
    //     let _headers: Record<string, string> = {}
    //     if (this.config.apiKey) {
    //         _headers["Authorization"] = `Bearer ${this.config.apiKey}`
    //     }
    //     _headers = {
    //         ..._headers,
    //         ...opts['headers'],
    //         openWhenHidden: true // Fixes document error.
    //     }
    //     opts['headers'] = _headers
    //
    //     const sseOptions: SSEOptions = {
    //         headers: _headers,
    //         method: SSEOptionsMethod.GET,
    //     };
    //
    //     const source = new SSE(_url, sseOptions);
    //
    //     source.addEventListener('message', (event: any) => {
    //         opts.onmessage(event)
    //     })
    //     source.addEventListener('status', (event: any) => {
    //         console.log(event)
    //     })
    //
    //     source.stream()
    //     return source
    // }

    // /**
    //  * Wraps Microsoft's fetchEventSource implementation with auth.
    //  * @param path
    //  * @param opts
    //  */
    // public async stream(path: string, opts: any): Promise<void> {
    //     // Transform 'file/get' into https://url/api/v1/file/get
    //     const _url = this.url(path)
    //
    //     let _headers: Record<string, string> = {}
    //     if (this.config.apiKey) {
    //         _headers["Authorization"] = `Bearer ${this.config.apiKey}`
    //     }
    //     _headers = {
    //         ..._headers,
    //         ...opts['headers'],
    //         openWhenHidden: true // Fixes document error.
    //     }
    //     opts['headers'] = _headers
    //
    //     // const es = new EventSource(url, eventSourceInitDict);
    //
    //     return await fetchEventSource(_url, opts)
    // }


    // /**
    //  * Wraps Microsoft's fetchEventSource implementation with auth.
    //  * @param path
    //  * @param opts
    //  */
    // public async stream(path: string, opts: any): Promise<void> {
    //     // Transform 'file/get' into https://url/api/v1/file/get
    //     const _url = this.url(path)
    //
    //     let _headers: Record<string, string> = {}
    //     if (this.config.apiKey) {
    //         _headers["Authorization"] = `Bearer ${this.config.apiKey}`
    //     }
    //     _headers = {
    //         ..._headers,
    //         ...opts['headers'],
    //         openWhenHidden: true // Fixes document error.
    //     }
    //     opts['headers'] = _headers
    //
    //     const es = new EventSource(_url, opts);
    //     return es
    // }


    public async stream(path: string, opts: any): Promise<ReadableStream> {
        const _url = this.url(path)

        let _headers: Record<string, string> = {}
        if (this.config.apiKey) {
            _headers["Authorization"] = `Bearer ${this.config.apiKey}`
        }
        _headers = {
            ..._headers,
            ...opts['headers'],
        }
        opts['headers'] = _headers

        const res = await this.get(_url)

        const encoder = new TextEncoder()
        const decoder = new TextDecoder()

        let counter = 0

        const stream = new ReadableStream({
            async start(controller): Promise<void> {
                function onParse(event: any): void {

                    if (event.type === 'event') {
                        const data = event.data
                        if (data === '[DONE]') {
                            controller.close()
                            return
                        }
                        try {
                            const json = JSON.parse(data)
                            const text =
                                json.choices[0]?.delta?.content ?? json.choices[0]?.text ?? ''

                            if (counter < 2 && (text.match(/\n/) || []).length) {
                                return
                            }

                            const queue = encoder.encode(`${JSON.stringify(text)}\n`)
                            controller.enqueue(queue)

                            counter++
                        } catch (e) {
                            controller.error(e)
                        }
                    }
                }

                const parser = createParser(onParse)
                // [Asynchronously iterate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) the response's body
                for await (const chunk of res.body as any) {
                    parser.feed(decoder.decode(chunk))
                }
            }
        })

        return stream
    }

    // /**
    //  * eventsource
    //  * @param path
    //  * @param opts
    //  */
    // public async stream(path: string, opts: any): Promise<any> {
    //     // Transform 'file/get' into https://url/api/v1/file/get
    //     const _url = this.url(path)
    //
    //     let _headers: Record<string, string> = {}
    //     if (this.config.apiKey) {
    //         _headers["Authorization"] = `Bearer ${this.config.apiKey}`
    //     }
    //     _headers = {
    //         ..._headers,
    //         ...opts['headers'],
    //         openWhenHidden: true // Fixes document error.
    //     }
    //     opts['headers'] = _headers
    //
    //     try {
    //         // @ts-ignore
    //         const e = new EventSource(_url, opts);
    //         // @ts-ignore
    //         e.addEventListener('blockCreated', (e) => {
    //             console.log(e)
    //         })
    //         return e
    //         // @ts-ignore
    //     } catch (e: any) {
    //         // @ts-ignore
    //         console.log(e)
    //         throw e
    //     }
    //
    // }

}

