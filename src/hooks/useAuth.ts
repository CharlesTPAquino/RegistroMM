import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState<{name: string} | null>(null);
  const navigate = useNavigate();

  const login = (credentials: {email: string, password: string}) => {
    // Lógica de login (integrar com Supabase depois)
    setUser({ name: 'Admin' });
    return true;
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return { user, login, logout };
}
