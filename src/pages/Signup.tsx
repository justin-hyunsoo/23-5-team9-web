import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAIN_API_URL } from '../api/config';
// Reuse styles
import '../styles/login.css'; 

interface SignupFormProps {
  onSignup?: () => void;
}

export default function Signup({ onSignup }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch = password && password === passwordConfirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1-step: Create Account
      const res = await fetch(`${MAIN_API_URL}/api/user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Automatically login to proceed to onboarding
        const loginRes = await fetch(`${MAIN_API_URL}/api/auth/tokens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (loginRes.ok) {
            const data = await loginRes.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            onSignup && onSignup();
            navigate('/dangeun/onboarding');
        } else {
             navigate('/dangeun/login');
        }
      } else {
        const errorData = await res.json();
        setError(errorData.detail || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card form-card" style={{ width: '400px', margin: 'auto', padding: '40px' }}>
        <h2 className="section-title">회원가입</h2>
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            <input 
                className="form-input" 
                type="email" 
                placeholder="이메일" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
            />
            <input 
                className="form-input" 
                type="password" 
                placeholder="비밀번호 (8자 이상)" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
            />
            <input 
                className="form-input" 
                type="password" 
                placeholder="비밀번호 확인" 
                value={passwordConfirm} 
                onChange={e => setPasswordConfirm(e.target.value)} 
                required 
            />
             {!passwordsMatch && passwordConfirm && (
                <div style={{color:'red', fontSize: '12px', marginBottom: '10px'}}>비밀번호가 일치하지 않습니다.</div>
            )}
            
            {error && <div className="login-error">{error}</div>}
            
            <button className="login-button" type="submit" disabled={loading} style={{marginTop:'20px'}}>
                {loading ? '가입 중...' : '다음'}
            </button>
        </form>
      </div>
    </div>
  );
}
