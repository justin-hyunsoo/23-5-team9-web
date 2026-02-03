import { useState, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useProducts } from "@/features/product/hooks/useProducts";
import { productApi } from "@/features/product/api/product";
import { EmptyState, Loading, Pagination } from '@/shared/ui';
import ProductCard from "@/features/product/components/list/ProductCard";
import { useTranslation } from '@/shared/i18n';
import { useUser } from '@/features/user/hooks/useUser';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { OnboardingRequired } from '@/shared/ui';

const ITEMS_PER_PAGE = 8;

const MyBidsTab = () => {
  const t = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const { user, needsOnboarding } = useUser();

  // 1. Fetch all auction products
  const { products: auctionProducts, loading: productsLoading } = useProducts({ auction: true });

  // 2. Fetch product details to get auction IDs
  const productDetailQueries = useQueries({
    queries: (auctionProducts ?? []).map(product => ({
      queryKey: ['products', 'detail', product.id],
      queryFn: () => productApi.getById(product.id),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const productDetails = productDetailQueries.map(q => q.data).filter(Boolean);
  const productDetailsLoading = productDetailQueries.some(q => q.isLoading);

  // 3. Fetch top bidder for each auction
  const topBidQueries = useQueries({
    queries: productDetails
      .filter(p => p?.auction?.id)
      .map(product => ({
        queryKey: ['auction', 'topBid', product!.auction!.id],
        queryFn: () => productApi.getTopBid(product!.auction!.id),
        staleTime: 1000 * 30,
      })),
  });

  const topBidsLoading = topBidQueries.some(q => q.isLoading);

  // 4. Filter products where current user is top bidder
  const winningAuctions = useMemo(() => {
    if (!user?.id) return [];

    return productDetails.filter(product => {
      if (!product?.auction?.id) return false;

      const topBidQuery = topBidQueries.find(
        q => q.data?.auction_id === product.auction!.id
      );

      return topBidQuery?.data?.bidder_id === user.id;
    });
  }, [productDetails, topBidQueries, user?.id]);

  const paginatedAuctions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return winningAuctions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [winningAuctions, currentPage]);

  const totalPages = Math.ceil(winningAuctions.length / ITEMS_PER_PAGE);

  if (needsOnboarding) {
    return (
      <PageContainer>
        <OnboardingRequired />
      </PageContainer>
    );
  }

  const isLoading = productsLoading || productDetailsLoading || topBidsLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold mb-4">{t.auction.myBids}</h3>
        {winningAuctions.length === 0 ? (
          <EmptyState message={t.auction.noMyBids} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedAuctions.map(product => (
                <ProductCard key={product!.id} product={product!} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyBidsTab;
