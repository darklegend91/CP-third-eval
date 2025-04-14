import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProfilePage from './pages/profile/ProfilePage';
import ProblemDetail from './pages/problems/ProblemDetail';
import CreateProblem from './pages/problems/CreateProblem';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ClassManagement from './pages/classes/ClassManagement';  // New import
import ClassDetail from './pages/classes/ClassDetail';        // New import
import CreateClassPage from './pages/classes/CreateClassPage';
import PlaylistDetail from './pages/playlists/PlaylistDetail';
import PlaylistList from './pages/playlists/PlaylistList';
import SubmissionsPage from './pages/profile/SubmissionsPage';


// Components
import Navbar from './components/layout/Navbar';
import ProblemList from './components/problems/ProblemList';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Home Page Component
function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="main-container">
        <main className="content">
          <h1>All Problems</h1>
          <p className="description">
            Gain expertise in programming concepts with our comprehensive problem collection.
          </p>
          <ProblemList />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/problems/:problemId" element={<ProblemDetail />} />
          <Route path="/create-class"element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><CreateClassPage /></ProtectedRoute>}/>
          <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
          <Route path="/playlists" element={<PlaylistList />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
    

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Teacher/Admin Routes */}
          <Route
            path="/create-problem"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <CreateProblem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <ClassManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:id"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <ClassDetail />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
