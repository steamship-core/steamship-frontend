export const createBlockApiHandler =
  () => async (req: Request, context: { params: any }) => {
    const blockId = context.params.id[1];
    return fetch(
      `${process.env.STEAMSHIP_API_URL}/api/v1/block/${blockId}/raw`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STEAMSHIP_API_KEY}`,
          "X-Workspace-Handle": process.env.STEAMSHIP_WORKSPACE_KEY || "",
        },
        method: "GET",
      }
    );
  };
