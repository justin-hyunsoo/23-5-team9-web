import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAIN_API_URL } from '../api/config';
import '../styles/common.css';

interface UserInfo {
  nickname: string;
  region: string; // Display name
  region_id: string; // ID for API
  profileImage: string;
  coin: number;
}

function MyCarrot() {
  const [activeTab, setActiveTab] = useState('info'); // info, coin, password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    nickname: '',
    region: '',
    profileImage: 'https://via.placeholder.com/100',
    coin: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/dangeun/login');
                return;
            }

            const res = await fetch(`${MAIN_API_URL}/api/user/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUserInfo({
                    nickname: data.nickname || '',
                    region: data.region ? data.region.name : '지역 미설정',
                    region_id: data.region ? data.region.id : '',
                    profileImage: data.profile_image || 'https://via.placeholder.com/100',
                    coin: data.coin || 0
                });
            } else {
                console.error('Failed to fetch user info');
                // 토큰 만료 등의 경우 로그인 페이지로 리다이렉트 고려
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${MAIN_API_URL}/api/user/me/onboard/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nickname: userInfo.nickname,
                region_id: userInfo.region_id || "78c24c9f-05ac-49b5-b3c7c3f66688", // Fallback to provided ID if empty
                profile_image: userInfo.profileImage,
                coin: userInfo.coin // Keep existing coin
            })
        });

        if (res.ok) {
            alert('정보가 수정되었습니다.');
        } else {
            alert('정보 수정 실패');
        }
    } catch (err) {
        console.error(err);
        alert('오류 발생');
    }
  };

  const handleCoinCharge = async (amount: number) => {
     try {
        const token = localStorage.getItem('token');
        const newCoin = userInfo.coin + amount;
        
        const res = await fetch(`${MAIN_API_URL}/api/user/me/onboard/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nickname: userInfo.nickname,
                region_id: userInfo.region_id || "78c24c9f-05ac-49b5-b3c7c3f66688",
                profile_image: userInfo.profileImage,
                coin: newCoin
            })
        });

        if (res.ok) {
            const data = await res.json();
            setUserInfo(prev => ({ ...prev, coin: data.coin }));
            alert(`${amount}코인이 충전되었습니다!`);
        } else {
            alert('충전 실패');
        }
    } catch (err) {
        console.error(err);
        alert('오류 발생');
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('비밀번호가 변경되었습니다.');
  };

  return (
    <div className="page-padding">
      <h2>나의 당근</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('info')}
          style={{ 
            padding: '10px 20px', 
            borderRadius: '20px', 
            border: 'none', 
            background: activeTab === 'info' ? '#ff6f0f' : '#eee',
            color: activeTab === 'info' ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          정보 수정
        </button>
        <button 
          onClick={() => setActiveTab('coin')}
          style={{ 
            padding: '10px 20px', 
            borderRadius: '20px', 
            border: 'none', 
            background: activeTab === 'coin' ? '#ff6f0f' : '#eee',
            color: activeTab === 'coin' ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          코인 확인
        </button>
        <button 
          onClick={() => setActiveTab('password')}
          style={{ 
            padding: '10px 20px', 
            borderRadius: '20px', 
            border: 'none', 
            background: activeTab === 'password' ? '#ff6f0f' : '#eee',
            color: activeTab === 'password' ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          비밀번호 수정
        </button>
      </div>

      <div className="content-area" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
        {activeTab === 'info' && (
          <form onSubmit={handleInfoUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3>프로필 정보 수정</h3>
            <div style={{ textAlign: 'center' }}>
              <img src={userInfo.profileImage} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover' }} />
              <br/>
              <button 
                type="button" 
                style={{ fontSize: '0.8rem', padding: '5px 10px', cursor: 'pointer' }}
                onClick={() => {
                    const url = prompt('이미지 URL을 입력하세요:', userInfo.profileImage);
                    if (url) setUserInfo({...userInfo, profileImage: url});
                }}
              >
                사진 변경 (URL)
              </button>
            </div>
            <div>
              <label>닉네임</label>
              <input 
                type="text" 
                value={userInfo.nickname} 
                onChange={(e) => setUserInfo({...userInfo, nickname: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>지역 (이름만 표시됨)</label>
              <input 
                type="text" 
                value={userInfo.region} 
                readOnly
                disabled
                style={{ width: '100%', padding: '8px', marginTop: '5px', backgroundColor: '#f0f0f0', color: '#888' }}
              />
            </div>
            <button type="submit" className="submit-btn" style={{ background: '#ff6f0f', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>저장하기</button>
          </form>
        )}

        {activeTab === 'coin' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3>나의 코인</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ff6f0f', margin: '20px 0' }}>
              {userInfo.coin.toLocaleString()} C
            </div>
            <p>당근머니로 간편하게 거래해보세요!</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                <button 
                    onClick={() => handleCoinCharge(1000)}
                    style={{ padding: '10px 20px', background: '#e9ecef', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    +1,000 충전
                </button>
                <button 
                    onClick={() => handleCoinCharge(5000)}
                    style={{ padding: '10px 20px', background: '#e9ecef', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    +5,000 충전
                </button>
                <button 
                    onClick={() => handleCoinCharge(10000)}
                    style={{ padding: '10px 20px', background: '#ffe0cc', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', color: '#ff6f0f' }}
                >
                    +10,000 충전
                </button>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3>비밀번호 변경</h3>
            <div>
              <label>현재 비밀번호</label>
              <div style={{ position: 'relative', marginTop: '5px' }}>
                <input type={showCurrentPassword ? "text" : "password"} style={{ width: '100%', padding: '8px', paddingRight: '50px' }} />
                <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#868e96',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}
                >
                    {showCurrentPassword ? '숨기기' : '보기'}
                </button>
              </div>
            </div>
            <div>
              <label>새 비밀번호</label>
              <div style={{ position: 'relative', marginTop: '5px' }}>
                <input type={showNewPassword ? "text" : "password"} style={{ width: '100%', padding: '8px', paddingRight: '50px' }} />
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#868e96',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}
                >
                    {showNewPassword ? '숨기기' : '보기'}
                </button>
              </div>
            </div>
            <div>
              <label>새 비밀번호 확인</label>
              <div style={{ position: 'relative', marginTop: '5px' }}>
                <input type={showNewPasswordConfirm ? "text" : "password"} style={{ width: '100%', padding: '8px', paddingRight: '50px' }} />
                <button
                    type="button"
                    onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#868e96',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}
                >
                    {showNewPasswordConfirm ? '숨기기' : '보기'}
                </button>
              </div>
            </div>
            <button type="submit" style={{ background: '#ff6f0f', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>변경하기</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default MyCarrot;
