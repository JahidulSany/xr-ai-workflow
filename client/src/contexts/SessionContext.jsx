import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

export const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/users/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Session restore failed', error);
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    try {
      await api.post('/api/users/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setProjectId(null);
    }
  };

  return (
    <SessionContext.Provider
      value={{ user, setUser, projectId, setProjectId, loading, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);