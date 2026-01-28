import { createContext, useContext, type ReactNode } from 'react';
import { useAuctionDetailLogic } from './useAuctionDetailLogic';
import { Loading, ErrorMessage, EmptyState } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

type AuctionDetailContextType = ReturnType<typeof useAuctionDetailLogic>;

const AuctionDetailContext = createContext<AuctionDetailContextType | null>(null);

interface AuctionDetailProviderProps {
  auctionId: string;
  children: ReactNode;
}

export function AuctionDetailProvider({ auctionId, children }: AuctionDetailProviderProps) {
  const t = useTranslation();
  const logic = useAuctionDetailLogic(auctionId);

  if (logic.auctionLoading) return <Loading />;
  if (logic.auctionError) return <ErrorMessage message={t.auction.notFound} />;
  if (!logic.auction) return <EmptyState message={t.auction.notFound} />;

  return (
    <AuctionDetailContext.Provider value={logic}>
      {children}
    </AuctionDetailContext.Provider>
  );
}

export function useAuctionDetail() {
  const context = useContext(AuctionDetailContext);
  if (!context) {
    throw new Error('useAuctionDetail must be used within AuctionDetailProvider');
  }
  return context;
}
