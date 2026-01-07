import { useState, useEffect } from 'react';

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

export const LOCATIONS = [
  { value: 'all', label: '전체 지역' },
  { value: '역삼동', label: '역삼동' },
  { value: '반포동', label: '반포동' },
  { value: '잠실동', label: '잠실동' },
  { value: '신림동', label: '신림동' },
  { value: '선릉동', label: '선릉동' },
  { value: '청담동', label: '청담동' },
  { value: '압구정동', label: '압구정동' }
];

const MOCK_PRODUCTS: Product[] = [
  // 역삼동 상품들
  {
    id: 1,
    ownerId: 101,
    title: "아이폰 14 프로 맥스 팝니다",
    category: "디지털기기",
    categoryId: 1,
    content: "배터리 효율 90%입니다. 쿨거래시 네고 가능합니다.",
    price: 1200000,
    likeCount: 5,
    location: "서울 강남구 역삼동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-01T10:00:00Z"
  },
  {
    id: 5,
    ownerId: 105,
    title: "맥북 프로 13인치 M1",
    category: "디지털기기",
    categoryId: 1,
    content: "2021년형 맥북 프로 팝니다. 상태 좋아요.",
    price: 1500000,
    likeCount: 12,
    location: "서울 강남구 역삼동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-05T14:20:00Z"
  },
  {
    id: 6,
    ownerId: 106,
    title: "에어팟 프로 2세대",
    category: "디지털기기",
    categoryId: 1,
    content: "사용감 거의 없어요. 박스 포함입니다.",
    price: 250000,
    likeCount: 8,
    location: "서울 강남구 역삼동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-06T09:30:00Z"
  },
  {
    id: 7,
    ownerId: 107,
    title: "책상 의자 팝니다",
    category: "가구/인테리어",
    categoryId: 3,
    content: "사무용 의자입니다. 편안해요.",
    price: 80000,
    likeCount: 4,
    location: "서울 강남구 역삼동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-07T11:00:00Z"
  },
  // 반포동 상품들
  {
    id: 2,
    ownerId: 102,
    title: "자전거 팝니다",
    category: "스포츠/레저",
    categoryId: 2,
    content: "거의 안 탔습니다. 상태 좋아요.",
    price: 150000,
    likeCount: 2,
    location: "서울 서초구 반포동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-02T11:30:00Z"
  },
  {
    id: 8,
    ownerId: 108,
    title: "아이패드 에어 5세대",
    category: "디지털기기",
    categoryId: 1,
    content: "거의 새것입니다. 펜슬 포함.",
    price: 700000,
    likeCount: 15,
    location: "서울 서초구 반포동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-08T16:45:00Z"
  },
  // 잠실동 상품들
  {
    id: 3,
    ownerId: 103,
    title: "원목 식탁 의자 세트",
    category: "가구/인테리어",
    categoryId: 3,
    content: "이사가게 되어 내놓습니다. 직접 가져가셔야 해요.",
    price: 50000,
    likeCount: 10,
    location: "서울 송파구 잠실동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-03T09:15:00Z"
  },
  {
    id: 9,
    ownerId: 109,
    title: "삼성 갤럭시 버즈2",
    category: "디지털기기",
    categoryId: 1,
    content: "사용감 적고 상태 좋아요.",
    price: 120000,
    likeCount: 6,
    location: "서울 송파구 잠실동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-09T10:20:00Z"
  },
  // 신림동 상품들
  {
    id: 4,
    ownerId: 104,
    title: "나이키 운동화 270",
    category: "남성패션/잡화",
    categoryId: 4,
    content: "사이즈 미스로 팝니다. 박스 포함 새상품입니다.",
    price: 80000,
    likeCount: 3,
    location: "서울 관악구 신림동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-03T14:20:00Z"
  },
  {
    id: 10,
    ownerId: 110,
    title: "게이밍 의자",
    category: "가구/인테리어",
    categoryId: 3,
    content: "게이밍 의자 팝니다. 편안해요.",
    price: 100000,
    likeCount: 7,
    location: "서울 관악구 신림동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-10T13:15:00Z"
  },
  // 선릉동 상품들
  {
    id: 11,
    ownerId: 111,
    title: "아이폰 15 프로",
    category: "디지털기기",
    categoryId: 1,
    content: "최신형 아이폰 팝니다. 상태 최상입니다.",
    price: 1300000,
    likeCount: 20,
    location: "서울 강남구 선릉동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-11T15:30:00Z"
  },
  {
    id: 12,
    ownerId: 112,
    title: "노트북 가방",
    category: "남성패션/잡화",
    categoryId: 4,
    content: "브랜드 노트북 가방 팝니다.",
    price: 50000,
    likeCount: 3,
    location: "서울 강남구 선릉동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-12T09:00:00Z"
  },
  // 청담동 상품들
  {
    id: 13,
    ownerId: 113,
    title: "명품 가방",
    category: "여성패션/잡화",
    categoryId: 4,
    content: "명품 가방 팝니다. 상태 좋아요.",
    price: 500000,
    likeCount: 18,
    location: "서울 강남구 청담동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-13T11:20:00Z"
  },
  // 압구정동 상품들
  {
    id: 14,
    ownerId: 114,
    title: "스탠드 조명",
    category: "가구/인테리어",
    categoryId: 3,
    content: "인테리어 조명 팝니다.",
    price: 60000,
    likeCount: 5,
    location: "서울 강남구 압구정동",
    imageUrl: "https://via.placeholder.com/150",
    createdAt: "2024-01-14T14:40:00Z"
  }
];

export function useProducts(selectedLocation?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredProducts = [...MOCK_PRODUCTS];
        
        // 지역 필터링
        if (selectedLocation && selectedLocation !== 'all') {
          filteredProducts = MOCK_PRODUCTS.filter(product => 
            product.location.includes(selectedLocation)
          );
        }
        
        // 최신순 정렬
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setProducts(filteredProducts);
      } catch (err) {
        setError('상품 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedLocation]);

  return { products, loading, error };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!id) throw new Error('Invalid ID');
        const found = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
        if (!found) throw new Error('Product not found');
        setProduct(found);
      } catch (err) {
        setError('상품을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
