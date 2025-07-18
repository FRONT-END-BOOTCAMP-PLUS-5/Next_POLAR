'use client';
import { useState, useCallback } from 'react';

interface UseChatInputProps {
  onSendMessage: (message: string) => void;
  maxLength?: number;
}

export function useChatInput({
  onSendMessage,
  maxLength = 1000,
}: UseChatInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleInputChange = useCallback(
    (value: string) => {
      if (value.length <= maxLength) {
        setMessage(value);
      }
    },
    [maxLength]
  );

  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isComposing) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  }, [message, isComposing, onSendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage, isComposing]
  );

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const canSend = message.trim().length > 0 && !isComposing;

  return {
    message,
    isComposing,
    canSend,
    handleInputChange,
    handleSendMessage,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  };
}
