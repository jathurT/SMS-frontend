import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import keycloak from '../config/keycloak';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  token: string | null;
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);

  // Enhanced logout function
  const logout = useCallback(() => {
    console.log('🔓 Logging out...');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    keycloak.logout({
      redirectUri: window.location.origin
    });
  }, []);

  // Enhanced login function
  const login = useCallback(() => {
    console.log('🔐 Redirecting to login...');
    keycloak.login({
      redirectUri: window.location.origin
    });
  }, []);

  // Manual token refresh function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔄 Manually refreshing token...');
      const refreshed = await keycloak.updateToken(30);
      if (refreshed && keycloak.token) {
        console.log('✅ Token refreshed successfully');
        setToken(keycloak.token);
        return true;
      }
      console.log('ℹ️ Token still valid, no refresh needed');
      return true;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      logout();
      return false;
    }
  }, [logout]);

  // Enhanced role checking functions with debugging
  const hasRole = useCallback((role: string): boolean => {
    const hasRoleResult = keycloak.hasRealmRole(role);
    console.log(`🔍 Checking role "${role}":`, hasRoleResult);
    console.log('Available roles:', keycloak.realmAccess?.roles || []);
    return hasRoleResult;
  }, []);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    const result = roles.some(role => keycloak.hasRealmRole(role));
    console.log(`🔍 Checking any of roles [${roles.join(', ')}]:`, result);
    console.log('Available roles:', keycloak.realmAccess?.roles || []);
    return result;
  }, []);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;
    console.log('🚀 Initializing Keycloak...');
    console.log('Keycloak config:', {
      url: keycloak.authServerUrl,
      realm: keycloak.realm,
      clientId: keycloak.clientId
    });

    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          checkLoginIframe: false,
          pkceMethod: 'S256',
        });

        console.log('🔑 Keycloak init result:', authenticated);

        if (authenticated && keycloak.token) {
          console.log('✅ User is authenticated');
          console.log('Token info:', {
            token: keycloak.token?.substring(0, 50) + '...',
            refreshToken: keycloak.refreshToken?.substring(0, 50) + '...',
            subject: keycloak.subject,
            realm: keycloak.realm
          });

          // CRITICAL: Set token first, then authentication state
          setToken(keycloak.token);
          setIsAuthenticated(true);
          
          // Load user profile
          try {
            const profile = await keycloak.loadUserProfile();
            setUser(profile);
            console.log('👤 User profile loaded:', profile);
            console.log('🎭 User roles:', keycloak.realmAccess?.roles || []);
          } catch (error) {
            console.error('❌ Failed to load user profile:', error);
          }

          // Set up token refresh with better error handling
          intervalRef.current = setInterval(async () => {
            try {
              const refreshed = await keycloak.updateToken(70);
              if (refreshed && keycloak.token) {
                console.log('🔄 Token refreshed successfully');
                setToken(keycloak.token);
              } else {
                console.log('✅ Token still valid, no refresh needed');
              }
            } catch (error) {
              console.error('❌ Failed to refresh token:', error);
              console.log('🔓 Redirecting to login due to token refresh failure');
              logout();
            }
          }, 60000); // Check every minute

        } else {
          console.log('❌ User is not authenticated');
          setIsAuthenticated(false);
          setToken(null);
        }
      } catch (error) {
        console.error('❌ Keycloak initialization failed:', error);
        setIsAuthenticated(false);
        setToken(null);
      } finally {
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    };

    initKeycloak();

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - run only once

  // Debug token changes
  useEffect(() => {
    if (token) {
      console.log('🎫 Token updated in context, length:', token.length);
      
      // Validate token format
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 Token payload preview:', {
          sub: payload.sub,
          iss: payload.iss,
          aud: payload.aud,
          exp: new Date(payload.exp * 1000),
          realm_access: payload.realm_access,
        });

        // Check expiration
        const now = Date.now() / 1000;
        if (payload.exp <= now) {
          console.warn('⚠️ Token is expired in context!');
        }
      } catch (e) {
        console.error('❌ Invalid token format in context:', e);
      }
    } else {
      console.log('❌ No token in context');
    }
  }, [token]);

  const value: AuthContextType = {
    isAuthenticated,
    loading,
    user,
    token,
    login,
    logout,
    hasRole,
    hasAnyRole,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};