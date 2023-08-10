"use client";

import { useChat } from "ai/react";
import { useRef, useMemo, ReactNode } from "react";
import {
  BotIcon,
  RotateCcwIcon,
  SendIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button, Input, Separator, Skeleton } from "../../ui";
import SteamshipMessage from "../../components/steamship-message";
import {
  SteamshipChatLoadingMessage,
  SteamshipChatMessageContainer,
  SteamshipChatMessageContentsContainer,
  SteamshipChatUser,
} from "../../components/steamship-chat-elements";

const SteamshipChatBox = ({
  placeholder,
  loadingText,
}: {
  placeholder?: string;
  loadingText?: string;
}) => {
  const chatUUID = useMemo(() => uuidv4(), []);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    setMessages,
  } = useChat({
    id: chatUUID,
    body: { id: chatUUID },
    api: "/api/steamship/chat",
  });

  return (
    <div className="steamship-h-full steamship-w-full">
      <div className="steamship-h-full steamship-flex-grow steamship-flex steamship-flex-col steamship-justify-between">
        <div className="steamship-px-4 steamship-flex steamship-justify-end steamship-gap-4 steamship-pt-2">
          <Button
            size="sm"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setMessages([]);
              setInput("");
            }}
            variant="outline"
          >
            <RotateCcwIcon className="steamship-h-4 steamship-w-4 steamship-text-primary" />
          </Button>
        </div>
        <div className="steamship-px-4 steamship-py-2 steamship-flex-grow steamship-overflow-scroll steamship-flex steamship-flex-col-reverse">
          <div>
            {messages.map((m) => (
              <SteamshipChatMessageContainer key={m.id}>
                <SteamshipChatUser role={m.role} />
                <SteamshipChatMessageContentsContainer>
                  <SteamshipMessage message={m.content} />
                </SteamshipChatMessageContentsContainer>
              </SteamshipChatMessageContainer>
            ))}
            {isLoading && (
              <div>
                <SteamshipChatLoadingMessage />
                {loadingText && (
                  <div className="steamship-flex steamship-items-center steamship-justify-center steamship-text-sm steamship-mt-2">
                    {loadingText}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="steamship-flex steamship-gap-2 steamship-px-4 steamship-py-2"
        >
          <label className="steamship-flex-grow">
            <Input
              placeholder={placeholder}
              value={input}
              onChange={handleInputChange}
              className="steamship-flex-grow"
            />
          </label>
          <Button type="submit">
            <SendIcon className="steamship-h-6 steamship-w-6" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SteamshipChatBox;
