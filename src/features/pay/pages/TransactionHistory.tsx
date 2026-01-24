import { useTransactions } from '@/features/pay/hooks/useTransactions';
import { PayTransaction } from '@/features/pay/api/payApi';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Button, DetailHeader, Avatar } from '@/shared/ui';
import { useUser } from '@/features/user/hooks/useUser';
import { OnboardingRequired } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

interface TransactionItemProps {
  tx: PayTransaction;
  currentUserId?: string;
  t: ReturnType<typeof useTranslation>;
}

const TransactionItem = ({ tx, currentUserId, t }: TransactionItemProps) => {
  const isTransfer = tx.type === 'TRANSFER';
  const isSender = isTransfer && tx.details.user.id === currentUserId;

  const getTransactionInfo = () => {
    if (tx.type === 'DEPOSIT') {
      return { label: t.pay.charge, icon: '↓', isPositive: true };
    }
    if (tx.type === 'WITHDRAW') {
      return { label: t.pay.withdraw, icon: '↑', isPositive: false };
    }
    // TRANSFER
    if (isSender) {
      return { label: t.pay.transfer, icon: '→', isPositive: false };
    }
    return { label: t.pay.received, icon: '←', isPositive: true };
  };

  const { label, icon, isPositive } = getTransactionInfo();

  // For transfer, show the other party's info
  const otherParty = isTransfer
    ? (isSender ? tx.details.receive_user : tx.details.user)
    : null;

  if (isTransfer) {
    return (
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${
          isPositive
            ? 'bg-blue-500/10 border-l-blue-500'
            : 'bg-purple-500/10 border-l-purple-500'
        }`}
      >
        <Avatar
          src={otherParty?.profile_image}
          alt={otherParty?.nickname || t.common.user}
          size="sm"
        />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-text-primary">
            {label} · {otherParty?.nickname || t.common.unknown}
          </p>
          <p className="text-xs text-text-tertiary">
            {new Date(tx.details.time).toLocaleString()}
          </p>
        </div>
        <span
          className={`font-bold text-lg ${
            isPositive ? 'text-blue-500' : 'text-purple-500'
          }`}
        >
          {isPositive ? '+' : '-'}
          {tx.details.amount.toLocaleString()}C
        </span>
      </div>
    );
  }

  // Deposit / Withdraw
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${
        isPositive ? 'bg-primary/5 border-l-primary' : 'bg-status-error/5 border-l-status-error'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${
          isPositive ? 'bg-primary' : 'bg-status-error'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-tertiary">
          {new Date(tx.details.time).toLocaleString()}
        </p>
      </div>
      <span
        className={`font-bold text-lg ${isPositive ? 'text-primary' : 'text-status-error'}`}
      >
        {isPositive ? '+' : '-'}
        {tx.details.amount.toLocaleString()}C
      </span>
    </div>
  );
};

function TransactionHistory() {
  const t = useTranslation();
  const { user, needsOnboarding } = useUser();
  const { transactions, isLoading, loadMore, hasMore } = useTransactions();

  if (needsOnboarding) {
    return (
      <PageContainer title={t.pay.transactionHistory}>
        <OnboardingRequired />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DetailHeader />
      <h2 className="text-2xl font-extrabold mb-6">{t.pay.transactionHistory}</h2>

      {isLoading && transactions.length === 0 ? (
        <p className="text-text-tertiary text-sm text-center py-8">{t.common.loading}</p>
      ) : transactions.length === 0 ? (
        <p className="text-text-tertiary text-sm text-center py-8">{t.pay.noTransactions}</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} currentUserId={user?.id?.toString()} t={t} />
          ))}
          {hasMore && (
            <Button
              onClick={loadMore}
              variant="outline"
              size="sm"
              fullWidth
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? t.common.loading : t.common.loadMore}
            </Button>
          )}
        </div>
      )}
    </PageContainer>
  );
}

export default TransactionHistory;
