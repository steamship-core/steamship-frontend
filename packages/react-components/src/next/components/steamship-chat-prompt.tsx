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

const SteamshipChatPrompt = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: (args: { onSubmit: (message: string) => void }) => ReactNode;
}) => {
  const starterSubmitButtonRef = useRef<HTMLButtonElement | null>();
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

  const onSubmit = (message: string) => {
    setInput(message);
    setTimeout(() => {
      starterSubmitButtonRef?.current?.click();
    }, 100);
  };

  return (
    <div className="steamship-widget steamship-fixed steamship-top-0 steamship-bottom-0 steamship-right-0 steamship-left-0 steamship-flex steamship-z-30 steamship-justify-center steamship-items-start steamship-py-12 md:steamship-py-24 steamship-bg-black steamship-bg-opacity-60">
      <div
        id="steamship-chat-modal"
        className="steamship-border steamship-rounded-xl steamship-shadow-xl steamship-bg-background steamship-flex steamship-w-[650px] steamship-max-w-[100vw] steamship-max-h-[100%]"
      >
        {messages.length === 0 ? (
          <div className="steamship-w-full">
            <form
              onSubmit={handleSubmit}
              className="steamship-flex steamship-items-center steamship-justify-center steamship-gap-2 steamship-mt-2 steamship-px-2"
            >
              <Input
                autoFocus
                placeholder="Ask any question of our docs"
                value={input}
                onChange={handleInputChange}
                className="steamship-flex-grow steamship-border-none !steamship-ring-0 focus-visible:steamship-ring-0 focus-visible:steamship-ring-transparent focus:steamship-ring-none focus:steamship-outline-none focus:steamship-border-none steamship-text-xl"
              />
              <Button
                type="submit"
                ref={starterSubmitButtonRef as React.Ref<HTMLButtonElement>}
              >
                <SendIcon className="steamship-h-6 steamship-w-6" />
              </Button>
            </form>
            {children({ onSubmit })}
          </div>
        ) : (
          <div className="steamship-flex-grow steamship-flex steamship-flex-col steamship-justify-between">
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
                <RotateCcwIcon className="steamship-h-4 steamship-w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onClose()}>
                <XIcon className="steamship-h-4 steamship-w-4" />
              </Button>
            </div>
            <div className="steamship-px-4 steamship-py-2 steamship-flex-grow steamship-overflow-scroll steamship-flex steamship-flex-col-reverse">
              <div>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="steamship-border steamship-border-white/10 steamship-px-2 steamship-py-4 steamship-rounded-md steamship-mb-4 steamship-grid steamship-grid-cols-12"
                  >
                    <div className="steamship-col-span-1 steamship-flex steamship-justify-center">
                      {m.role === "user" ? (
                        <UserIcon className="steamship-h-6 steamship-w-6" />
                      ) : (
                        <BotIcon className="steamship-h-6 steamship-w-6" />
                      )}
                    </div>
                    <div className="steamship-space-y-2 steamship-col-span-11">
                      <SteamshipMessage message={m.content} />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div>
                    <div className="steamship-px-2 steamship-rounded-md steamship-flex steamship-gap-4">
                      <div className="">
                        <Skeleton className="steamship-h-6 steamship-w-6 steamship-bg-foreground/20" />
                      </div>
                      <div className="steamship-space-y-2 steamship-w-full">
                        <Skeleton className="steamship-w-full steamship-h-8 steamship-bg-foreground/20" />
                        <div className="steamship-flex steamship-gap-4">
                          <Skeleton className="steamship-w-1/4 steamship-h-8 steamship-bg-foreground/20" />
                          <Skeleton className="steamship-w-3/4 steamship-h-8 steamship-bg-foreground/20" />
                        </div>
                        <Skeleton className="steamship-w-2/3 steamship-h-8 steamship-bg-foreground/20" />
                      </div>
                    </div>
                    <div className="steamship-flex steamship-items-center steamship-justify-center steamship-text-sm steamship-mt-2">
                      Searching the documentation ...
                    </div>
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
                  placeholder="Ask any question of our docs"
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
        )}
      </div>
    </div>
  );
};

export default SteamshipChatPrompt;
