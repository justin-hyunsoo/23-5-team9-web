import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/features/user/hooks/useUser";
import { useCreateProduct } from "@/features/product/hooks/useProducts";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Button, DetailHeader, DetailSection, LoginRequired, OnboardingRequired } from '@/shared/ui';

function ProductNew() {
  const navigate = useNavigate();
  const { isLoggedIn, needsOnboarding } = useUser();
  const createProduct = useCreateProduct();

  const [formState, setFormState] = useState({
    title: '',
    content: '',
    price: '',
  });

  const isPending = createProduct.isPending;

  if (!isLoggedIn) {
    return (
      <PageContainer>
        <DetailHeader />
        <LoginRequired />
      </PageContainer>
    );
  }

  if (needsOnboarding) {
    return (
      <PageContainer>
        <DetailHeader />
        <OnboardingRequired />
      </PageContainer>
    );
  }

  const handleSubmit = async () => {
    const { title, content, price } = formState;

    if (!title.trim() || !content.trim() || !price) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        price: Number(price),
        category_id: '1',
      };

      const newProduct = await createProduct.mutateAsync(payload);
      alert('상품이 등록되었습니다.');
      navigate(`/products/${newProduct.id}`);
    } catch {
      alert('상품 등록에 실패했습니다.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageContainer>
      <DetailHeader />

      {/* 상품 상세 정보 - ProductDetail 편집 모드와 동일한 디자인 */}
      <DetailSection>
        {/* 제목 */}
        <input
          type="text"
          value={formState.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="상품 제목을 입력하세요"
          className="w-full text-2xl font-bold text-text-heading bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 mb-2"
        />

        {/* 가격 */}
        <div className="flex items-baseline gap-1 mb-6">
          <input
            type="number"
            value={formState.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="가격"
            min="0"
            className="text-3xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
          />
          <span className="text-3xl font-bold text-primary">원</span>
        </div>

        {/* 본문 (상단 구분선) */}
        <div className="mt-6 border-t border-border-base pt-6">
          <textarea
            value={formState.content}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={6}
            className="w-full bg-transparent text-text-body leading-relaxed outline-none border-b border-dashed border-border-medium focus:border-primary resize-none"
            placeholder="상품 설명을 입력하세요"
          />
        </div>

        {/* 하단 버튼 - 좋아요 위치에 취소/등록 버튼 */}
        <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isPending}>
              {isPending ? '등록 중...' : '등록'}
            </Button>
          </div>
        </div>
      </DetailSection>
    </PageContainer>
  );
}

export default ProductNew;
