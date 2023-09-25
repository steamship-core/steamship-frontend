export const API_BASE_PRODUCTION = "https://api.steamship.com/api/v1/"
export const API_BASE_STAGING = "https://api.staging.steamship.com/api/v1/"
export const API_BASE_DEVELOPMENT = "http://localhost:8080/api/v1/"

export const APP_BASE_PRODUCTION = "https://api.steamship.run/"
export const APP_BASE_STAGING = "https://apps.staging.steamship.com/"
export const APP_BASE_DEVELOPMENT = "http://localhost:8081/"

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
    constructor(config?: Configuration) {
        this.config = config
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
        const _config = {...DEFAULT_CONFIGURATION, }

        // Transform 'file/get' into https://url/api/v1/file/get
        const _url = this.url(path)

        // Make sure the headers are applied correctly
        let _headers = {}
        if (this.config.apiKey) {
            _headers["Authorization"] = `Bearer: ${this.config.apiKey}`
        }
        _headers = {
            ..._headers,
            'Content-Type': 'application/json',
            ...opts['headers']
        }
        opts['headers'] = _headers

        // Return a fetch against the server
        return fetch(_url, opts)
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
}