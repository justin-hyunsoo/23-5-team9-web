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
  request_key: string;
}

export interface WithdrawRequest {
  amount: number;
  description: string;
  request_key: string;
}

export interface TransferRequest {
  amount: number;
  description: string;
  request_key: string;
  receive_user_id: string;
}

export const payApi = {
  deposit: (data: DepositRequest) =>
    client.post<PayTransaction>('/api/pay/deposit', data),

  withdraw: (data: WithdrawRequest) =>
    client.post<PayTransaction>('/api/pay/withdraw', data),

  transfer: (data: TransferRequest) =>
    client.post<PayTransaction>('/api/pay/transfer', data),
};
