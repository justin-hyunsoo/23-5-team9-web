import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { MainLayout } from '@/shared/layouts/MainLayout';
import { SocialLoginHandler } from '@/features/auth/components/SocialLoginHandler';

// Page Imports
import Login from '@/features/auth/pages/Login';
import Signup from '@/features/auth/pages/Signup';
import Onboarding from '@/features/auth/pages/Onboarding';
import ChatList from '@/features/chat/pages/ChatList';
import ChatRoom from '@/features/chat/pages/ChatRoom';
import MyCarrot from '@/features/user/pages/MyCarrot';
import NeighborhoodMap from '@/features/location/pages/NeighborhoodMap';
import ProductList from '@/features/product/pages/ProductList';
import ProductDetail from '@/features/product/pages/ProductDetail';
import CommunityList from '@/features/community/pages/CommunityList';
import CommunityDetail from '@/features/community/pages/CommunityDetail';

function App() {
  return (
    <AuthProvider>
      <SocialLoginHandler />
      <Routes>
        {/* 메인 서비스 영역 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/community" element={<CommunityList />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/map" element={<NeighborhoodMap/>}/>
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<ChatRoom />} />
          <Route path="/my" element={<MyCarrot />} />
        </Route>

        {/* 인증 관련 영역 (Layout이 다름) */}
        <Route path="/auth"> 
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="onboarding" element={<Onboarding />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
