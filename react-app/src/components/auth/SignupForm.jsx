// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import '../../styles/auth.css';

// function SignupForm() {
//   const navigate = useNavigate();
//   const { signup } = useAuth();
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     rollNumber: '',
//     dob: '',
//     email: '',
//     gender: '',
//     password: '',
//     address: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const result = await signup(formData);
//       if (result.success) {
//         navigate('/');
//       } else {
//         setError(result.message);
//       }
//     } catch (err) {
//       setError('An error occurred during signup.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Create Account</h1>
//       {error && <div className="error-message">{error}</div>}
      
//       <form id="signupForm" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="number"
//           name="rollNumber"
//           placeholder="Roll Number"
//           value={formData.rollNumber}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="date"
//           name="dob"
//           value={formData.dob}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <div className="gender-group">
//           <label>Gender:</label>
//           <label>
//             <input
//               type="radio"
//               name="gender"
//               value="male"
//               checked={formData.gender === 'male'}
//               onChange={handleChange}
//               required
//             /> Male
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="gender"
//               value="female"
//               checked={formData.gender === 'female'}
//               onChange={handleChange}
//               required
//             /> Female
//           </label>
//         </div>
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="address"
//           rows="2"
//           placeholder="Address"
//           value={formData.address}
//           onChange={handleChange}
//           required
//         ></textarea>
//         <button type="submit" disabled={loading}>
//           {loading ? 'Creating Account...' : 'Sign Up'}
//         </button>
//       </form>
      
//       <p>
//         Already have an account?
//         <Link to="/login"> Login here</Link>
//       </p>
//     </div>
//   );
// }

// export default SignupForm;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/auth.css';

export default function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
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
      const result = await signup(formData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

