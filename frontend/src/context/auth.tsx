/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { IUser } from 'types';
import { me } from 'services/AuthService';
type State = {
  authenticated: boolean;
  user: IUser | null;
  loading: boolean;
  login: (user: IUser) => void;
  logout: () => void;
};

const defaultState: State = {
  authenticated: false,
  user: null,
  loading: true,
  login: (_) => {},
  logout: () => {},
};

const AuthContext = createContext<State>(defaultState);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);

  const login = (user: IUser) => {
    setAuthenticated(true);
    setUser(user);
  };
  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    window.location.reload;
  };
  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await me();
        login(user);
      } catch (error) {
      } finally {
        stopLoading();
      }
    };
    loadUser();
  }, [stopLoading]);

  const value = {
    authenticated,
    loading,
    user,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthState = () => useContext<State>(AuthContext);
