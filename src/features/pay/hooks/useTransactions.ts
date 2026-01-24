import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { payApi, PayTransaction } from '@/features/pay/api/payApi';

const ITEMS_PER_PAGE = 10;

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (offset: number) => [...transactionKeys.all, 'list', offset] as const,
};

export function useTransactions() {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();
  const [offset, setOffset] = useState(0);
  const [allTransactions, setAllTransactions] = useState<PayTransaction[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { isLoading, error, refetch } = useQuery({
    queryKey: transactionKeys.list(offset),
    queryFn: async () => {
      const { data } = await payApi.getTransactions({
        limit: ITEMS_PER_PAGE,
        offset,
      });

      if (offset === 0) {
        setAllTransactions(data);
      } else {
        setAllTransactions((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === ITEMS_PER_PAGE);
      return data;
    },
    enabled: !!token,
    staleTime: 1000 * 60,
  });

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setOffset((prev) => prev + ITEMS_PER_PAGE);
    }
  };

  const invalidate = () => {
    setOffset(0);
    setAllTransactions([]);
    setHasMore(true);
    queryClient.invalidateQueries({ queryKey: transactionKeys.all });
  };

  return {
    transactions: allTransactions,
    isLoading,
    error,
    refetch,
    invalidate,
    loadMore,
    hasMore,
  };
}
