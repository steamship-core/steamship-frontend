import { NextResponse } from "next/server";

const GET = (req: Request, context: { params: any }) => {
  const blockId = context.params.blockId;
  return fetch(`https://api.steamship.com/api/v1/block/${blockId}/raw`, {
    headers: {
      Authorization: `Bearer ${process.env.STEAMSHIP_API_KEY}`,
    },
    method: "GET",
  }) as Promise<NextResponse>;
};

export { GET };
