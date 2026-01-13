import { userApi } from '@/features/user/api/user';
import { useAuth } from '@/features/auth/context/AuthContext'; // 1. useAuth import

export const useMyCarrotData = () => {
  const { user, checkAuth } = useAuth(); 

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      await userApi.updateOnboard({ ...data, coin: user.coin }); 
      await checkAuth(); 
      alert('정보가 수정되었습니다.');
    } catch (err) { 
      console.error(err); 
      alert('오류 발생'); 
    }
  };

  const chargeCoin = async (amount: number) => {
    if (!user) return;
    try {
      await userApi.updateOnboard({
        nickname: user.nickname || '',
        region_id: user.region?.id || "default-id",
        profile_image: user.profile_image || '',
        coin: user.coin + amount
      });
      
      await checkAuth();
      
    } catch (err) { 
      console.error(err); 
      alert('충전 오류'); 
    }
  };

  return { user, updateProfile, chargeCoin };
};
