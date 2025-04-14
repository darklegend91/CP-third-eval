import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/layout.css';
import { useState } from 'react';

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="top-nav">
      <div className="top-nav-left">
        <Link to="/" className="logo">Rapid Code</Link>
        <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/">Problems</Link>
          {/* <Link to="/practice">Practice</Link>
          <Link to="/compete">Compete</Link>
          <Link to="/discuss">Discuss</Link> */}
          {(isTeacher || isAdmin) && (
            <Link to="/create-problem">Create Problem</Link>
          )}
          {(isTeacher || isAdmin) && (
            <Link to="/classes">My Classes</Link>
          )}
        </nav>
      </div>
      <div className="top-nav-right">
        {isAuthenticated ? (
          <div className="user-section">
            <Link to="/profile" className="upgrade-btn">
              {user?.name || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="upgrade-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;



// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import '../../styles/layout.css';

// function Navbar() {
//   const { user, logout, isAuthenticated, isAdmin, isTeacher } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <header className="top-nav">
//       <div className="top-nav-left">
//         <Link to="/" className="logo">Rapid Code</Link>
//         <nav className="nav-links">
//           <Link to="/">Courses</Link>
//           <Link to="/practice">Practice</Link>
//           <Link to="/compete">Compete</Link>
//           <Link to="/discuss">Discuss</Link>

//           {/* Role-specific navigation links */}
//           {isAdmin && <Link to="/admin">Admin</Link>}
//           {(isTeacher || isAdmin) && (
//             <Link to="/create-problem">Create Problem</Link>
//           )}
//           {(isTeacher || isAdmin) && (
//             <Link to="/classes" className="nav-link">
//               My Classes
//             </Link>
//           )}
//         </nav>
//       </div>
//       <div className="top-nav-right">
//         {isAuthenticated ? (
//           <>
//             <Link to="/profile" className="upgrade-btn">Profile</Link>
//             <button onClick={handleLogout} className="logout-btn">Logout</button>
//           </>
//         ) : (
//           <div className="auth-buttons">
//             <Link to="/login" className="upgrade-btn">Login</Link>
//             <Link to="/signup" className="signup-btn">Sign Up</Link>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

// export default Navbar;
