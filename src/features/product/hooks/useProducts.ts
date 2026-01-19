import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from '@/features/product/api/productApi';

export type { Product, CreateProductRequest, UpdateProductRequest, DeleteProductRequest } from '@/features/product/api/productApi';

export function useProducts(selectedCategory?: string, searchQuery?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const filteredProducts = data?.filter((product: Product) => {
    // 카테고리 필터
    if (selectedCategory && selectedCategory !== 'all') {
      if (product.category_id !== selectedCategory) return false;
    }
    // 검색 필터
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesTitle = product.title.toLowerCase().includes(query);
      const matchesContent = product.content.toLowerCase().includes(query);
      if (!matchesTitle && !matchesContent) return false;
    }
    return true;
  }) ?? [];

  return {
    products: filteredProducts,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}

// 내 상품 목록 조회
export function useMyProducts(options?: { enabled?: boolean }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myProducts'],
    queryFn: fetchMyProducts,
    enabled: options?.enabled ?? true,
  });

  return {
    products: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}

// 상품 등록
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
    },
  });
}

// 상품 수정
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
    },
  });
}

// 상품 삭제
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
    },
  });
}
