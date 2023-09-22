"use client";

import { useChat } from "ai/react";
import { Fragment, useMemo, useState } from "react";
import {
  SteamshipChatLoadingMessage,
  SteamshipChatMessageContainer,
  SteamshipChatMessageContentsContainer,
  SteamshipChatUser,
  SteamshipMessage,
} from "@steamship/react";
import { v4 as uuidv4 } from "uuid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, SendIcon, SparklesIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TypographyH4 } from "@/components/ui/typography/TypographyH4";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";

export default function Steamship() {
  const chatUUID = useMemo(() => uuidv4(), []);
  const [errors, setErrors] = useState<Error[]>([]);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      id: chatUUID,
      body: { id: chatUUID },
      api: "/api/steamship/chat",
      onError(error) {
        setErrors((prev) => [...prev, error]);
      },
      onFinish(message) {
        if (message.content === "{}") {
          setErrors((prev) => [...prev, new Error("Empty response")]);
        }
      },
    });

  return (
    <div className="h-full w-full">
      <div className="h-full flex-grow flex flex-col justify-between">
        <div className="px-4 flex justify-between gap-4 pt-2">
          <div>
            {errors.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <AlertCircleIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mt-2 border-destructive">
                  <ScrollArea className="max-h-[200px] w-full">
                    <TypographyH4>Errors</TypographyH4>
                    {errors.map((e, i) => (
                      <Fragment key={`${e.message}-${i}`}>
                        <div className="text-sm">{e.message}</div>
                        <Separator className="my-2" />
                      </Fragment>
                    ))}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <div className="px-4 py-2 flex-grow overflow-scroll flex flex-col-reverse">
          {messages.length === 0 && (
            <div className="h-full w-full flex items-center justify-center flex-col gap-4">
              <>
                <div className="flex gap-4">
                  <SparklesIcon className="h-6 w-6" />
                  <TypographyH4>Agent ready to chat!</TypographyH4>
                </div>
                <TypographyMuted>
                  Say something to start the conversation
                </TypographyMuted>
              </>
            </div>
          )}
          <div>
            {messages.map(
              (m) =>
                m.content !== "{}" && (
                  <SteamshipChatMessageContainer key={m.id}>
                    <SteamshipChatUser role={m.role} />
                    <SteamshipChatMessageContentsContainer>
                      <SteamshipMessage message={m.content} />
                    </SteamshipChatMessageContentsContainer>
                  </SteamshipChatMessageContainer>
                )
            )}
            {isLoading && (
              <div>
                <SteamshipChatLoadingMessage />
                <div className="flex items-center justify-center text-sm mt-2">
                  Agent is responding...
                </div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-2">
          <label className="flex-grow">
            <Input
              placeholder="Try saying 'Tell me about my dogs'"
              value={input}
              onChange={handleInputChange}
              className="flex-grow"
            />
          </label>
          <Button type="submit" variant="outline">
            <SendIcon className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </div>
  );
}
