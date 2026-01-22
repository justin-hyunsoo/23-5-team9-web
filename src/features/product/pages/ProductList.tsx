import { useState } from 'react';
import ProductCard from "@/features/product/components/ProductCard";
import { useProducts } from "@/features/product/hooks/useProducts";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";

// ----------------------------------------------------------------------
// 1. Sub-components (Logic & UI Separation)
// ----------------------------------------------------------------------

/**
 * 검색 바 컴포넌트
 */
const SearchBar = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) => {
  return (
    <div className="flex items-center bg-bg-page border border-border-medium rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 w-[300px] sm:w-[400px]">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="검색어를 입력해주세요"
        className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-text-primary placeholder:text-text-placeholder"
      />
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Hooks
// ----------------------------------------------------------------------

/**
 * 상품 데이터 로딩 및 필터링 로직 (전체 상품만 조회)
 */
const useProductFilterLogic = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 전체 상품 조회
  const { products, loading, error } = useProducts(undefined, searchQuery);

  return {
    products,
    loading,
    error,
    searchQuery, setSearchQuery
  };
};

// ----------------------------------------------------------------------
// 3. Main Components
// ----------------------------------------------------------------------

function ProductList() {
  // 데이터 & 필터 훅 (단순화됨)
  const {
    products, loading, error,
    searchQuery, setSearchQuery
  } = useProductFilterLogic();

  return (
    <PageContainer title="중고거래">
      <div className="mb-6 flex justify-center">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <DataListLayout
        isLoading={loading}
        error={error}
        isEmpty={products.length === 0}
        emptyMessage={searchQuery ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              // showActions, onEdit, onDelete 제거 (관리 기능은 프로필 페이지로 위임)
            />
          ))}
        </div>
      </DataListLayout>
    </PageContainer>
  );
}

export default ProductList;