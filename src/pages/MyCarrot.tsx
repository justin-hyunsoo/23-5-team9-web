import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, User } from '../api/user';
import ProfileEditForm from '../components/ProfileEditForm';
import '../styles/common.css';
import '../styles/my-carrot.css';

// --- 1. Sub-components (탭별 컴포넌트 분리) ---

const CoinTab = ({ user, onCharge }: { user: User; onCharge: (amount: number) => void }) => (
  <div className="coin-section">
    <div className="coin-balance-card">
      <h3 className="coin-balance-title">보유 코인</h3>
      <div className="coin-amount">
        {user.coin.toLocaleString()} <span className="coin-unit">C</span>
      </div>
    </div>
    <h4 className="coin-charge-title">코인 충전하기</h4>
    <div className="coin-charge-grid">
      {[1000, 5000, 10000, 30000, 50000, 100000].map((amount) => (
        <button key={amount} onClick={() => onCharge(amount)} className="coin-charge-button">
          +{amount.toLocaleString()}
        </button>
      ))}
    </div>
  </div>
);

const PasswordInput = ({ label }: { label: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="password-input-wrapper">
        <input className="form-input password-input" type={show ? "text" : "password"} />
        <button type="button" onClick={() => setShow(!show)} className="password-toggle-button">
          {show ? '숨기기' : '보기'}
        </button>
      </div>
    </div>
  );
};

const PasswordTab = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('비밀번호가 변경되었습니다.');
  };

  return (
    <form onSubmit={handleSubmit} className="password-form">
      <PasswordInput label="현재 비밀번호" />
      <PasswordInput label="새 비밀번호" />
      <PasswordInput label="새 비밀번호 확인" />
      <button type="submit" className="button submit-button">비밀번호 변경</button>
    </form>
  );
};

// --- 2. Custom Hook (로직 분리) ---

const useMyCarrotData = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      try {
        const res = await userApi.getMe();
        if (res.ok) setUser(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, [navigate]);

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      const res = await userApi.updateOnboard({ ...data, coin: user.coin }); // 기존 코인 유지
      if (res.ok) {
        setUser(await res.json());
        alert('정보가 수정되었습니다.');
      }
    } catch (err) { console.error(err); alert('오류 발생'); }
  };

  const chargeCoin = async (amount: number) => {
    if (!user) return;
    try {
      const res = await userApi.updateOnboard({
        nickname: user.nickname || '',
        region_id: user.region?.id || "default-id",
        profile_image: user.profile_image || '',
        coin: user.coin + amount
      });
      if (res.ok) {
        setUser(await res.json());
        alert(`${amount}코인이 충전되었습니다!`);
      }
    } catch (err) { console.error(err); alert('충전 실패'); }
  };

  return { user, updateProfile, chargeCoin };
};

// --- 3. Main Component (구성 및 렌더링) ---

function MyCarrot({ onLogout }: { onLogout: () => void }) {
  const { user, updateProfile, chargeCoin } = useMyCarrotData();
  const [activeTab, setActiveTab] = useState('info');

  if (!user) return <div>Loading...</div>;

  const TABS = [
    { id: 'info', label: '프로필 수정' },
    { id: 'coin', label: '코인 관리' },
    { id: 'password', label: '비밀번호 변경' },
  ];

  return (
    <div className="my-carrot-container">
      <div className="header">
        <h2 className="header-title">나의 당근</h2>
        <button onClick={onLogout} className="logout-button">로그아웃</button>
      </div>
      
      <div className="tabs-container">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content-area">
        {activeTab === 'info' && (
          <ProfileEditForm
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