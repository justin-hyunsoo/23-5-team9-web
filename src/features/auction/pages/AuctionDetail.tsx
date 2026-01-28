import { useParams } from 'react-router-dom';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { DetailHeader, DetailSection } from '@/shared/ui';
import { AuctionDetailProvider, useAuctionDetail } from '@/features/auction/hooks/AuctionDetailContext';
import { AuctionSellerSection } from '@/features/auction/components/detail/AuctionSellerSection';
import { AuctionProductView } from '@/features/auction/components/detail/AuctionProductView';
import { AuctionProductEditForm } from '@/features/auction/components/detail/AuctionProductEditForm';
import { AuctionInfoSection } from '@/features/auction/components/detail/AuctionInfoSection';
import { AuctionBidSection } from '@/features/auction/components/detail/AuctionBidSection';

function AuctionDetailContent() {
  const { isEditing } = useAuctionDetail();

  return (
    <PageContainer>
      <DetailHeader />

      {/* Seller Section - same as ProductDetail */}
      <DetailSection className="mb-4">
        <AuctionSellerSection />
      </DetailSection>

      {/* Product View Section - images, title, price, content (similar to ProductDetailView) */}
      <DetailSection className="mb-4">
        {isEditing ? <AuctionProductEditForm /> : <AuctionProductView />}
      </DetailSection>

      {/* Auction Info Section - auction specific (status, time, prices) */}
      <DetailSection className="mb-4">
        <AuctionInfoSection />
      </DetailSection>

      {/* Bid Section - auction specific */}
      <DetailSection>
        <AuctionBidSection />
      </DetailSection>
    </PageContainer>
  );
}

export default function AuctionDetail() {
  const { id } = useParams();

  return (
    <AuctionDetailProvider auctionId={id!}>
      <AuctionDetailContent />
    </AuctionDetailProvider>
  );
}
