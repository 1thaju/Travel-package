import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Set up axios interceptor for authentication
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('/api/auth/me');
                console.log('Auth status response:', response.data);
                setUser(response.data.user);
            }
        } catch (error) {
            console.log('Auth status error:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError('');
            return true;
        } catch (error) {
            console.log('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const adminLogin = async (email, password) => {
        try {
            console.log('Attempting admin login with:', { email, password });
            const response = await axios.post('/api/auth/admin/login', 
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Admin login response:', response.data);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError('');
            return true;
        } catch (error) {
            console.log('Admin login error:', error);
            setError(error.response?.data?.message || 'Admin login failed');
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('/api/auth/register', { name, email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError('');
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setError('');
    };

    const value = {
        user,
        loading,
        error,
        login,
        adminLogin,
        register,
        logout,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 