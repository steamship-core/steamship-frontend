import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { Steamship } from "@steamship/client";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const { userId } = auth();
  const steamship = new Steamship({ apiKey: process.env.STEAMSHIP_API_KEY });
  const packageInstance = await steamship.use(
    process.env.STEAMSHIP_PACKAGE_HANDLE!,
    `${process.env.STEAMSHIP_PACKAGE_HANDLE!}-${userId!.toLowerCase()}`
  );
  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }
  await prisma.agents.update({
    where: {
      id: agent.id,
    },
    data: {
      agentUrl: packageInstance.invocationURL!,
      handle: packageInstance.handle!,
    },
  });

  return NextResponse.json({ agent }, { status: 200 });
}
