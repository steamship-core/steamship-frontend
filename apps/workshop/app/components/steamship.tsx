"use client";

import { useEffect, useState } from "react";
import {
  SteamshipChatBox,
  SteamshipChatPrompt,
} from "@steamship/react/next/client";
import { Button, Separator } from "@steamship/react";
import Quest from "./quest/quest";

export const Steamship = () => <Quest />;

export const SteamshipChatPromptContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen((o) => !o)}>Open Prompt</Button>
      {isOpen && (
        <SteamshipChatPrompt
          onClose={() => setIsOpen(false)}
          placeholder="Start Chatting"
          loadingText="Searching the documentation ..."
        >
          {({ onSubmit }) => (
            <>
              <div className="py-2">
                <Separator />
              </div>
              <div className="py-4 flex gap-3 flex-col px-12">
                <div>This is an example of a chat prompt</div>
                <div className="flex items-start justify-start gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onSubmit("How do I create a package?");
                    }}
                    className="w-full"
                  >
                    Hello! How are you?
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onSubmit("How do I use a package?");
                    }}
                    className="w-full"
                  >
                    Make a logo of a shark
                  </Button>
                </div>
              </div>
            </>
          )}
        </SteamshipChatPrompt>
      )}
    </div>
  );
};
