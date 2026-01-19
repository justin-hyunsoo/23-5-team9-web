import { useState, useRef } from 'react';
import { payApi } from '@/features/pay/api/payApi';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/features/user/hooks/useUser';

interface UseTransferOptions {
  currentCoin: number;
}

export const useTransfer = ({ currentCoin }: UseTransferOptions) => {
  const queryClient = useQueryClient();
  const [showTransferMenu, setShowTransferMenu] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferring, setTransferring] = useState(false);
  const requestKeyRef = useRef<string>(crypto.randomUUID());

  const transfer = async (receiveUserId: string, receiverNickname?: string) => {
    const amount = parseInt(transferAmount, 10);
    if (!receiveUserId || !amount || amount <= 0) {
      alert('올바른 금액을 입력해주세요.');
      return false;
    }
    if (currentCoin < amount) {
      alert('잔액이 부족합니다.');
      return false;
    }

    setTransferring(true);
    try {
      await payApi.transfer({
        amount,
        description: `${receiverNickname || '상대방'}에게 ${amount.toLocaleString()}원 송금`,
        request_key: requestKeyRef.current,
        receive_user_id: receiveUserId,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      setTransferAmount('');
      setShowTransferMenu(false);
      alert(`${amount.toLocaleString()}원을 송금했습니다.`);
      requestKeyRef.current = crypto.randomUUID();
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

  const resetRequestKey = () => {
    requestKeyRef.current = crypto.randomUUID();
  };

  return {
    showTransferMenu,
    transferAmount,
    transferring,
    setTransferAmount,
    transfer,
    toggleTransferMenu,
    addAmount,
    resetRequestKey,
  };
};
