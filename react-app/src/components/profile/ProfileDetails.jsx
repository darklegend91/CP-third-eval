import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import '../../styles/profile.css';

function ProfileDetails() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await api.get('/profile');
        setProfileData(profileResponse.data);
        
        // Fetch user's submissions
        const submissionsResponse = await api.get('/submissions');
        setSubmissions(submissionsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profileData) return <div>No profile data found.</div>;

  return (
    <section className="profile-section">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="/assets/profile.svg" alt="User Avatar" />
        </div>
        <div className="profile-info">
          <h1>{profileData.name || user.name}</h1>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="profile-card">
        <div className="detail-row">
          <strong>Full Name:</strong> <span>{profileData.name || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <strong>Email:</strong> <span>{profileData.email || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <strong>Country:</strong> <span>{profileData.country || 'India'}</span>
        </div>
        <div className="detail-row">
          <strong>Role:</strong> <span>{profileData.role || 'Student'}</span>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="submissions-section">
        <div className="section-header">
          <h2>Your Submissions</h2>
        </div>
        <ul className="submissions-list">
          {submissions.length > 0 ? (
            submissions.map(submission => (
              <li key={submission.id}>
                <strong>Problem ID:</strong> {submission.problemId} | 
                <strong>Runtime:</strong> {submission.runtime} | 
                <strong>Status:</strong> {submission.status || 'Pending'}
              </li>
            ))
          ) : (
            <li>No submissions yet.</li>
          )}
        </ul>
      </div>
    </section>
  );
}

export default ProfileDetails;
