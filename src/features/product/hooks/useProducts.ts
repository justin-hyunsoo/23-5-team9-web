import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  fetchProduct, fetchProducts, fetchUserProducts,
  createProduct, updateProduct, deleteProduct,
  Product, UpdateProductRequest
} from '@/features/product/api/productApi';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  listByRegion: (regionId?: string) => [...productKeys.lists(), 'region', regionId ?? 'all'] as const,
  listBySeller: (userId: string) => [...productKeys.lists(), 'seller', userId] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (productId: string) => [...productKeys.details(), productId] as const,
};

// 필터링 로직
export function isProductMatched(product: Product, category?: string, search?: string): boolean {
  if (category && category !== 'all' && product.category_id !== category) return false;
  if (search?.trim()) {
    const q = search.toLowerCase().trim();
    if (!product.title.toLowerCase().includes(q) && !product.content.toLowerCase().includes(q)) return false;
  }
  return true;
}

// 공통 반환 타입 헬퍼
const toResult = (data: Product[] | undefined, isLoading: boolean, error: Error | null, category?: string, search?: string) => ({
  products: data?.filter(p => isProductMatched(p, category, search)) ?? [],
  loading: isLoading,
  error: error?.message ?? null,
});

// 통합 훅: regionId 또는 userId 기반 상품 조회
export function useProductsQuery(options: { regionId?: string; userId?: string; category?: string; search?: string } = {}) {
  const { regionId, userId, category, search } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: userId ? productKeys.listBySeller(userId) : productKeys.listByRegion(regionId),
    queryFn: () => userId ? fetchUserProducts(userId) : fetchProducts(regionId),
    enabled: userId ? !!userId : true,
  });

  return useMemo(() => toResult(data, isLoading, error, category, search), [data, isLoading, error, category, search]);
}

// 기존 API 호환용 래퍼
export const useProducts = (category?: string, search?: string, regionId?: string) =>
  useProductsQuery({ regionId, category, search });

export const useUserProducts = (userId: string, category?: string, search?: string) =>
  useProductsQuery({ userId, category, search });

// 상품 단건 조회
export function useProduct(productId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => fetchProduct(productId),
  });
  return { product: data, loading: isLoading, error: error?.message ?? null };
}

// 상품 등록
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
  });
}

// 상품 수정
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) => updateProduct(id, data),
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(p.id) });
    },
  });
}

// 상품 삭제
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
  });
}
