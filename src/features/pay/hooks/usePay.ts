import { payApi } from '@/features/pay/api/payApi';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/features/user/hooks/useUser';

export const usePay = (userId: string | number | undefined) => {
  const queryClient = useQueryClient();

  const deposit = async (amount: number) => {
    if (!userId) return;
    try {
      await payApi.deposit(String(userId), {
        amount,
        description: `Deus ex Machina deposit ${amount.toLocaleString()}원`,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    } catch (err) {
      console.error(err);
      alert('충전 오류');
    }
  };

  const withdraw = async (amount: number, currentCoin: number) => {
    if (!userId) return;
    if (currentCoin < amount) {
      alert('잔액이 부족합니다.');
      return;
    }
    try {
      await payApi.withdraw(String(userId), {
        amount,
        description: `Deus ex Machina withdraw ${amount.toLocaleString()}원`,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    } catch (err) {
      console.error(err);
      alert('출금 오류');
    }
  };

  return { deposit, withdraw };
};
