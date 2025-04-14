import React from 'react';

export default function UserProfileCard({ user }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {/* If you have user avatars, display them here */}
          <div className="avatar-placeholder">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="role-badge">{user.role}</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{user.email}</span>
        </div>
        {user.rollNumber && (
          <div className="detail-row">
            <span className="detail-label">Roll Number:</span>
            <span className="detail-value">{user.rollNumber}</span>
          </div>
        )}
        <div className="detail-row">
          <span className="detail-label">Joined:</span>
          <span className="detail-value">{formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
