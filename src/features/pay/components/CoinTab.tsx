import { useState } from 'react';
import { User } from '@/features/user/api/user';
import { Button, StatCard } from '@/shared/ui';

import { useUser } from '@/features/user/hooks/useUser';
import { useTransactions } from '@/features/pay/hooks/useTransactions';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { OnboardingRequired } from '@/shared/ui';

interface CoinTabProps {
  user: User;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

type Mode = 'deposit' | 'withdraw';

const CoinTab = ({ user, onDeposit, onWithdraw }: CoinTabProps) => {
  const [mode, setMode] = useState<Mode>('deposit');
  const { transactions, isLoading: transactionsLoading, loadMore, hasMore } = useTransactions();

  const handleAction = (amount: number) => {
    if (mode === 'deposit') {
      onDeposit(amount);
    } else {
      onWithdraw(amount);
    }
  };

   const { needsOnboarding } = useUser();
  
    if (needsOnboarding) {
        return (
          <PageContainer title="채팅">
            <OnboardingRequired />
          </PageContainer>
        );
      }
  

  return (
    <div className="text-center py-5">
      <StatCard
        label="보유 코인"
        value={user.coin.toLocaleString()}
        unit="C"
        layout="vertical"
        variant="outline"
        className="mb-[30px]"
      />

      <div className="flex gap-2 justify-center mb-5">
        <Button
          onClick={() => setMode('deposit')}
          variant={mode === 'deposit' ? 'primary' : 'outline'}
          size="sm"
        >
          충전
        </Button>
        <Button
          onClick={() => setMode('withdraw')}
          variant={mode === 'withdraw' ? 'primary' : 'outline'}
          size="sm"
        >
          출금
        </Button>
      </div>

      <h4 className="mb-5 text-text-secondary font-bold">
        {mode === 'deposit' ? '코인 충전하기' : '코인 출금하기'}
      </h4>
      <div className="grid grid-cols-3 gap-3">
        {[1000, 5000, 10000, 30000, 50000, 100000].map((amount) => (
          <Button
            key={amount}
            onClick={() => handleAction(amount)}
            variant="outline"
            className={
              mode === 'deposit'
                ? 'hover:border-primary hover:text-primary hover:bg-primary-light'
                : 'hover:border-status-error hover:text-status-error hover:bg-status-error-hover'
            }
          >
            {mode === 'deposit' ? '+' : '-'}{amount.toLocaleString()}
          </Button>
        ))}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h4 className="mb-4 text-text-secondary font-bold text-left">거래 내역</h4>
        {transactionsLoading && transactions.length === 0 ? (
          <p className="text-text-tertiary text-sm">로딩 중...</p>
        ) : transactions.length === 0 ? (
          <p className="text-text-tertiary text-sm">거래 내역이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${
                  tx.type === 'DEPOSIT'
                    ? 'bg-primary/5 border-l-primary'
                    : 'bg-status-error/5 border-l-status-error'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    tx.type === 'DEPOSIT' ? 'bg-primary' : 'bg-status-error'
                  }`}
                >
                  {tx.type === 'DEPOSIT' ? '↓' : '↑'}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-text-primary">
                    {tx.type === 'DEPOSIT' ? '충전' : '출금'}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {new Date(tx.details.time).toLocaleString('ko-KR')}
                  </p>
                </div>
                <span
                  className={`font-bold text-lg ${
                    tx.type === 'DEPOSIT' ? 'text-primary' : 'text-status-error'
                  }`}
                >
                  {tx.type === 'DEPOSIT' ? '+' : '-'}
                  {tx.details.amount.toLocaleString()}C
                </span>
              </div>
            ))}
            {hasMore && (
              <Button
                onClick={loadMore}
                variant="outline"
                size="sm"
                fullWidth
                disabled={transactionsLoading}
                className="mt-3"
              >
                {transactionsLoading ? '로딩 중...' : '더보기'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinTab;
