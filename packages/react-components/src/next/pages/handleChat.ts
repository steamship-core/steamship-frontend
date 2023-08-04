import { StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";

export default async function handleChat(req: NextRequest) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        Allow: "POST",
      },
    });
  }
  if (!req.json) {
    return new Response("Missing JSON", {
      status: 500,
    });
  }
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
