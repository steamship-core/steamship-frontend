import {
  createBlockApiHandler,
  createChatApiHandler,
} from "@steamship/react/next/server";

export const runtime = "edge";

export const GET = createBlockApiHandler();
export const POST = createChatApiHandler();
