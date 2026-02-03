import React, { useState } from 'react';
import { Box, Group, TextInput } from '@mantine/core';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

interface ChatInputProps {
  onSend: (message: string) => void;
  isPending: boolean;
}

function ChatInput({ onSend, isPending }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const t = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending) return;
    onSend(message.trim());
    setMessage('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      px="sm"
      py="xs"
      style={{
        borderTop: '1px solid var(--mantine-color-default-border)',
      }}
    >
      <Group gap="xs" wrap="nowrap">
        <TextInput
          flex={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.chat.enterMessage}
          size="md"
        />
        <Button
          type="submit"
          disabled={!message.trim() || isPending}
          size="sm"
        >
          {t.chat.send}
        </Button>
      </Group>
    </Box>
  );
}

export default ChatInput;
