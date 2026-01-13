import { useState } from 'react';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import CoinTab from '@/features/user/components/CoinTab';
import PasswordTab from '@/features/user/components/PasswordTab';
import { useMyCarrotData } from '@/features/user/hooks/useMyCarrotData';
import { Loading } from "@/shared/ui/StatusMessage";

function MyCarrot({ onLogout }: { onLogout: () => void }) {
  const { user, updateProfile, chargeCoin } = useMyCarrotData();
  const [activeTab, setActiveTab] = useState('info');

  if (!user) return <Loading />;

  const TABS = [
    { id: 'info', label: '프로필 수정' },
    { id: 'coin', label: '코인 관리' },
    { id: 'password', label: '비밀번호 변경' },
  ];

  return (
    <div className="max-w-[600px] px-5 py-10 mx-auto">
      <div className="flex justify-between items-center mb-[30px]">
        <h2 className="text-2xl font-extrabold m-0">나의 당근</h2>
        <button onClick={onLogout} className="px-4 py-2 bg-white text-dark border border-gray-300 rounded-md text-sm font-bold cursor-pointer transition-all hover:bg-light hover:border-blue-200">로그아웃</button>
      </div>
      
      <div className="flex gap-2 mb-[30px] border-b border-border pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-5 py-3 border-none bg-none border-b-2 cursor-pointer text-base transition-all
              ${activeTab === tab.id 
                ? 'border-primary text-dark font-bold' 
                : 'border-transparent text-gray-light font-normal hover:text-dark'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content-area">
        {activeTab === 'info' && (
          <ProfileEditForm
            initialEmail={user.email}
            initialNickname={user.nickname || ''}
            initialRegionId={user.region?.id || ''}
            initialProfileImage={user.profile_image || ''}
            onSubmit={updateProfile}
          />
        )}
        {activeTab === 'coin' && <CoinTab user={user} onCharge={chargeCoin} />}
        {activeTab === 'password' && <PasswordTab />}
      </div>
    </div>
  );
}

export default MyCarrot;