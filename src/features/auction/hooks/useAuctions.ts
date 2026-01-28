import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { auctionApi, AuctionListParams } from '../api/auction';
import { fetchRegionById } from '@/features/location/api/region';
import type { AuctionResponse, CreateAuctionRequest, PlaceBidRequest } from '../types';

export const auctionKeys = {
  all: ['auctions'] as const,
  lists: () => [...auctionKeys.all, 'list'] as const,
  list: (filters: AuctionListParams) => [...auctionKeys.lists(), filters] as const,
  details: () => [...auctionKeys.all, 'detail'] as const,
  detail: (id: string) => [...auctionKeys.details(), id] as const,
};

// 지역 정보 캐시 (region_id -> { sido, sigugun, dong })
const regionCache: Map<string, { sido: string; sigugun: string; dong: string }> = new Map();

// 지역 정보 가져오기 (캐시 활용)
async function getRegionInfo(regionId: string): Promise<{ sido: string; sigugun: string; dong: string } | null> {
  if (regionCache.has(regionId)) {
    return regionCache.get(regionId)!;
  }

  try {
    const region = await fetchRegionById(regionId);
    const info = { sido: region.sido, sigugun: region.sigugun, dong: region.dong };
    regionCache.set(regionId, info);
    return info;
  } catch {
    return null;
  }
}

export function useAuctions(options: { categoryId?: string; regionId?: string; sido?: string; sigugun?: string } = {}) {
  const { categoryId, regionId, sido, sigugun } = options;
  const [filteredAuctions, setFilteredAuctions] = useState<AuctionResponse[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // 동 단위 필터는 서버에서 처리
  const params: AuctionListParams = {
    category_id: categoryId === 'all' ? undefined : categoryId,
    region_id: regionId,  // 동 단위일 때만 서버 필터 사용
  };

  const queryInfo = useQuery({
    queryKey: auctionKeys.list(params),
    queryFn: () => auctionApi.getList(params, true),
  });

  // 시/도 또는 시/구/군 필터링 (프론트엔드에서 처리)
  useEffect(() => {
    const filterAuctions = async () => {
      const auctions = queryInfo.data ?? [];

      // 동 단위 필터가 있거나, 시/도 필터가 없으면 필터링 불필요
      if (regionId || (!sido && !sigugun)) {
        setFilteredAuctions(auctions);
        setIsFiltering(false);
        return;
      }

      setIsFiltering(true);

      // 각 경매 상품의 지역 정보를 가져와서 필터링
      const filtered: AuctionResponse[] = [];

      for (const auction of auctions) {
        const productRegionId = auction.product?.region_id;
        if (!productRegionId) continue;

        const regionInfo = await getRegionInfo(productRegionId);
        if (!regionInfo) continue;

        // 시/도 + 시/구/군 필터
        if (sido && sigugun) {
          if (regionInfo.sido === sido && regionInfo.sigugun === sigugun) {
            filtered.push(auction);
          }
        }
        // 시/도만 필터
        else if (sido) {
          if (regionInfo.sido === sido) {
            filtered.push(auction);
          }
        }
      }

      setFilteredAuctions(filtered);
      setIsFiltering(false);
    };

    if (!queryInfo.isLoading && queryInfo.data) {
      filterAuctions();
    }
  }, [queryInfo.data, queryInfo.isLoading, regionId, sido, sigugun]);

  return {
    auctions: filteredAuctions,
    loading: queryInfo.isLoading || isFiltering,
    error: queryInfo.error as Error | null,
    refetch: queryInfo.refetch,
  };
}

export function useAuction(auctionId: string) {
  const queryInfo = useQuery({
    queryKey: auctionKeys.detail(auctionId),
    queryFn: () => auctionApi.getById(auctionId),
    enabled: !!auctionId,
  });

  return {
    auction: queryInfo.data,
    loading: queryInfo.isLoading,
    error: queryInfo.error as Error | null,
    refetch: queryInfo.refetch,
  };
}

export function useCreateAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAuctionRequest) => auctionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
  });
}

export function usePlaceBid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auctionId, data }: { auctionId: string; data: PlaceBidRequest }) =>
      auctionApi.placeBid(auctionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(variables.auctionId) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
  });
}
