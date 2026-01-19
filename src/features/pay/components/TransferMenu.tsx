import { Button, Input } from '@/shared/ui';
import { useTransfer } from '@/features/pay/hooks/useTransfer';

interface TransferMenuProps {
  currentCoin: number;
  recipientId: string | undefined;
  recipientName?: string;
}

const PRESET_AMOUNTS = [1000, 5000, 10000, 50000];

const TransferMenu = ({
  currentCoin,
  recipientId,
  recipientName = '상대방',
}: TransferMenuProps) => {
  const {
    transferAmount,
    transferring,
    setTransferAmount,
    transfer,
    addAmount,
  } = useTransfer({ currentCoin });

  const handleTransfer = async () => {
    if (!recipientId) return;
    await transfer(recipientId, recipientName);
  };

  return (
    <div className="px-4 py-3 bg-bg-box border-b border-border-base">
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="number"
          placeholder="송금할 금액"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          className="flex-1 !py-2 !px-3 text-sm"
        />
        <Button
          onClick={handleTransfer}
          disabled={transferring || !transferAmount}
          size="sm"
          className="whitespace-nowrap"
        >
          {transferring ? '송금 중...' : '송금'}
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => addAmount(amount)}
            className="px-3 py-1.5 text-xs border border-border-medium rounded-lg text-text-body hover:border-primary hover:text-primary hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
          >
            +{amount.toLocaleString()}
          </button>
        ))}
      </div>
      <p className="text-xs text-text-secondary mt-2">
        {recipientName}에게 코인을 송금합니다
      </p>
    </div>
  );
};

export default TransferMenu;
