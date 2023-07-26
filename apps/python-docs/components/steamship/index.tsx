'use client';

import { useEffect, useState } from 'react';
import { SteamshipChatPrompt } from 'react-components';

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
      if (e.target instanceof Element && e.target.textContent === 'Ask') {
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
  console.log('IS OHPEN, RENDERING', isOpen)
  
  return <SteamshipChatPrompt onClose={() => setIsOpen(false)} />;
}