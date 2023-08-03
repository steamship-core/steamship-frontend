'use client';

import { useEffect, useState } from 'react';
import { SteamshipChatPrompt } from '@steamship/react/next';
import { Button, Separator } from '@steamship/react';

export const SteamshipChatContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target instanceof Element && !e.target.closest('#steamship-chat-modal')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleAskClick = (e: MouseEvent) => {
      if (
        e.target instanceof Element &&
        e.target.textContent === 'Ask' &&
        e.target.closest('nav')
      ) {
        setIsOpen(true);
      }
    };
    document.addEventListener('click', handleAskClick);
    return () => {
      document.removeEventListener('click', handleAskClick);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <SteamshipChatPrompt onClose={() => null}>
      {({ onSubmit }) => (
        <>
          <div className="py-2">
            <Separator />
          </div>
          <div className="py-4 flex gap-3 flex-col px-12">
            <div>Ask any question of our docs and our assistant will help you find the answer.</div>
            <div className="flex items-start justify-start gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  onSubmit('How do I create a package?');
                }}
                className="w-full"
              >
                How do I create a package?
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onSubmit('How do I use a package?');
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
};
