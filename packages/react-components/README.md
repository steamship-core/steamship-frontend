# @steamship/react

## Installation

```
  npm i @steamship/react
```

## Usage

### Next.js

@steamship/react integrates directly with vercels `ai` package.

#### Setup Env Vars

```
STEAMSHIP_API_KEY=...
STEAMSHIP_AGENT_URL=...
STEAMSHIP_WORKSPACE_KEY=...
STEAMSHIP_API_URL=https://api.steamship.com
```

Your `STEAMSHIP_API_KEY` can be found at [https://www.steamship.com/account/api](https://www.steamship.com/account/api).

Your `STEAMSHIP_AGENT_URL` can be found by navigating to Dashboard > Your Agent > API > POST /prompt > cURL

Your `STEAMSHIP_WORKSPACE_KEY` can be found in the URL for your agent. `https://www.steamship.com/dashboard/agents/workspaces/YOUR_WORKSPACE_KEY/packages/YOUR_PACKAGE_KEY/POST/prompt`.

#### Setup api endpoints

If you're using the new `app` directory, create a file located at `app/api/steamship/[...id]/route.ts` with the following contents:

```javascript
import {
  createBlockApiHandler,
  createChatApiHandler,
} from "@steamship/react/next/server";

export const runtime = "edge";

export const GET = createBlockApiHandler();
export const POST = createChatApiHandler();
```

If youre using the old `pages` directory, create a file located at `pages/api/steamship/[...steamship].ts` with the following contents:

```javascript
import { createNextPagesApiHandler } from "@steamship/react/next/server";

export const config = {
  runtime: "edge",
};

export default createNextPagesApiHandler();
```

#### Use in components

You can refer directly to the `useChat` docs for the easiest way to interact with your steamship api endpoints. You'll need to set the `api` endpoint to match the endpoints we previous setup. In the example below we also create a dummy chat ID.

```javascript
"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const chatUUID = useMemo(() => uuidv4(), []);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: chatUUID,
    body: { id: chatUUID },
    api: "/api/steamship/chat",
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <label>
          Say something...
          <input value={input} onChange={handleInputChange} />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

Steamship agents often offer multi-modal support. To provide out of the box support for multi-modal responses, you can use a few utility methods.

`SteamshipMessage` will take a message from `useChat` and support text, markdown, syntax highlighting, audio streams, and images.

`useBlockUrl` will take a blockId returned from steamship and fetch the raw data associated with it. This is used for fetching audio and image data, for example.

As an example, you can import or look at the [SteamshipChatPrompt component.](https://github.com/steamship-core/steamship-frontend/blob/main/packages/react-components/src/next/components/steamship-chat-prompt.tsx)
