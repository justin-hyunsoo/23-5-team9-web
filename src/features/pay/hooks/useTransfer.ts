import { useState } from 'react';
import { payApi } from '@/features/pay/api/payApi';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/features/user/hooks/useUser';

interface UseTransferOptions {
  userId: string | number | undefined;
  currentCoin: number;
}

export const useTransfer = ({ userId, currentCoin }: UseTransferOptions) => {
  const queryClient = useQueryClient();
  const [showTransferMenu, setShowTransferMenu] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferring, setTransferring] = useState(false);

  const transfer = async (receiveUserId: string, receiverNickname?: string) => {
    const amount = parseInt(transferAmount, 10);
    if (!userId || !receiveUserId || !amount || amount <= 0) {
      alert('올바른 금액을 입력해주세요.');
      return false;
    }
    if (currentCoin < amount) {
      alert('잔액이 부족합니다.');
      return false;
    }

    setTransferring(true);
    try {
      await payApi.transfer(String(userId), {
        amount,
        description: `${receiverNickname || '상대방'}에게 ${amount.toLocaleString()}원 송금`,
        receive_user_id: receiveUserId,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      setTransferAmount('');
      setShowTransferMenu(false);
      alert(`${amount.toLocaleString()}원을 송금했습니다.`);
      return true;
    } catch (err) {
      console.error('송금 실패:', err);
      alert('송금에 실패했습니다.');
      return false;
    } finally {
      setTransferring(false);
    }
  };

  const toggleTransferMenu = () => setShowTransferMenu(!showTransferMenu);

  const addAmount = (amount: number) => {
    setTransferAmount(String((parseInt(transferAmount, 10) || 0) + amount));
  };

  return {
    showTransferMenu,
    transferAmount,
    transferring,
    setTransferAmount,
    transfer,
    toggleTransferMenu,
    addAmount,
  };
};
