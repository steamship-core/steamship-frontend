import { StreamingTextResponse } from "ai";
import Steamship, {SteamshipMarkdownStream} from '@steamship/client'

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

const BASE_URL = "https://ted.steamship.run/ai-character-with-stable-diffusion-1fj-ekjxm5/ai-character-with-stable-diffusion-1fj"

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages, id: context_id } = (await req.json()) as {
    messages: { role: "user" | "assistent"; content: string }[];
    id: string;
  };
  const mostRecentUserMessage = messages
      .reverse()
      .find((message) => message.role === "user");
  const prompt = mostRecentUserMessage.content

  // Create a Steamship client
  const steamship = new Steamship({apiKey: process.env.STEAMSHIP_API_KEY})

  // See https://docs.steamship.com/javascript_client for information about:
  // - The BASE_URL where your running Agent lives
  // - The context_id which mediates your Agent's server-side chat history
  const response = await steamship.agent.respondAsync({
    url: BASE_URL,
    input: {
      prompt,
      context_id
    },
  })

  // Adapt the Streamship Blockstream into a Markdown Stream
  const stream = await SteamshipMarkdownStream(response, steamship)

  // Respond with a stream of Markdown
  return new StreamingTextResponse(stream)
}


