import { useUser, useOnboarding } from '@/features/user/hooks/useUser';
import { payApi } from '@/features/pay/api/payApi';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/features/user/hooks/useUser';

export const useMyCarrotData = () => {
  const { user } = useUser();
  const onboardingMutation = useOnboarding();
  const queryClient = useQueryClient();

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      await onboardingMutation.mutateAsync(data);
      alert('정보가 수정되었습니다.');
    } catch (err) {
      console.error(err);
      alert('오류 발생');
    }
  };

  const depositCoin = async (amount: number) => {
    if (!user || !user.id) return;
    try {
      await payApi.deposit(String(user.id), {
        amount,
        description: `Deus ex Machina deposit ${amount.toLocaleString()}원`,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    } catch (err) {
      console.error(err);
      alert('충전 오류');
    }
  };

  const withdrawCoin = async (amount: number) => {
    if (!user || !user.id) return;
    if (user.coin < amount) {
      alert('잔액이 부족합니다.');
      return;
    }
    try {
      await payApi.withdraw(String(user.id), {
        amount,
        description: `Deus ex Machina withdraw ${amount.toLocaleString()}원`,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    } catch (err) {
      console.error(err);
      alert('출금 오류');
    }
  };

  return { user, updateProfile, depositCoin, withdrawCoin };
};
