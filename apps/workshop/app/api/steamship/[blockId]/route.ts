export const runtime = "edge";

export async function GET(req: Request, context: { params: any }) {
  return fetch(
    `${process.env.STEAMSHIP_API_URL}/${context.params.blockId}/raw`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STEAMSHIP_API_KEY}`,
        "X-Workspace-Handle": "logobot-example-03c",
      },
      method: "GET",
    }
  );
}
