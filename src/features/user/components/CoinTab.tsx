import { User } from '@/features/user/api/user';
import { Button } from '@/shared/ui/Button';
import { StatCard } from '@/shared/ui/Stat';

interface CoinTabProps {
  user: User;
  onCharge: (amount: number) => void;
}

const CoinTab = ({ user, onCharge }: CoinTabProps) => (
  <div className="text-center py-5">
    <StatCard 
      label="보유 코인" 
      value={user.coin.toLocaleString()} 
      unit="C" 
      layout="vertical"
      variant="outline" // 회색 배경이 없는 버튼 스타일 테두리
      className="mb-[30px]" 
    />

    <h4 className="mb-5 text-text-secondary font-bold">코인 충전하기</h4>
    <div className="grid grid-cols-3 gap-3">
      {[1000, 5000, 10000, 30000, 50000, 100000].map((amount) => (
        <Button
          key={amount}
          onClick={() => onCharge(amount)}
          variant="outline"
          className="hover:border-primary hover:text-primary hover:bg-orange-50 dark:hover:bg-orange-950/30"
        >
          +{amount.toLocaleString()}
        </Button>
      ))}
    </div>
  </div>
);

export default CoinTab;