import { NextRequest } from "next/server";

export default async function blockIdHandler(req: NextRequest) {
  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        Allow: "GET",
      },
    });
  }
  // get block Id from req
  const url = req.nextUrl.pathname;
  const blockId = url.split("/").pop();

  return fetch(`${process.env.STEAMSHIP_API_URL}/api/v1/block/${blockId}/raw`, {
    headers: {
      Authorization: `Bearer ${process.env.STEAMSHIP_API_KEY}`,
      "X-Workspace-Handle": process.env.STEAMSHIP_WORKSPACE_KEY || "",
    },
    method: "GET",
  });
}
