import { StreamingTextResponse } from "ai";

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, id } = (await req.json()) as {
    messages: { role: "user" | "assistent"; content: string }[];
    id: string;
  };
  const mostRecentUserMessage = messages
    .reverse()
    .find((message) => message.role === "user");
  const steamshipResponse = await fetch(
    `${process.env.STEAMSHIP_AGENT_URL}/prompt`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STEAMSHIP_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        question: mostRecentUserMessage?.content,
        chat_session_id: id,
      }),
    }
  );
  return new StreamingTextResponse(
    steamshipResponse.body as ReadableStream<any>
  );
}
