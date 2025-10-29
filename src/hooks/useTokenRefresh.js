// src/hooks/useTokenRefresh.js
import { useEffect } from 'react';
import { getAccessToken, getRefreshToken, updateAccessToken, updateRefreshToken, clearAuthData, isAccessTokenExpired } from '../pages/auth/authStorage';
import { AuthApi } from '../api/authApi'; // Fixed from EmployeeAPI
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const useTokenRefresh = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser, setError } = useAuth();

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (isAccessTokenExpired()) {
        const refreshToken = getRefreshToken();
        console.log("Access token expired, attempting to refresh..., refreshToken:", refreshToken);
        if (refreshToken) {
          try {
            const response = await AuthApi.refreshAccessToken(refreshToken); // Fixed
            updateAccessToken(response.accessToken);
            if (response.refreshToken) {
              updateRefreshToken(response.refreshToken);
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            clearAuthData();
            setIsAuthenticated(false);
            setUser(null);
            setError('Session expired. Please log in again.');
            navigate('/login', { replace: true });
          }
        } else {
          clearAuthData();
          setIsAuthenticated(false);
          setUser(null);
          setError('Session expired. Please log in again.');
          navigate('/login', { replace: true });
        }
      }
    };

    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
    checkAndRefreshToken();

    return () => clearInterval(interval);
  }, [navigate, setIsAuthenticated, setUser, setError]);
};