import ProductForm from '@/features/product/components/form/ProductForm';
import { useTranslation } from '@/shared/i18n';
import { useAuctionDetail } from '@/features/auction/hooks/AuctionDetailContext';

export function AuctionProductEditForm() {
  const t = useTranslation();
  const { product, handleEdit, cancelEditing, isUpdating } = useAuctionDetail();

  if (!product) return null;

  return (
    <ProductForm
      initialData={{ ...product, content: product.content ?? undefined }}
      onSubmit={handleEdit}
      onCancel={cancelEditing}
      submitLabel={t.common.save}
      showIsSold={true}
      isLoading={isUpdating}
    />
  );
}
