"use client";

import { useMemo, useRef } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { NarrativeBlock } from "./narrrative-block";
import { QuestNarrativeContainer } from "../shared/components";
import { Input } from "../../ui/input";

export default function QuestNarrative({ id }: { id: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: { id: "8175B824-2D02-4A7F-9AF8-938E5BDE6DA6" },
      id,
      api: "/api/steamship/chat",
    });

  // useEffect(() => {
  //   // Manually submit a message of   "Let's go on an adventure!" when the quest narrative loads
  //   inputRef?.current?.form?.requestSubmit();
  // }, []);

  return (
    <>
      <div className="flex basis-11/12 overflow-hidden">
        <QuestNarrativeContainer>
          {messages
            .map((message, i) => {
              if (message.role === "user") {
                return (
                  <div
                    key={message.id}
                    className="px-4 py-2 border-l-2 border-foreground/20 text-muted-foreground"
                  >
                    {message.content}
                  </div>
                );
              }
              return <NarrativeBlock key={message.id} message={message} />;
            })
            .reverse()}
        </QuestNarrativeContainer>
      </div>
      <div className="flex items-end w-full gap-2 basis-1/12 pb-4">
        <form
          className="flex gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            inputRef?.current?.focus();
            handleSubmit(e);
          }}
        >
          <Input
            className="w-full"
            value={input}
            onChange={handleInputChange}
            ref={inputRef}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <SendIcon size={16} />
          </Button>
        </form>
      </div>
    </>
  );
}

/*
* Existing chat widget
* When encountering a new block, may be a chat block or may not be
* Need a getBlockType helper to look through all tags and determine block

Block Types
* new background
* background audio
* narration (of a text block you already have!)
* character image
* Anything else, if it’s role assistant should be shown as text
*/
