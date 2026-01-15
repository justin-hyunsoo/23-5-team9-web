import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { userApi, User } from '@/features/user/api/user';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  needsOnboarding: boolean;
  login: (token: string, refreshToken: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return false;
    }

    try {
      const { data } = await userApi.getMe();
      setUser(data);
      const needsOnboard = !data.nickname || !data.region;
      return needsOnboard;
    } catch (e: any) {
      console.error("Failed to fetch user data:", e);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (token: string, refreshToken: string): Promise<boolean> => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
    return await checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isLoggedIn = useMemo(() => !!user, [user]);
  const needsOnboarding = useMemo(() => !!user && (!user.nickname || !user.region), [user]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, needsOnboarding, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// 편하게 쓰기 위한 커스텀 Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
