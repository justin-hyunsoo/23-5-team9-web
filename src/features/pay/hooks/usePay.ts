import { payApi } from '@/features/pay/api/payApi';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/features/user/hooks/useUser';

export const usePay = () => {
  const queryClient = useQueryClient();

  const deposit = async (amount: number, requestKey: string): Promise<boolean> => {
    try {
      await payApi.deposit({
        amount,
        description: `Deus ex Machina deposit ${amount.toLocaleString()}원`,
        request_key: requestKey,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      return true;
    } catch (err) {
      console.error(err);
      alert('충전 오류');
      return false;
    }
  };

  const withdraw = async (amount: number, currentCoin: number, requestKey: string): Promise<boolean> => {
    if (currentCoin < amount) {
      alert('잔액이 부족합니다.');
      return false;
    }
    try {
      await payApi.withdraw({
        amount,
        description: `Deus ex Machina withdraw ${amount.toLocaleString()}원`,
        request_key: requestKey,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      return true;
    } catch (err) {
      console.error(err);
      alert('출금 오류');
      return false;
    }
  };

  return { deposit, withdraw };
};
