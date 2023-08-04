import { NextRequest, NextResponse } from "next/server";
import handleChat from "./handleChat";
import handleBlockId from "./handleBlockId";

export const createNextPagesApiHandler = () => {
  return async (req: NextRequest, res: NextResponse) => {
    if (req.nextUrl.pathname === "/api/steamship/chat") {
      return handleChat(req);
    }
    if (req.nextUrl.pathname.includes("/api/steamship/blockId/")) {
      return handleBlockId(req);
    }
    return new Response("Not found", {
      status: 404,
    });
  };
};
