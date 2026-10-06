import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import * as Keychain from 'react-native-keychain';

const BACKEND_URL = 'http://localhost:5000';

interface User {
  id: string;
  name: string;
  email: string;
  reelsAppId: number;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

interface MeResponse {
  success: boolean;
  data: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // CHECK EXISTING LOGIN
  // ==================================================

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const credentials =
        await Keychain.getGenericPassword();

      // No saved token
      if (!credentials) {
        setLoading(false);
        return;
      }

      const storedToken = credentials.password;

      const response = await fetch(
        `${BACKEND_URL}/api/auth/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      // Token invalid or expired
      if (!response.ok) {
        await Keychain.resetGenericPassword();

        setToken(null);
        setUser(null);

        return;
      }

      const result =
        (await response.json()) as MeResponse;

      setToken(storedToken);
      setUser(result.data);
    } catch (error) {
      console.error('Check auth error:', error);

      await Keychain.resetGenericPassword();

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // LOGIN
  // ==================================================

  const login = async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const result =
        (await response.json()) as LoginResponse;

      if (!response.ok) {
        throw new Error(
          result.message || 'Login failed',
        );
      }

      const receivedToken = result.data.token;
      const loggedInUser = result.data.user;

      // Save JWT securely
      await Keychain.setGenericPassword(
        'authToken',
        receivedToken,
      );

      // Update state
      setToken(receivedToken);
      setUser(loggedInUser);
    } catch (error) {
      console.error('Login error:', error);

      throw error;
    }
  };

  // ==================================================
  // REGISTER
  // ==================================================

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      // ----------------------------------------------
      // STEP 1: CREATE ACCOUNT
      // ----------------------------------------------

      const registerResponse = await fetch(
        `${BACKEND_URL}/api/auth/register`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      const registerResult =
        (await registerResponse.json()) as RegisterResponse;

      // Registration failed
      if (!registerResponse.ok) {
        throw new Error(
          registerResult.message ||
            'Registration failed',
        );
      }

      // ----------------------------------------------
      // STEP 2: LOGIN AUTOMATICALLY
      // ----------------------------------------------

      await login(email, password);
    } catch (error) {
      console.error('Register error:', error);

      throw error;
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const logout = async (): Promise<void> => {
    try {
      // Remove JWT from device
      await Keychain.resetGenericPassword();

      // Clear React state
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);

      throw error;
    }
  };

  // ==================================================
  // PROVIDER
  // ==================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================================================
// useAuth HOOK
// ==================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
};