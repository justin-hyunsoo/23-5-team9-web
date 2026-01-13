import axios, { AxiosInstance, AxiosError } from 'axios';
import { MAIN_API_URL } from './config';

const client: AxiosInstance = axios.create({
  baseURL: MAIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 자동으로 토큰 주입
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 에러 중앙 처리
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401 Unauthorized 발생 시 처리
      // 예: 컴포넌트 레벨에서 로그아웃 처리를 위해 에러를 그대로 전파하거나
      // 전역 상태 관리를 통해 로그아웃 트리거
      // 여기서는 일단 에러를 반환하여 호출 측에서 처리하도록 함
      console.warn('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

export default client;
