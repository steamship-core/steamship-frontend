import { StreamingTextResponse } from "ai";

import { Steamship } from "@steamship/client";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";

const getAgent = async (userId: string) => {
  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });

  if (!agent) {
    const steamship = new Steamship({ apiKey: process.env.STEAMSHIP_API_KEY });
    const packageInstance = await steamship.use(
      process.env.STEAMSHIP_PACKAGE_HANDLE!,
      `${process.env.STEAMSHIP_PACKAGE_HANDLE!}-${userId.toLowerCase()}`
    );
    return await prisma.agents.create({
      data: {
        ownerId: userId!,
        agentUrl: packageInstance.invocationURL!,
        handle: packageInstance.handle!,
      },
    });
  }

  return agent;
};

export const POST = async (req: Request) => {
  const { userId } = auth();

  const { messages, id } = (await req.json()) as {
    messages: { role: "user" | "assistent"; content: string }[];
    id: string;
  };

  const mostRecentUserMessage = messages
    .reverse()
    .find((message) => message.role === "user");

  const agent = await getAgent(userId!);
  const dogs = await prisma.dogs.findMany({
    where: {
      ownerId: userId!,
    },
  });

  await fetch(`${agent!.agentUrl}set_prompt_arguments`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STEAMSHIP_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      dogs: dogs.map((dog) => ({
        name: dog.name,
        description: dog.description,
        breed: dog.breed,
      })),
    }),
  });

  const steamshipResponse = await fetch(`${agent!.agentUrl}prompt`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STEAMSHIP_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      question: mostRecentUserMessage?.content,
      chat_session_id: id,
    }),
  });
  return new StreamingTextResponse(
    steamshipResponse.body as ReadableStream<any>
  );
};
