import { useUser, useOnboarding } from '@/features/user/hooks/useUser';
import { usePay } from '@/features/pay/hooks/usePay';

export const useMyCarrotData = () => {
  const { user } = useUser();
  const onboardingMutation = useOnboarding();
  const { deposit, withdraw } = usePay(user?.id);

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
    await deposit(amount);
  };

  const withdrawCoin = async (amount: number) => {
    if (!user) return;
    await withdraw(amount, user.coin);
  };

  return { user, updateProfile, depositCoin, withdrawCoin };
};
