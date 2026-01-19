import { useRef } from 'react';
import { useUser, useOnboarding } from '@/features/user/hooks/useUser';
import { usePay } from '@/features/pay/hooks/usePay';

export const useMyCarrotData = () => {
  const { user } = useUser();
  const onboardingMutation = useOnboarding();
  const { deposit, withdraw } = usePay();
  const depositKeyRef = useRef<string>(crypto.randomUUID());
  const withdrawKeyRef = useRef<string>(crypto.randomUUID());

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
    const success = await deposit(amount, depositKeyRef.current);
    if (success) {
      depositKeyRef.current = crypto.randomUUID();
    }
  };

  const withdrawCoin = async (amount: number) => {
    if (!user) return;
    const success = await withdraw(amount, user.coin, withdrawKeyRef.current);
    if (success) {
      withdrawKeyRef.current = crypto.randomUUID();
    }
  };

  return { user, updateProfile, depositCoin, withdrawCoin };
};
