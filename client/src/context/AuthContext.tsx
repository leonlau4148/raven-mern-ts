import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';
import type { AuthResponse, User } from '../types';

// Context is React's built-in way to share state down the widget tree
// without passing props through every level — the same problem
// BlocProvider/Cubit solves in your Flutter apps.

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: on first render, restore the session from
  // localStorage (the browser's SharedPreferences equivalent).
  // This is why a page refresh doesn't log you out.
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? (JSON.parse(saved) as User) : null;
  });

  const saveSession = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user); // triggers re-render everywhere user is consumed
  };

  // These are your Cubit methods. Errors are NOT caught here on
  // purpose — the calling page catches them and shows the message.
  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    saveSession(data);
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      username,
      email,
      password,
    });
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so pages can write: const { user, login } = useAuth();
// — the context.read<AuthCubit>() equivalent.
// Throwing on a missing provider is what lets every caller treat the
// returned value as non-null instead of guarding on it.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }

  return context;
}
