import { StreamingTextResponse } from "ai";
import Steamship, { SteamshipStream } from "@steamship/client";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages, id: context_id } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    id: string;
  };

  const mostRecentUserMessage = messages
    .reverse()
    .find((message) => message.role === "user");

  const prompt = mostRecentUserMessage?.content || "";

  const steamship = new Steamship({
    apiKey: process.env.STEAMSHIP_API_KEY,
    appBase: "https://apps.staging.steamship.com/",
    apiBase: "https://api.staging.steamship.com/api/v1/",
  });

  // See https://docs.steamship.com/javascript_client for information about:
  // - The BASE_URL where your running Agent lives
  // - The context_id which mediates your Agent's server-side chat history

  console.log(`BaseURL: ${process.env.STEAMSHIP_AGENT_URL}`);

  const response = await steamship.agent.respondAsync({
    url: process.env.STEAMSHIP_AGENT_URL!,
    input: {
      prompt,
      context_id,
    },
  });

  // Adapt the Steamship into a Markdown Stream
  //
  // Format options are
  //  - markdown: A single stream of Markdown with markdown-style media
  //  - json: A stream of Steamship Blocks. Streaming text will be a repeated block.
  const stream = await SteamshipStream(response, steamship, {
    streamTimeoutSeconds: 60,
    // Use: "markdown" | "json"
    format: "json",
  });

  // Respond with a stream of Markdown
  return new StreamingTextResponse(stream);
}
