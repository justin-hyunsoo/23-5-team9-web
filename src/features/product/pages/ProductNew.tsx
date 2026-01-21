import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/features/user/hooks/useUser";
import { useCreateProduct } from "@/features/product/hooks/useProducts";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Button, DetailHeader, DetailSection, Input, LoginRequired, OnboardingRequired } from '@/shared/ui';

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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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

      <DetailSection className="mb-4">
        <h2 className="text-2xl font-bold text-text-heading">새 상품 등록</h2>
      </DetailSection>

      <DetailSection>
        <form onSubmit={handleSubmit}>
          {/* 제목 */}
          <div className="mb-6">
            <label className="block text-sm text-text-secondary mb-2">제목</label>
            <Input
              type="text"
              value={formState.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="상품 제목을 입력하세요"
            />
          </div>

          {/* 가격 */}
          <div className="mb-6">
            <label className="block text-sm text-text-secondary mb-2">가격 (원)</label>
            <Input
              type="number"
              value={formState.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="가격을 입력하세요"
              min="0"
            />
          </div>

          {/* 내용 (상단 구분선) */}
          <div className="mt-6 border-t border-border-base pt-6">
            <label className="block text-sm text-text-secondary mb-2">상품 설명</label>
            <textarea
              value={formState.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={6}
              className="w-full rounded-xl bg-bg-page border border-border-medium p-4 text-base outline-none transition-all placeholder:text-text-placeholder focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              placeholder="상품 설명을 입력하세요"
            />
          </div>
        </form>
      </DetailSection>

      {/* 하단 버튼 */}
      <div className="mt-6 flex gap-3">
        <Button size="lg" fullWidth variant="secondary" onClick={() => navigate(-1)}>
          취소
        </Button>
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={isPending}>
          {isPending ? '등록 중...' : '상품 등록'}
        </Button>
      </div>
    </PageContainer>
  );
}

export default ProductNew;
