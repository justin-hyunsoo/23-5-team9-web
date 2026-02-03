import { useNavigate } from 'react-router-dom';
import { ActionIcon, Group, Text, UnstyledButton } from '@mantine/core';
import { Avatar, Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useHierarchicalBack } from '@/shared/hooks/useHierarchicalBack';

interface ChatHeaderProps {
  opponentId?: string;
  opponentNickname?: string | null;
  opponentProfileImage?: string | null;
  userCoin: number;
  onToggleTransferMenu: () => void;
}

function ChatHeader({
  opponentId,
  opponentNickname,
  opponentProfileImage,
  userCoin,
  onToggleTransferMenu,
}: ChatHeaderProps) {
  const navigate = useNavigate();
  const t = useTranslation();
  const goBack = useHierarchicalBack();

  return (
    <Group
      gap="md"
      px="md"
      py="sm"
      bg="var(--bg-page)"
      style={{ borderBottom: '1px solid var(--border-medium)' }}
    >
      <ActionIcon
        variant="subtle"
        color="gray"
        onClick={goBack}
        hiddenFrom="md"
        ml={-4}
      >
        <span>←</span>
      </ActionIcon>

      <UnstyledButton
        onClick={() => opponentId && navigate(`/user/${opponentId}`)}
        style={{ flex: 1 }}
      >
        <Group gap="md">
          <Avatar
            src={opponentProfileImage || undefined}
            alt={opponentNickname || t.chat.otherParty}
            size="sm"
          />
          <Text fw={600} c="var(--text-heading)">
            {opponentNickname || t.common.unknown}
          </Text>
        </Group>
      </UnstyledButton>

      <Button
        size="sm"
        onClick={onToggleTransferMenu}
      >
        {userCoin.toLocaleString()} C
      </Button>
    </Group>
  );
}

export default ChatHeader;
