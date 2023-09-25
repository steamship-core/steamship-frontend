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

export interface Client {
    get(path: string, payload: any);
    post(path: string, payload: any);
}

export class Steamship implements Client {
    config: Configuration

    constructor(config?: Configuration) {
        this.config = config
    }

    public call(path: string, opts: any) {
        const _config = {...DEFAULT_CONFIGURATION, }

        // Transform 'file/get' into https://url/api/v1/file/get
        const _url = `${this.config.apiBase}${path}`;

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

    public get(path: string) {
        return this.call(path, {method: "GET"})
    }

    public post(path: string, payload: any) {
        return this.call(path, {
            method: "POST",
            body: JSON.stringify(payload)
        })
    }
}