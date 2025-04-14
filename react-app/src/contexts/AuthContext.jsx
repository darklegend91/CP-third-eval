import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';  // Make sure to use your configured axios instance

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Consolidated authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token with backend
          const response = await api.get('/profile');
          setUser(response.data);
        } catch (error) {
          // Invalid token, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/signup', userData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Signup failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Add the 'export' keyword here to fix the error
// export const AuthContext = createContext();

// // Add this to your existing auth context
// useEffect(() => {
//   const checkAuth = async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const response = await api.get('/profile');
//         setUser(response.data);
//       } catch (err) {
//         localStorage.removeItem('token');
//       }
//     }
//   };
//   checkAuth();
// }, []);


// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     if (token && storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const response = await axios.post('/api/login', credentials);
      
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//       setUser(response.data.user);
      
//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.error || 'Login failed'
//       };
//     }
//   };

//   const signup = async (userData) => {
//     try {
//       const response = await axios.post('/api/signup', userData);
      
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//       setUser(response.data.user);
      
//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.error || 'Signup failed'
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     signup,
//     logout,
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin',
//     isTeacher: user?.role === 'teacher',
//     isStudent: user?.role === 'student'
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
