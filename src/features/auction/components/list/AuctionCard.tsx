import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { AuctionResponse } from '../../types';
import { Card, CardContent, CardImage, CardTitle, Badge } from '@/shared/ui';
import { imageApi, ImageUploadResponse } from '@/features/product/api/imageApi';
import { useTranslation } from '@/shared/i18n';

interface AuctionCardProps {
  auction: AuctionResponse;
}

type TimeTranslations = {
  timeEnded: string;
  days: string;
  hours: string;
  minutes: string;
  remaining: string;
};

function formatRemainingTime(endAt: string, t: TimeTranslations): string {
  const now = new Date();
  const end = new Date(endAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return t.timeEnded;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}${t.days} ${hours}${t.hours} ${t.remaining}`;
  if (hours > 0) return `${hours}${t.hours} ${minutes}${t.minutes} ${t.remaining}`;
  return `${minutes}${t.minutes} ${t.remaining}`;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const t = useTranslation();

  const formatPrice = (price: number) => `${price.toLocaleString()}${t.common.won}`;

  const timeTranslations = useMemo(() => ({
    timeEnded: t.auction.timeEnded,
    days: t.auction.days,
    hours: t.auction.hours,
    minutes: t.auction.minutes,
    remaining: t.auction.remaining,
  }), [t]);

  const firstImageId = useMemo(
    () => (auction.product.image_ids && auction.product.image_ids.length > 0 ? auction.product.image_ids[0] : undefined),
    [auction.product.image_ids]
  );

  const { data: firstImage } = useQuery<ImageUploadResponse | null>({
    queryKey: ['product', 'image', firstImageId],
    queryFn: async () => (firstImageId ? await imageApi.getById(firstImageId) : null),
    enabled: !!firstImageId,
  });

  const isEnded = auction.status !== 'active';
  const remainingTime = formatRemainingTime(auction.end_at, timeTranslations);

  return (
    <Link to={`/auction/${auction.id}`} className="group text-inherit no-underline">
      <Card className="border border-border-medium rounded-lg p-3">
        <CardContent>
          {/* Auction status badge */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant={isEnded ? 'secondary' : 'primary'} className="text-xs">
              {isEnded ? t.auction.ended : t.auction.inProgress}
            </Badge>
            {!isEnded && (
              <span className="text-xs text-status-error font-medium">{remainingTime}</span>
            )}
          </div>

          {/* Product image */}
          {auction.product.image_ids && auction.product.image_ids.length > 0 && (
            <CardImage src={firstImage?.image_url ?? undefined} alt={auction.product.title} aspectRatio="square" />
          )}

          <CardTitle className="tracking-tighter break-keep text-text-heading">
            {auction.product.title}
          </CardTitle>
          <p className="text-sm text-text-muted line-clamp-2 mb-2">{auction.product.content}</p>

          {/* Price info */}
          <div className="space-y-1">
            <div className="text-xs text-text-muted">
              {t.auction.startingPrice}: {formatPrice(auction.starting_price)}
            </div>
            <div className="text-[15px] font-extrabold text-primary">
              {t.auction.currentPrice}: {formatPrice(auction.current_price)}
            </div>
          </div>

          {/* Bid count */}
          <div className="mt-2 text-xs text-text-secondary">
            {t.auction.bidsCount.replace('{count}', String(auction.bid_count))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
