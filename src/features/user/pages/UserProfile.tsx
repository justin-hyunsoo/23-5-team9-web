import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/features/user/hooks/useUser";
import { useUserProducts, useCreateProduct } from "@/features/product/hooks/useProducts";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Loading, EmptyState, Button, DetailHeader, DetailSection, Avatar } from '@/shared/ui';
import ProductCard from "@/features/product/components/ProductCard";
import { LoginRequired, OnboardingRequired } from '@/shared/ui';

// ----------------------------------------------------------------------
// Main Component: UserProfile (only /user/me is allowed)
// ----------------------------------------------------------------------

function UserProfile() {
  const navigate = useNavigate();

  // Hooks - only for current user (me)
  const { user, isLoggedIn, needsOnboarding, isLoading: userLoading } = useUser();
  const { products, loading: productsLoading } = useUserProducts('me');
  const createProduct = useCreateProduct();

  // UI state
  const [showForm, setShowForm] = useState(false);

  // Form state for new product
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    price: '',
  });

  const isPending = createProduct.isPending;

  // Handlers
  const handleProfileEditClick = () => {
    navigate('/my/profile');
  };

  const handleChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

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
      setFormState({ title: '', content: '', price: '' });
      setShowForm(false);
      navigate(`/products/${newProduct.id}`);
    } catch {
      alert('상품 등록에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setFormState({ title: '', content: '', price: '' });
    setShowForm(false);
  };

  // Auth checks
  if (!isLoggedIn) {
    return (
      <PageContainer title="중고거래">
        <LoginRequired/>
      </PageContainer>
    );
  }

  if (needsOnboarding) {
    return (
      <PageContainer title="중고거래">
        <OnboardingRequired />
      </PageContainer>
    );
  }

  // Loading
  if (userLoading || productsLoading) return <Loading />;
  if (!user) return <EmptyState message="사용자를 찾을 수 없습니다." />;

  return (
    <PageContainer>
      <DetailHeader />

      {/* 프로필 정보 - 가운데 정렬 */}
      <DetailSection>
        <div className="flex flex-col items-center py-6">
          <Avatar
            src={user.profile_image || undefined}
            alt={user.nickname || '사용자'}
            size="lg"
          />
          <div className="mt-4 text-center">
            <div className="text-xl font-semibold text-text-heading">{user.nickname || '알 수 없음'}</div>
            <div className="text-sm text-text-secondary">내 프로필</div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-6">
            <Button size="sm" variant="secondary" onClick={handleProfileEditClick}>
              프로필 수정
            </Button>
            <Button size="sm" onClick={() => setShowForm(true)}>
              + 상품 등록
            </Button>
          </div>
        </div>
      </DetailSection>

      {/* 상품 등록 폼 - 버튼 클릭 시에만 표시 */}
      {showForm && (
        <DetailSection className="mt-6">
          <h3 className="text-lg font-bold mb-4">새 상품 등록</h3>

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

          {/* 하단 버튼 */}
          <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleCancel}>
                취소
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={isPending}>
                {isPending ? '등록 중...' : '등록'}
              </Button>
            </div>
          </div>
        </DetailSection>
      )}

      {/* 판매 상품 섹션 */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">나의 판매 물품</h3>

        {products.length === 0 ? (
          <EmptyState message="판매 중인 상품이 없습니다." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default UserProfile;
