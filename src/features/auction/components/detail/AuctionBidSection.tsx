import { Input, Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useAuctionDetail } from '@/features/auction/hooks/AuctionDetailContext';

export function AuctionBidSection() {
  const t = useTranslation();
  const { isEnded, bidPrice, setBidPrice, minBidPrice, handleBid, isBidding } = useAuctionDetail();

  if (isEnded) return null;

  return (
    <div className="border border-border-base rounded-lg p-4">
      <h3 className="font-semibold mb-3">{t.auction.placeBid}</h3>
      <p className="text-sm text-text-muted mb-3">
        {t.auction.minimumBid}: {minBidPrice.toLocaleString()}{t.common.won} {t.auction.orMore}
      </p>
      <div className="flex gap-2">
        <Input
          type="number"
          value={bidPrice}
          onChange={(e) => setBidPrice(e.target.value)}
          placeholder={t.auction.enterBidAmount.replace('{price}', minBidPrice.toLocaleString())}
          min={minBidPrice}
          className="flex-1"
        />
        <Button
          variant="primary"
          onClick={handleBid}
          disabled={isBidding}
          className="whitespace-nowrap min-w-[70px]"
        >
          {isBidding ? t.auction.bidding : t.auction.bid}
        </Button>
      </div>
    </div>
  );
}
