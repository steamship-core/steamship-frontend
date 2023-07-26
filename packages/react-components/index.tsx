'use client';

import { useChat } from 'ai/react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { BotIcon, RotateCcwIcon, SendIcon, UserIcon, XIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { Button, Input, Separator, Skeleton, cn } from 'ui';

const useBlockUrl = (blockId: string) => {
  const [url, setUrl] = useState<string | undefined>();
  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(`/api/steamship/${blockId}`);
      const body = await res.blob();
      setUrl(URL.createObjectURL(body));
    };
    if (!url) {
      fetchImage();
    }
  }, [blockId]);

  return url;
};

const SteamshipImage = ({ blockId }: { blockId: string }) => {
  const url = useBlockUrl(blockId);
  if (!url) {
    return <Skeleton className="w-44 h-44" />;
  }
  return <img src={url} className="w-auto h-44" />;
};

const SteamshipAudio = ({ blockId, mimeType }: { blockId: string; mimeType: string }) => {
  const url = useBlockUrl(blockId);

  if (!url) {
    return <Skeleton className="w-44 h-2" />;
  }

  return (
    <audio controls>
      <source src={url} type={mimeType} />
    </audio>
  );
};

const SteamshipMessage = ({ message }: { message: string }) => {
  try {
    const messageJson = JSON.parse(message) as {
      text: string;
      id?: string;
      fileId?: string;
      mimeType?: string;
    }[];
    const audioMessage = messageJson.find((m) => m.fileId && m.mimeType?.indexOf('audio') !== -1);
    if (audioMessage && audioMessage.id && audioMessage.mimeType) {
      return <SteamshipAudio blockId={audioMessage.id} mimeType={audioMessage.mimeType} />;
    }

    return messageJson.map((m, i) => {
      if (m.id && m.mimeType?.indexOf('image') !== -1) {
        return <SteamshipImage key={i} blockId={m.id} />;
      }
      let text = m.text;
      if (m.text.startsWith('. ')) {
        text = m.text.slice(2);
      }
      return (
        <div key={i} className="code-block whitespace-pre-wrap">
          <ReactMarkdown
            children={text}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    className={cn(className, 'rounded-md my-2 break-words whitespace-pre-wrap')}
                    style={a11yDark}
                    language={match[1]}
                  >
                    {`${children}`}
                  </SyntaxHighlighter>
                ) : (
                  <code className="text-blue-500 !inline">{children}</code>
                );
              }
            }}
          />
        </div>
      );
    });
  } catch (e) {
    return <span>{message}</span>;
  }
};

export const SteamshipChatPrompt = ({ onClose }: { onClose: () => void }) => {
  const starterSubmitButtonRef = useRef<HTMLButtonElement | null>();
  const chatUUID = useMemo(() => uuidv4(), []);
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } =
    useChat({ id: chatUUID, body: { id: chatUUID } });

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 flex z-30 justify-center items-start py-12 md:py-24 bg-black bg-opacity-60">
      <div
        id="steamship-chat-modal"
        className="border rounded-xl shadow-xl bg-background flex w-[650px] max-w-[100vw] max-h-[100%]"
      >
        {messages.length === 0 ? (
          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center gap-2 mt-2 px-2"
            >
              <Input
                autoFocus
                placeholder="Ask any question of our docs"
                value={input}
                onChange={handleInputChange}
                className="flex-grow border-none !ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus:ring-none focus:outline-none focus:border-none text-xl"
              />
              <Button type="submit" ref={starterSubmitButtonRef as React.Ref<HTMLButtonElement>}>
                <SendIcon className="h-6 w-6" />
              </Button>
            </form>
            <div className="py-2">
              <Separator />
            </div>
            <div className="py-4 flex gap-3 flex-col px-12">
              <div>
                Ask any question of our docs and our assistant will help you find the answer.
              </div>
              <div className="flex items-start justify-start gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setInput('How do I create a package?');
                    setTimeout(() => {
                      starterSubmitButtonRef?.current?.click();
                    }, 100);
                  }}
                  className="w-full"
                >
                  How do I create a package?
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setInput('How do I use a package?');
                    setTimeout(() => {
                      starterSubmitButtonRef?.current?.click();
                    }, 100);
                  }}
                  className="w-full"
                >
                  How do I use a package?
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-between">
            <div className="px-4 flex justify-end gap-4 pt-2">
              <Button
                size="sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setMessages([]);
                  setInput('');
                }}
                variant="outline"
              >
                <RotateCcwIcon className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onClose()}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-4 py-2 flex-grow overflow-scroll flex flex-col-reverse">
              <div>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="border border-white/10 px-2 py-4 rounded-md mb-4 grid grid-cols-12"
                  >
                    <div className="col-span-1 flex justify-center">
                      {m.role === 'user' ? (
                        <UserIcon className="h-6 w-6" />
                      ) : (
                        <BotIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="space-y-2 col-span-11">
                      {/* @ts-ignore */}
                      <SteamshipMessage message={m.content} />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div>
                    <div className="px-2 rounded-md flex gap-4">
                      <div className="">
                        <Skeleton className="h-6 w-6 bg-foreground/20" />
                      </div>
                      <div className="space-y-2 w-full">
                        <Skeleton className="w-full h-8 bg-foreground/20" />
                        <div className="flex gap-4">
                          <Skeleton className="w-1/4 h-8 bg-foreground/20" />
                          <Skeleton className="w-3/4 h-8 bg-foreground/20" />
                        </div>
                        <Skeleton className="w-2/3 h-8 bg-foreground/20" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-sm mt-2">
                      Searching the documentation ...
                    </div>
                  </div>
                )}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-2">
              <label className="flex-grow">
                <Input
                  placeholder="Ask any question of our docs"
                  value={input}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              </label>
              <Button type="submit">
                <SendIcon className="h-6 w-6" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};