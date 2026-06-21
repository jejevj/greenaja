import { useState } from 'react';

// Dummy auth hook — replace with real logic later
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = async (email: string, password: string) => {
    // TODO: replace with real API call
    setUser({ name: 'GreenAja User', email });
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return { isLoggedIn, user, login, logout };
}
