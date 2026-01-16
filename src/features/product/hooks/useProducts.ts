import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById, Product } from '@/features/product/api/productApi';

export type { Product } from '@/features/product/api/productApi';

export function useProducts(selectedCategory?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: fetchProducts,
  });

  // 클라이언트 사이드 카테고리 필터링
  const filteredProducts = data?.filter((product: Product) => {
    if (!selectedCategory || selectedCategory === 'all') return true;
    return product.categoryId === selectedCategory;
  }) ?? [];

  return {
    products: filteredProducts,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}

export function useProduct(id: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  return {
    product: data || null,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}
