import { createParser } from "eventsource-parser";
import { ClientBase } from "./base";
import { Client } from "./schema";
import { Configuration, DEFAULT_CONFIGURATION } from "./schema/client";
import { isStreamTerminatingBlock } from "./streaming/utils";

/**
 * Steamship API client.
 *
 * Intended for use consuming Steamship's API.
 */
export class Steamship extends ClientBase implements Client {
  config: Configuration;

  /**
   * Create a new Steamship API client.
   *
   * @param config
   */
  constructor(config: Configuration) {
    super();
    this.config = { ...DEFAULT_CONFIGURATION, ...config };
  }

  private workspaceHandleFromBaseUrl(baseUrl: string): string {
    try {
      const urlParts = baseUrl.split("//");
      const domainAndPath = urlParts[1];
      const pathParts = domainAndPath.split("/");
      const workspace = pathParts[1];
      return workspace;
    } catch (ex) {
      throw Error(
        `Error trying to parse workspace handle out of base url: ${baseUrl}`
      );
    }
  }

  private makeHeaders(props: {
    json: boolean;
    existing?: Record<string, string>;
    workspace?: string;
    workspaceId?: string;
    baseUrl?: string;
  }) {
    let _headers: Record<string, string> = {};
    if (this.config.apiKey) {
      _headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }
    if (props.json) {
      _headers["Content-Type"] = `application/json`;
    }
    if (props.workspace) {
      _headers["x-workspace-handle"] = props.workspace;
    } else if (props.workspaceId) {
      _headers["x-workspace-id"] = props.workspaceId;
    }
    return {
      ..._headers,
      ...props.existing,
    };
  }

  /**
   * Return the fully-specified URL for an API path.
   *
   * @param path
   */
  public url(path: string): string {
    return `${this.config.apiBase}${path}`;
  }

  /**
   * Invoke an API method on a Steamship package.
   *
   * @param apiBase
   * @param path API Path rooted in apiBase provided in the configuration object.
   * @param opts Javascript `fetch` options. API Key and Content-Type are auto-applied.
   */
  public async invokePackageMethod(
    apiBase: string,
    path: string,
    opts?: any
  ): Promise<Response> {
    // Parse the workspace out of the api_base.
    const workspace = this.workspaceHandleFromBaseUrl(apiBase);
    if (!opts.workspace) {
      opts.workspace = workspace;
    }

    const _url = `${apiBase}${path}`;
    opts["headers"] = this.makeHeaders({
      json: true,
      existing: opts.headers,
      workspace: opts.workspace || this.config.workspace,
      workspaceId: opts.workspaceId || this.config.workspaceId,
      baseUrl: opts.baseUrl,
    });
    try {
      return await fetch(_url, opts);
    } catch (ex) {
      console.log(ex);
      throw ex;
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
    const _url = this.url(path);

    opts["headers"] = this.makeHeaders({
      json: true,
      existing: opts.headers,
      workspace: opts.workspace || this.config.workspace,
      workspaceId: opts.workspaceId || this.config.workspaceId,
      baseUrl: opts.baseUrl,
    });

    const resp = await fetch(_url, opts);
    return resp;
  }

  /**
   * Perform a `get` against the Steamship API.
   * @param path API Path rooted in apiBase provided in the configuration object.
   */
  public async get(path: string): Promise<Response> {
    return this.invokeApi(path, { method: "GET" });
  }

  /**
   * Perform a 'post' against the Steamship API
   * @param path API Path rooted in apiBase provided in the configuration object.
   * @param payload Payload, as a JSON object, to be provided as JSON to Steamship.
   */
  public async post(path: string, payload: any): Promise<Response> {
    return this.invokeApi(path, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public switchWorkspace({
    workspace,
    workspaceId,
  }: {
    workspace?: string;
    workspaceId?: string;
  }): Client {
    let newConfig = { ...this.config };
    delete newConfig.workspace;
    delete newConfig.workspaceId;
    newConfig.workspace = workspace;
    newConfig.workspaceId = workspaceId;
    return new Steamship(newConfig);
  }

  public async eventStream<T>(
    path: string,
    opts: any
  ): Promise<ReadableStream<T>> {
    const res = await this.invokeApi(path, opts);
    const decoder = new TextDecoder();
    const reader = res.body?.getReader();
    let streamingPromises: Record<string, Promise<void>> = {};
    const client = this;

    return new ReadableStream({
      async pull(controller): Promise<void> {
        const handleEvent = async (event: any) => {
          const data = event.data;
          try {
            let json = JSON.parse(data);
            // The engine nests things. We don't want that.
            if (json[event.event]) {
              json = json[event.event];
            }
            event.data = json as T;
            const blockId = event.data.blockId;
            console.log("blockId", blockId);
            client.block.get({ id: blockId }).then((block) => {
              if (isStreamTerminatingBlock(block)) {
                console.log("terminating block", block.id);
              }

              if (block.streamState == "started") {
                // @ts-ignore
                console.log("streaming block", block.id);
                streamingPromises[block.id] = new Promise<void>(
                  async (resolve, reject) => {
                    client.block
                      .raw({ id: block.id })
                      .then((response) => {
                        console.log("response", response);
                        resolve();
                        delete streamingPromises[block.id];
                      })
                      .catch((ex) => {
                        console.log("err fetching", ex);
                        delete streamingPromises[block.id];
                        reject();
                      });
                  }
                );

                // console.log("response", response);
                // if (!response.ok) {
                //   console.log("failed to get stream");
                //   const error = new Error(
                //     `Got back error streaming block: ${await response.text()}`
                //   );
                //   controller.error(error);
                //   return;
                // }
                // let str = "";
                // console.log("starting stream loop", block.id);
                // for await (const chunk of response.body as any) {
                //   console.log("chunk", chunk);
                //   str += decoder.decode(chunk);
                //   // Look up the block.
                //   // Stream an update.
                //   controller.enqueue(
                //     (JSON.stringify({
                //       id: blockId,
                //       text: str,
                //     }) + "\n") as T
                //   );
                // }
              }
              console.log("enqueueing block", block.id);

              controller.enqueue((JSON.stringify(block) + "\n") as T);
            });
          } catch (e) {
            controller.error(e);
          }
        };

        async function onParse(event: any) {
          if (event.type === "event") {
            // handleEvent(event);
            const data = event.data;
            let json = JSON.parse(data);
            // The engine nests things. We don't want that.
            if (json[event.event]) {
              json = json[event.event];
            }
            event.data = json as T;
            const blockId = event.data.blockId;
            console.log("Enqueuing blockId", blockId);
            const block = await client.block.get({ id: blockId });
            controller.enqueue((JSON.stringify(block) + "\n") as T);
            if (isStreamTerminatingBlock(block)) {
              console.log("terminating block", block.id);
              controller.close();
            }
          } else {
            console.log("Parser encountered something other than an event");
          }
        }

        const parser = createParser(onParse);

        const { value, done } = await reader!.read();

        // If we're done, and we have no more blocks to stream, close the stream.
        if (done) {
          console.log("closing");
          controller.close();
        } else {
          parser.feed(decoder.decode(value));
        }
      },
    });
  }
}
