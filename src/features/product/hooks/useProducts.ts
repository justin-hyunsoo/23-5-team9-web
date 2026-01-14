import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById } from '@/features/product/api/productApi';

export interface Product {
  id: number;
  ownerId: number;
  title: string;
  category: string;
  categoryId: number;
  content: string;
  price: number;
  likeCount: number;
  location: string; // Added for UI consistency with PostCard
  imageUrl: string | null; // Added for UI
  createdAt: string; // Added for UI
}

export function useProducts(selectedLocation?: string) {
  // useQuery(쿼리키, 패치함수)
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', selectedLocation], // 키가 바뀌면 자동 재요청됨 (의존성 배열 역할)
    queryFn: () => fetchProducts(selectedLocation),
  });

  return { 
    products: data ?? [], // 데이터가 없을 때(로딩중) 빈 배열 반환
    loading: isLoading, 
    error: error ? (error as Error).message : null 
  };
}

export function useProduct(id: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });

  return { 
    product: data || null, 
    loading: isLoading, 
    error: error ? (error as Error).message : null 
  };
}
