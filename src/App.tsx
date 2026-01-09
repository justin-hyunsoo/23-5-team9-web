import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import NavBar from './components/NavBar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import JobLogin from './pages/JobLogin';
import JobSignup from './pages/JobSignup';
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
  const [isJobLoggedIn, setIsJobLoggedIn] = useState(!!localStorage.getItem('job_token'));
  const navigate = useNavigate();
  const location = useLocation();

  const isJobSection = location.pathname.startsWith('/dangeun/jobs');

  const isLoggedIn = isJobSection ? isJobLoggedIn : isMainLoggedIn;

  const handleLogout = () => {
    if (isJobSection) {
        setIsJobLoggedIn(false);
        localStorage.removeItem('job_token');
        navigate('/dangeun/jobs/login');
    } else {
        setIsMainLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        navigate('/dangeun/login');
    }
  };

  const handleMainLogin = () => {
    setIsMainLoggedIn(true);
  };
  
  const handleJobLogin = () => {
    setIsJobLoggedIn(true);
  };

  // Ensure NavBar login button redirects correctly
  // NavBar just calls "navigate('/dangeun/login')" when not logged in. 
  // We need to either modify NavBar or route /dangeun/login intelligently.
  // But NavBar props are fixed? No, I can modify NavBar later if needed.
  // For now let's assume /dangeun/login is for Main.

  // Hide NavBar on login/signup pages
  const hideNav = 
    location.pathname === '/dangeun/login' || 
    location.pathname === '/dangeun/signup' ||
    location.pathname === '/dangeun/jobs/login' ||
    location.pathname === '/dangeun/jobs/signup' ||
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
          <Route path="/" element={<Navigate to="/dangeun/jobs?page=0" replace />} />
          <Route path="/dangeun" element={<Navigate to="/dangeun/jobs?page=0" replace />} />
          
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

          {/* Job (Alba) Routes */}
          <Route path="/dangeun/jobs" element={<Home/>}/>
          <Route path="/dangeun/posts/:id" element={<PostDetail/>}/>
          <Route path="/dangeun/jobs/login" element={<JobLogin onLogin={handleJobLogin} />} />
          <Route path="/dangeun/jobs/signup" element={<JobSignup onSignup={handleJobLogin} />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
