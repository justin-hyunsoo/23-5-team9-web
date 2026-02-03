import { Button, Avatar } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useDetail } from '@/features/product/hooks/DetailContext';
import { Group, Stack, Text, UnstyledButton } from '@mantine/core';

export function SellerSection() {
  const t = useTranslation();
  const { sellerProfile, handleNavigateToSeller, handleChat, isChatLoading, isOwner } = useDetail();

  return (
    <Group justify="space-between" align="center" wrap="nowrap">
      <UnstyledButton onClick={handleNavigateToSeller} style={{ flex: 1 }}>
        <Group gap="sm" wrap="nowrap">
          <Avatar src={sellerProfile?.profile_image ?? undefined} alt={sellerProfile?.nickname ?? undefined} size="sm" />
          <Stack gap={2}>
            <Text fw={600} lineClamp={1}>
              {sellerProfile?.nickname || t.common.unknown}
            </Text>
            <Text size="sm" c="dimmed">
              {t.product.seller}
            </Text>
          </Stack>
        </Group>
      </UnstyledButton>

      {!isOwner && (
        <Button size="sm" onClick={handleChat} disabled={isChatLoading}>
          {isChatLoading ? t.product.connecting : t.product.startChat}
        </Button>
      )}
    </Group>
  );
}
