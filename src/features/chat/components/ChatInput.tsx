import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isPending: boolean;
}

function ChatInput({ onSend, isPending }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending) return;
    onSend(message.trim());
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-3 py-2 md:py-3 bg-bg-page border-t border-border-medium"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
        className="flex-1 px-4 py-2.5 bg-bg-page rounded-lg text-sm text-text-heading placeholder:text-text-tertiary focus:outline-none border border-border-medium focus:border-primary"
      />
      <button
        type="submit"
        disabled={!message.trim() || isPending}
        className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-opacity"
      >
        전송
      </button>
    </form>
  );
}

export default ChatInput;
