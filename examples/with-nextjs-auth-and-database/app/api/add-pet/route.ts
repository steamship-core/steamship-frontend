import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const { userId } = auth();
  const dogName = searchParams.get("dogName");
  const dogDescription = searchParams.get("dogDescription");
  const dogBreed = searchParams.get("dogBreed");

  try {
    if (!dogName || !userId || !dogBreed || !dogDescription)
      throw new Error("Name, description, and breed required");
    const dog = await prisma.dogs.create({
      data: {
        name: dogName,
        ownerId: userId,
        description: dogDescription,
        breed: dogBreed,
      },
    });
    return NextResponse.json({ dog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
