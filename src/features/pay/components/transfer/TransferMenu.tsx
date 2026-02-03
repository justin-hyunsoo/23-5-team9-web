import { Box, Group, Text } from '@mantine/core';
import { Button, Input } from '@/shared/ui';
import { useTransfer } from '@/features/pay/hooks/useTransfer';
import { useTranslation } from '@/shared/i18n';

interface TransferMenuProps {
  currentCoin: number;
  recipientId: string | undefined;
  recipientName?: string;
}

const PRESET_AMOUNTS = [1000, 5000, 10000, 50000];

const TransferMenu = ({
  currentCoin,
  recipientId,
  recipientName,
}: TransferMenuProps) => {
  const t = useTranslation();
  const {
    transferAmount,
    transferring,
    setTransferAmount,
    transfer,
    addAmount,
  } = useTransfer({ currentCoin });

  const displayName = recipientName || t.chat.otherParty;

  const handleTransfer = async () => {
    if (!recipientId) return;
    await transfer(recipientId, displayName);
  };

  return (
    <Box px="md" py="sm" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
      <Group gap="xs" mb="xs">
        <Input
          type="number"
          placeholder={t.pay.amountToTransfer}
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button
          onClick={handleTransfer}
          disabled={transferring || !transferAmount}
          size="sm"
        >
          {transferring ? t.pay.transferring : t.pay.transfer}
        </Button>
      </Group>
      <Group gap="xs" wrap="wrap">
        {PRESET_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            size="sm"
            onClick={() => addAmount(amount)}
          >
            +{amount.toLocaleString()}
          </Button>
        ))}
      </Group>
      <Text size="xs" c="dimmed" mt="xs">
        {displayName}{t.pay.willTransferCoins}
      </Text>
    </Box>
  );
};

export default TransferMenu;
