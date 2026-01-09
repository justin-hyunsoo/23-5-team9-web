import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAIN_API_URL } from '../api/config';
import '../styles/login.css';

interface Region {
  id: string;
  name: string;
}

export default function Onboarding() {
  const [nickname, setNickname] = useState('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionId, setRegionId] = useState(''); 
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateRandomImage = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    return `https://robohash.org/${randomSeed}?set=set4`;
  };

  useEffect(() => {
    setProfileImage(generateRandomImage());

    fetch(`${MAIN_API_URL}/api/regions/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch regions');
        return res.json();
      })
      .then((data: Region[]) => {
        setRegions(data);
        if (data.length > 0) {
          setRegionId(data[0].id);
        }
      })
      .catch(err => {
        console.error(err);
        setError('지역 정보를 불러오는데 실패했습니다.');
      });
  }, []);

  const handleRefreshImage = () => {
    setProfileImage(generateRandomImage());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/dangeun/login');
          return;
      }

      const res = await fetch(`${MAIN_API_URL}/api/user/me/onboard`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            nickname, 
            region_id: regionId,
            profile_image: profileImage
        }),
      });

      if (res.ok) {
        navigate('/dangeun/community'); // Main page after onboarding
      } else {
        const errorData = await res.json();
        setError(errorData.detail || '온보딩에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card form-card" style={{ width: '400px', margin: 'auto' }}>
        <h2 className="section-title">추가 정보 입력</h2>
        <p style={{marginBottom: '20px', color: '#666'}}>닉네임과 지역, 프로필 이미지를 설정해주세요.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <img 
                src={profileImage} 
                alt="Profile Preview" 
                style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f0f0f0', marginBottom: '10px' }} 
            />
            <button 
                type="button" 
                onClick={handleRefreshImage}
                style={{ 
                    padding: '5px 10px', 
                    fontSize: '12px', 
                    cursor: 'pointer',
                    backgroundColor: '#eee',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                }}
            >
                이미지 변경 (랜덤)
            </button>
        </div>

        <form onSubmit={handleSubmit}>
            <input 
                className="form-input" 
                type="text" 
                placeholder="닉네임" 
                value={nickname} 
                onChange={e => setNickname(e.target.value)} 
                required 
            />
            
            <select 
                className="form-input" 
                value={regionId} 
                onChange={e => setRegionId(e.target.value)}
                disabled={regions.length === 0}
            >
                {regions.length === 0 ? (
                    <option value="">지역 불러오는 중...</option>
                ) : (
                    regions.map(region => (
                        <option key={region.id} value={region.id}>
                            {region.name}
                        </option>
                    ))
                )}
            </select>
            
            {error && <div className="login-error">{error}</div>}
            
            <button className="submit-button" type="submit" disabled={loading || !regionId}>
                {loading ? '시작하기' : '완료'}
            </button>
        </form>
      </div>
    </div>
  );
}
