// // import { useState } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import { useAuth } from '../../hooks/useAuth'; // This remains the same
// // import '../../styles/auth.css';

// // function LoginForm() {
// //   const navigate = useNavigate();
// //   const { login } = useAuth();
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
    
// //     try {
// //       const result = await login({ email, password });
// //       if (result.success) {
// //         navigate('/');
// //       } else {
// //         setError(result.message);
// //       }
// //     } catch (err) {
// //       setError('An error occurred during login.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="form-container">
// //       <h2>Login</h2>
// //       {error && <div className="error-message">{error}</div>}
      
// //       <form id="loginForm" onSubmit={handleSubmit}>
// //         <input 
// //           type="email" 
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           placeholder="Email" 
// //           required 
// //         />
// //         <input 
// //           type="password" 
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           placeholder="Password" 
// //           required 
// //         />
// //         <button type="submit" disabled={loading}>
// //           {loading ? 'Logging in...' : 'Login'}
// //         </button>
// //       </form>
      
// //       <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
// //     </div>
// //   );
// // }

// // export default LoginForm;

// // import { useState } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import { useAuth } from '../../hooks/useAuth';
// // import '../../styles/auth.css';

// // function LoginForm() {
// //   const navigate = useNavigate();
// //   const { login } = useAuth();
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
    
// //     try {
// //       const result = await login({ email, password });
// //       if (result.success) {
// //         navigate('/');
// //       } else {
// //         setError(result.message);
// //       }
// //     } catch (err) {
// //       setError('An error occurred during login.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="form-container">
// //       <h2>Login</h2>
// //       {error && <div className="error-message">{error}</div>}
      
// //       <form id="loginForm" onSubmit={handleSubmit}>
// //         <input 
// //           type="email" 
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           placeholder="Email" 
// //           required 
// //         />
// //         <input 
// //           type="password" 
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           placeholder="Password" 
// //           required 
// //         />
// //         <button type="submit" disabled={loading}>
// //           {loading ? 'Logging in...' : 'Login'}
// //         </button>
// //       </form>
      
// //       <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
// //     </div>
// //   );
// // }

// // export default LoginForm;

// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import '../../styles/auth.css';

// function LoginForm() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     try {
//       const result = await login({ email, password });
//       if (result.success) {
//         navigate('/');
//       } else {
//         setError(result.message || 'Invalid credentials');
//       }
//     } catch (err) {
//       setError('Connection error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Login</h2>
//       {error && <div className="error-message">{error}</div>}
      
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
      
//       <p>
//         Don't have an account?{' '}
//         <Link to="/signup" className="auth-link">
//           Sign up here
//         </Link>
//       </p>
//     </div>
//   );
// }

// export default LoginForm;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/auth.css';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(credentials);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

