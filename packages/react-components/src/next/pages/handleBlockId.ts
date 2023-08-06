import { NextRequest } from "next/server";

/**
 * API Handler resolves `some/path/to/<block_id>` raw value of that Steamship Block (text, image, audio, video, etc).
 * 
 * The Steamship Key stored in the `STEAMSHIP_API_KEY` variable is used for authentication.
 */
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
