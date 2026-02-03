import { useQuery, useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { imageApi, ImageUploadResponse } from '@/features/product/api/imageApi';
import { fetchRegionById } from '@/features/location/api/region';
import { useCreateRoom } from '@/features/chat/hooks/useChat';
import { DetailImage, Thumbnail, Button, Badge, Input, DetailSection, Avatar } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';
import { useImageCarousel, useContentTranslation } from '@/features/product/hooks/shared';
import { useDetail } from '@/features/product/hooks/DetailContext';
import { useProductDetail } from '@/features/product/hooks/ProductDetailContext';
import { useUser } from '@/features/user/hooks/useUser';
import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';

function formatDateTime(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ProductDetailView() {
  const t = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const createRoom = useCreateRoom();
  const { product, isOwner, isDeleting, startEditing, handleDelete } = useDetail();
  const { auction, isAuction, isEnded, remainingTime, bidPrice, setBidPrice, minBidPrice, handleBid, isBidding, topBidder, topBidderProfile, isTopBidder, hasAuctionPayment, isPayingAuction, handleAuctionPayment } = useProductDetail();

  const handleNavigateToTopBidder = () => {
    if (topBidder?.bidder_id) {
      navigate(`/user/${topBidder.bidder_id}`);
    }
  };

  const handleChatWithTopBidder = () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }
    if (!topBidder?.bidder_id) return;
    if (user?.id === topBidder.bidder_id) {
      return; // Can't chat with yourself
    }
    createRoom.mutate(topBidder.bidder_id, {
      onSuccess: (roomId) => navigate(`/chat/${roomId}`),
      onError: () => alert(t.chat.cannotOpenRoom),
    });
  };

  const imageQueries = useQueries({
    queries: (product.image_ids ?? []).map(id => ({
      queryKey: ['image', id],
      queryFn: () => imageApi.getById(id),
      staleTime: 1000 * 60 * 5, // 5분 캐시 - useFirstImage와 공유
    })),
  });
  const images = imageQueries.map(q => q.data).filter((img): img is ImageUploadResponse => !!img);

  const { data: region } = useQuery({
    queryKey: ['region', product.region_id],
    queryFn: () => fetchRegionById(product.region_id),
    enabled: !!product.region_id,
    staleTime: 1000 * 60 * 30, // 지역 정보는 30분 캐시 (거의 변하지 않음)
  });

  const { index, hasPrev, hasNext, goPrev, goNext, goTo } = useImageCarousel(images.length);
  const { displayTitle, displayContent, needsTranslation, isTranslated, isTranslating, handleTranslate } = useContentTranslation(product.title, product.content ?? '');

  const onTranslate = async () => { if (!await handleTranslate()) alert(t.product.translateFailed); };

  return (
    <>
      {/* Box 1: Product Information */}
      <DetailSection style={{ marginBottom: 'var(--mantine-spacing-md)' }}>
        <Stack gap="md">
          {images.length > 0 && (
            <Stack gap="sm">
              <Box pos="relative">
                <DetailImage src={images[index].image_url} alt={product.title} />

                {images.length > 1 && hasPrev && (
                  <ActionIcon
                    aria-label="previous image"
                    onClick={goPrev}
                    variant="filled"
                    color="dark"
                    radius="xl"
                    size="lg"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.4)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </ActionIcon>
                )}

                {images.length > 1 && hasNext && (
                  <ActionIcon
                    aria-label="next image"
                    onClick={goNext}
                    variant="filled"
                    color="dark"
                    radius="xl"
                    size="lg"
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.4)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </ActionIcon>
                )}
              </Box>

              {images.length > 1 && (
                <Group justify="center" gap="xs">
                  {images.map((img, i) => {
                    const isSelected = i === index;
                    return (
                      <UnstyledButton
                        key={img.id}
                        onClick={() => goTo(i)}
                        aria-label={isSelected ? `image ${i + 1} selected` : `select image ${i + 1}`}
                      >
                        <Box
                          style={{
                            borderRadius: 'var(--mantine-radius-md)',
                            overflow: 'hidden',
                            opacity: isSelected ? 1 : 0.65,
                            outline: isSelected ? '2px solid var(--mantine-color-orange-6)' : '1px solid var(--mantine-color-gray-3)',
                            outlineOffset: 2,
                          }}
                        >
                          <Thumbnail src={img.image_url} alt={product.title} size={48} />
                        </Box>
                      </UnstyledButton>
                    );
                  })}
                </Group>
              )}
            </Stack>
          )}

          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
              <Badge variant={product.is_sold ? 'secondary' : 'primary'}>
                {product.is_sold ? t.product.soldOut : t.product.onSale}
              </Badge>

              {region && (
                <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ opacity: 0.7 }}>
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {region.sigugun} {region.dong}
                  </Text>
                </Group>
              )}
            </Group>

            {needsTranslation && (
              <Button variant="ghost" size="sm" onClick={onTranslate} disabled={isTranslating}>
                {isTranslating ? t.product.translating : isTranslated ? t.product.showOriginal : t.product.translate}
              </Button>
            )}
          </Group>

          <Title order={2} size="h2">
            {displayTitle}
          </Title>

          {!isAuction && (
            <Text fw={800} fz={32} c="orange">
              {product.price.toLocaleString()}{t.common.won}
            </Text>
          )}

          <Divider />

          <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {displayContent}
          </Text>

          {isOwner && (
            <>
              <Divider />
              <Group justify="flex-end" gap="sm">
                <Button size="sm" onClick={startEditing}>
                  {t.common.edit}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isDeleting}>
                  {t.common.delete}
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </DetailSection>

      {/* Box 2: Auction Information */}
      {isAuction && auction && (
        <DetailSection>
          <Stack gap="md">
            <Title order={3} size="h3">
              {t.auction.auction}
            </Title>

            <Group justify="space-between" align="center" wrap="nowrap">
              <Badge variant={isEnded ? 'secondary' : 'primary'}>
                {isEnded ? t.auction.auctionEnded : t.auction.active}
              </Badge>
              {!isEnded && (
                <Text c="red" fw={700} lineClamp={1}>
                  {remainingTime === t.auction.timeEnded ? remainingTime : `${remainingTime} ${t.auction.remaining}`}
                </Text>
              )}
            </Group>

            <Text size="sm" c="dimmed">
              {t.auction.endTime}: {formatDateTime(auction.end_at, language)}
            </Text>

            <Paper withBorder radius="md" p="md">
              <Stack gap="xs">
                <Group justify="space-between" align="center">
                  <Text size="sm" c="dimmed">{t.auction.startingPrice}</Text>
                  <Text size="sm">{product.price.toLocaleString()}{t.common.won}</Text>
                </Group>
                <Group justify="space-between" align="center">
                  <Text size="sm" c="dimmed">{t.auction.currentPrice}</Text>
                  <Text fw={800} fz={24} c="orange">{auction.current_price.toLocaleString()}{t.common.won}</Text>
                </Group>
                <Group justify="space-between" align="center">
                  <Text size="sm" c="dimmed">{t.auction.bidCount}</Text>
                  <Text size="sm">{t.auction.bidsCount.replace('{count}', String(auction.bid_count))}</Text>
                </Group>
              </Stack>
            </Paper>

            {topBidder && (
              <>
                <Divider />
                <Group justify="space-between" align="center" wrap="nowrap">
                  <UnstyledButton onClick={handleNavigateToTopBidder} style={{ flex: 1 }}>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar src={topBidderProfile?.profile_image ?? undefined} alt={topBidderProfile?.nickname ?? undefined} size="sm" />
                      <Stack gap={2}>
                        <Text fw={600} lineClamp={1}>
                          {topBidderProfile?.nickname || t.common.unknown}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {t.auction.topBidder}
                        </Text>
                      </Stack>
                    </Group>
                  </UnstyledButton>

                  {!isTopBidder && (
                    <Button size="sm" onClick={handleChatWithTopBidder} disabled={createRoom.isPending}>
                      {createRoom.isPending ? t.product.connecting : t.product.startChat}
                    </Button>
                  )}
                </Group>
              </>
            )}

            {isEnded && isTopBidder && (
              <>
                <Divider />
                {hasAuctionPayment ? (
                  <Center>
                    <Badge variant="secondary">{t.auction.auctionPaid}</Badge>
                  </Center>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleAuctionPayment}
                    disabled={isPayingAuction}
                  >
                    {isPayingAuction ? t.pay.transferring : t.auction.auctionPayment}
                  </Button>
                )}
              </>
            )}

            {!isEnded && (
              <>
                <Divider />
                <Stack gap="sm">
                  <Text fw={600}>{t.auction.placeBid}</Text>
                  <Text size="sm" c="dimmed">
                    {t.auction.minimumBid}: {minBidPrice.toLocaleString()}{t.common.won} {t.auction.orMore}
                  </Text>
                  <Group gap="sm" wrap="nowrap" align="flex-end">
                    <Box style={{ flex: 1 }}>
                      <Input
                        type="number"
                        value={bidPrice}
                        onChange={(e) => setBidPrice(e.currentTarget.value)}
                        placeholder={t.auction.enterBidAmount.replace('{price}', minBidPrice.toLocaleString())}
                        min={minBidPrice}
                      />
                    </Box>
                    <Button
                      variant="primary"
                      onClick={handleBid}
                      disabled={isBidding}
                      style={{ whiteSpace: 'nowrap', minWidth: 120 }}
                    >
                      {isBidding ? t.auction.bidding : t.auction.bid}
                    </Button>
                  </Group>
                </Stack>
              </>
            )}
          </Stack>
        </DetailSection>
      )}
    </>
  );
}
