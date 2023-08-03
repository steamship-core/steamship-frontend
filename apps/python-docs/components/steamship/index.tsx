'use client';

import { useEffect, useState } from 'react';
import { SteamshipChatPrompt } from '@steamship/react/next';

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

  return <SteamshipChatPrompt onClose={() => setIsOpen(false)} />;
};
