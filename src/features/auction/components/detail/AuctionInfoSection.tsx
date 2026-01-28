import { Badge } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';
import { useAuctionDetail } from '@/features/auction/hooks/AuctionDetailContext';

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

export function AuctionInfoSection() {
  const t = useTranslation();
  const { language } = useLanguage();
  const { auction, isEnded, remainingTime } = useAuctionDetail();

  if (!auction) return null;

  return (
    <div className="space-y-4">
      {/* Auction Status */}
      <div className="flex items-center justify-between">
        <Badge variant={isEnded ? 'secondary' : 'primary'}>
          {isEnded ? t.auction.auctionEnded : t.auction.active}
        </Badge>
        {!isEnded && (
          <span className="text-status-error font-bold">{remainingTime} {t.auction.remaining}</span>
        )}
      </div>

      {/* End Time */}
      <p className="text-sm text-text-muted">
        {t.auction.endTime}: {formatDateTime(auction.end_at, language)}
      </p>

      {/* Price Info */}
      <div className="bg-bg-secondary rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-muted">{t.auction.startingPrice}</span>
          <span className="text-text-body">{auction.starting_price.toLocaleString()}{t.common.won}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-muted">{t.auction.currentPrice}</span>
          <span className="text-2xl font-bold text-primary">{auction.current_price.toLocaleString()}{t.common.won}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-muted">{t.auction.bidCount}</span>
          <span className="text-text-body">{t.auction.bidsCount.replace('{count}', String(auction.bid_count))}</span>
        </div>
      </div>
    </div>
  );
}
