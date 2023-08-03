"use client";

import { SteamshipChatPrompt } from "@steamship/react/next";
import { Button, Separator } from "@steamship/react";

export const Steamship = () => (
  <SteamshipChatPrompt onClose={() => null}>
    {({ onSubmit }) => (
      <>
        <div className="py-2">
          <Separator />
        </div>
        <div className="py-4 flex gap-3 flex-col px-12">
          <div>
            Ask any question of our docs and our assistant will help you find
            the answer.
          </div>
          <div className="flex items-start justify-start gap-4">
            <Button
              variant="outline"
              onClick={() => {
                onSubmit("How do I create a package?");
              }}
              className="w-full"
            >
              How do I create a package?
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onSubmit("How do I use a package?");
              }}
              className="w-full"
            >
              How do I use a package?
            </Button>
          </div>
        </div>
      </>
    )}
  </SteamshipChatPrompt>
);
