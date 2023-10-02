import {createParser} from "eventsource-parser";

export const API_BASE_PRODUCTION = "https://api.steamship.com/api/v1/"
export const API_BASE_STAGING = "https://api.staging.steamship.com/api/v1/"
export const API_BASE_DEVELOPMENT = "http://localhost:8080/api/v1/"

export const APP_BASE_PRODUCTION = "https://api.steamship.run/"
export const APP_BASE_STAGING = "https://apps.staging.steamship.com/"
export const APP_BASE_DEVELOPMENT = "http://localhost:8081/"

export type Configuration = {
    apiBase?: string,
    appBase?: string,
    apiKey?: string,
    workspace?: string
    workspaceId?: string
}

export const DEFAULT_CONFIGURATION = {
    apiBase: API_BASE_PRODUCTION,
    appBase: API_BASE_PRODUCTION,
}

export type RequestOptions = {
    workspace?: string
    workspaceId?: string
    verb?: "GET" | "POST"
    body?: any
    baseUrl?: string
}

/**
 * Interface for a Steamship client.
 */
export interface Client {
    url(path: string): string;
    get(path: string, options?: RequestOptions): Promise<Response>;
    post(path: string, payload: any, options?: RequestOptions): Promise<Response>
    invokePackageMethod(url_base: string, path: string, payload: any, options?: RequestOptions): Promise<Response>
    eventStream<T>(path: string, options?: RequestOptions): Promise<ReadableStream<T>>
    switchWorkspace({workspace, workspaceId}: {workspace?: string, workspaceId?: string}): Client;
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

    private workspaceHandleFromBaseUrl(baseUrl: string): string {
        try {
            const urlParts = baseUrl.split('//')
            const domainAndPath = urlParts[1]
            const pathParts = domainAndPath.split("/")
            const workspace = pathParts[1]
            return workspace
        } catch (ex) {
            throw Error(`Error trying to parse workspace handle out of base url: ${baseUrl}`)
        }
    }

    private makeHeaders(props: {
        json: boolean,
        existing?: Record<string, string>
        workspace?: string,
        workspaceId?: string,
        baseUrl?: string,
    }) {
        let _headers: Record<string, string> = {}
        if (this.config.apiKey) {
            _headers["Authorization"] = `Bearer ${this.config.apiKey}`
        }
        if (props.json) {
            _headers["Content-Type"] = `application/json`
        }
        if (props.workspace) {
            _headers['x-workspace-handle'] = props.workspace
        } else if (props.workspaceId) {
            _headers['x-workspace-id'] = props.workspaceId
        }
        return {
            ..._headers,
            ...props.existing
        }
    }

    /**
     * Return the fully-specified URL for an API path.
     *
     * @param path
     */
    public url(path: string): string {
        return `${this.config.apiBase}${path}`
    }

    /**
     * Invoke an API method on a Steamship package.
     *
     * @param apiBase
     * @param path API Path rooted in apiBase provided in the configuration object.
     * @param opts Javascript `fetch` options. API Key and Content-Type are auto-applied.
     */
    public async invokePackageMethod(apiBase: string, path: string, opts?: any): Promise<Response> {
        // Parse the workspace out of the api_base.
        const workspace = this.workspaceHandleFromBaseUrl(apiBase)
        if (! opts.workspace) {
            opts.workspace = workspace
        }

        const _url = `${apiBase}${path}`
        opts['headers'] = this.makeHeaders({
            json: true,
            existing: opts.headers,
            workspace: opts.workspace || this.config.workspace,
            workspaceId: opts.workspaceId || this.config.workspaceId,
            baseUrl: opts.baseUrl
        })
        try {
            return await fetch(
                _url,
                opts
            )
        } catch (ex) {
            console.log(ex)
            throw ex
        }
    }

    /**
     * Invoke an API method on Steamship.
     *
     * @param path API Path rooted in apiBase provided in the configuration object.
     * @param opts Javascript `fetch` options. API Key and Content-Type are auto-applied.
     */
    public async invokeApi(path: string, opts: any): Promise<Response> {
        // Transform 'file/get' into https://url/api/v1/file/get
        const _url = this.url(path)

        opts['headers'] = this.makeHeaders({
            json: true,
            existing: opts.headers,
            workspace: opts.workspace || this.config.workspace,
            workspaceId: opts.workspaceId || this.config.workspaceId,
            baseUrl: opts.baseUrl
        })

        const resp = await fetch(_url, opts)
        return resp;
    }

    /**
     * Perform a `get` against the Steamship API.
     * @param path API Path rooted in apiBase provided in the configuration object.
     */
    public async get(path: string): Promise<Response> {
        return this.invokeApi(path, {method: "GET"})
    }

    /**
     * Perform a 'post' against the Steamship API
     * @param path API Path rooted in apiBase provided in the configuration object.
     * @param payload Payload, as a JSON object, to be provided as JSON to Steamship.
     */
    public async post(path: string, payload: any): Promise<Response> {
        return this.invokeApi(path, {
            method: "POST",
            body: JSON.stringify(payload)
        })
    }

    public switchWorkspace({workspace, workspaceId}: {workspace?: string, workspaceId?: string}): Client {
        let newConfig = {...this.config}
        delete newConfig.workspace;
        delete newConfig.workspaceId
        newConfig.workspace = workspace
        newConfig.workspaceId = workspaceId
        return new Steamship(newConfig)
    }

    public async eventStream<T>(path: string, opts: any): Promise<ReadableStream<T>> {
        const res = await this.invokeApi(path, opts)
        const decoder = new TextDecoder()

        return new ReadableStream({
            async start(controller): Promise<void> {
                function onParse(event: any): void {
                    if (event.type === 'event') {
                        const data = event.data
                        try {
                            let json = JSON.parse(data)
                            // The engine nests things. We don't want that.
                            if (json[event.event]) {
                                json = json[event.event]
                            }
                            event.data = json as T;
                            controller.enqueue(event)
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
    }

}

