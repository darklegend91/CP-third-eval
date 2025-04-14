import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchProfileData } from '../../api/profileService';
import Navbar from '../../components/layout/Navbar';
import UserProfileCard from '../../components/profile/UserProfileCard';
import StudentDashboard from '../../components/profile/StudentDashboard';
import TeacherDashboard from '../../components/profile/TeacherDashboard';
import AdminDashboard from '../../components/profile/AdminDashboard';
import '../../styles/profile.css';

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin, isTeacher, isStudent } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileData();
        setProfileData(data);
      } catch (error) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProfileData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const renderActionButtons = () => (
    <div className="profile-actions">

      {(isTeacher || isAdmin) && (
        <>
          <Link to="/create-class" className="btn btn-teacher">
            Create Class
          </Link>
          <Link to="/create-problem" className="btn btn-teacher">
            Create Problem
          </Link>
        </>
      )}
    </div>
  );

  const renderDashboard = () => {
    if (!profileData || !user) return null;

    // Safely handle role display
    const userRole = user?.role || 'user';
    const roleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1);

    return (
      <div className="dashboard-section">
        <h2>{roleDisplay} Dashboard</h2>
        
        {isAdmin && <AdminDashboard users={profileData.users} stats={profileData.stats} />}
        {isTeacher && (
          <TeacherDashboard 
            classes={profileData.classes} 
            problems={profileData.problems} 
            submissions={profileData.classSubmissions} 
          />
        )}
        {isStudent && (
          <StudentDashboard 
            playlists={profileData.playlists} 
            submissions={profileData.submissions} 
            favorites={profileData.favorites} 
          />
        )}
      </div>
    );
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="container">
        <h1>My Profile</h1>
        
        {loading ? (
          <div className="loading">Loading profile data...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="profile-content">
            <div className="profile-header">
              <UserProfileCard user={profileData?.user || {}} />
              {renderActionButtons()}
            </div>
            {renderDashboard()}
          </div>
        )}
      </div>
    </div>
  );
}