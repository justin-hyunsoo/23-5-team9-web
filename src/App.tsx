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
import './styles/common.css';

function App() {
  const [isMainLoggedIn, setIsMainLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = isMainLoggedIn;

  const handleLogout = () => {
    setIsMainLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/dangeun/login');
  };

  const handleMainLogin = () => {
    setIsMainLoggedIn(true);
  };
  
  const hideNav = 
    location.pathname === '/dangeun/login' || 
    location.pathname === '/dangeun/signup' ||
    location.pathname === '/dangeun/onboarding';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {!hideNav && <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <div style={{ 
        paddingTop: !hideNav ? '64px' : '0',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
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
          <Route path="/dangeun/my" element={<MyCarrot />} />
          <Route path="/dangeun/onboarding" element={<Onboarding />} />
          
          <Route path="/dangeun/login" element={<Login onLogin={handleMainLogin} />} />
          <Route path="/dangeun/signup" element={<Signup onSignup={handleMainLogin} />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
