import client from '@/shared/api/client';

export interface PayTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  details: {
    amount: number;
    description: string;
    time: string;
    user: {
      id: string;
      nickname: string;
      profile_image: string;
    };
    receive_user?: {
      id: string;
      nickname: string;
      profile_image: string;
    };
  };
}

export interface DepositRequest {
  amount: number;
  description: string;
}

export interface WithdrawRequest {
  amount: number;
  description: string;
}

export interface TransferRequest {
  amount: number;
  description: string;
  receive_user_id: string;
}

export const payApi = {
  deposit: (userId: string, data: DepositRequest) =>
    client.post<PayTransaction>(`/api/pay/${userId}/deposit`, data),

  withdraw: (userId: string, data: WithdrawRequest) =>
    client.post<PayTransaction>(`/api/pay/${userId}/withdraw`, data),

  transfer: (userId: string, data: TransferRequest) =>
    client.post<PayTransaction>(`/api/pay/${userId}/transfer`, data),
};
