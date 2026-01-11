import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import MyCarrot from './pages/MyCarrot';
import NeighborhoodMap from './pages/NeighborhoodMap';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CommunityList from './pages/CommunityList';
import CommunityDetail from './pages/CommunityDetail';
import { MAIN_API_URL } from './api/config';
import './styles/common.css';
import './styles/app.css';

function App() {
  const [isMainLoggedIn, setIsMainLoggedIn] = useState(!!localStorage.getItem('token'));
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (isMainLoggedIn && token) {
        try {
          const res = await fetch(`${MAIN_API_URL}/api/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (!data.nickname || !data.region) {
              setNeedsOnboarding(true);
            } else {
              setNeedsOnboarding(false);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkUser();
  }, [isMainLoggedIn, location.pathname]); // Check on login state change or navigation

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      setIsMainLoggedIn(true);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Check user status to decide where to navigate
      fetch(`${MAIN_API_URL}/api/user/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch user');
      })
      .then(data => {
        if (!data.nickname || !data.region) {
          navigate('/dangeun/onboarding');
        } else {
          navigate('/dangeun/community');
        }
      })
      .catch((e) => {
        console.error(e);
        navigate('/dangeun/community');
      });
    }
  }, [location, navigate]);

  const isLoggedIn = isMainLoggedIn;

  const handleLogout = () => {
    setIsMainLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/dangeun/products');
  };

  const handleMainLogin = () => {
    setIsMainLoggedIn(true);
  };
  
  const hideNav = 
    location.pathname === '/dangeun/login' || 
    location.pathname === '/dangeun/signup' ||
    location.pathname === '/dangeun/onboarding';
    
  // Don't show banner on onboarding page itself
  const showBanner = needsOnboarding && location.pathname !== '/dangeun/onboarding' && isMainLoggedIn;

  return (
    <div className="app-container">
      {showBanner && (
        <div className="onboarding-banner">
          <span>서비스 이용을 위해 닉네임과 지역 설정이 필요합니다.</span>
          <button 
            onClick={() => navigate('/dangeun/my')}
            className="onboarding-banner-button"
          >
            설정하러 가기
          </button>
        </div>
      )}
      {!hideNav && <NavBar isLoggedIn={isLoggedIn} hasBanner={!!showBanner} />}
      <div 
        className="main-content"
        style={{ 
          paddingTop: showBanner ? (!hideNav ? '114px' : '50px') : (!hideNav ? '64px' : '0')
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dangeun/products" replace />} />
          <Route path="/dangeun" element={<Navigate to="/dangeun/products" replace />} />
          
          {/* Main Site Routes */}
          <Route path="/dangeun/products" element={<ProductList />} />
          <Route path="/dangeun/products/:id" element={<ProductDetail />} />
          <Route path="/dangeun/community" element={<CommunityList />} />
          <Route path="/dangeun/community/:id" element={<CommunityDetail />} />
          <Route path="/dangeun/map" element={<NeighborhoodMap/>}/>
          <Route path="/dangeun/chat" element={<ChatList />} />
          <Route path="/dangeun/chat/:chatId" element={<ChatRoom />} />
          <Route path="/dangeun/my" element={<MyCarrot onLogout={handleLogout} />} />
          <Route path="/dangeun/onboarding" element={<Onboarding />} />
          
          <Route path="/dangeun/login" element={<Login onLogin={handleMainLogin} />} />
          <Route path="/dangeun/signup" element={<Signup onSignup={handleMainLogin} />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
