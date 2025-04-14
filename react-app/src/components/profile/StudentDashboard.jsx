import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

function CreatePlaylistModal({ onClose, onPlaylistCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/playlists', { name });
      onPlaylistCreated(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">×</button>
        <h2>Create Playlist</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Playlist Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StudentDashboard({ playlists = [], submissions = [], favorites = [] }) {
  const [myPlaylists, setMyPlaylists] = useState(playlists);
  const [showModal, setShowModal] = useState(false);

  const handleNewPlaylist = (newPl) => setMyPlaylists([...myPlaylists, newPl]);

  return (
    <div className="student-dashboard">
      <div className="dashboard-card">
        <h3>My Playlists</h3>
        {myPlaylists.length > 0 ? (
          <ul className="playlist-list">
            {myPlaylists.map(playlist => (
              <li key={playlist.id} className="playlist-item">
                {/* <Link to={`/playlist/${playlist.id}`}> */}
                <Link to={`/api/problems/${playlist.id}`}>
                  <span className="playlist-name">{playlist.name}</span>
                  <span className="problem-count">
                    {playlist.problems?.length || 0} problems
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">You haven't created any playlists yet.</p>
        )}
        <button className="action-button" onClick={() => setShowModal(true)}>
          + Create Playlist
        </button>
      </div>

      <div className="dashboard-card">
        <h3>Favorite Problems</h3>
        {favorites.length > 0 ? (
          <ul className="favorites-list">
            {favorites.map(problem => (
              <li key={problem.id} className="favorite-item">
                <Link to={`/problem/${problem.id}`}>
                  <span className="problem-title">{problem.title}</span>
                  <span className={`difficulty ${problem.difficulty}`}>
                    {problem.difficulty}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">You haven't added any favorites yet.</p>
        )}
      </div>

      <div className="dashboard-card">
        <h3>Recent Submissions</h3>
        {submissions.length > 0 ? (
          <ul className="submissions-list">
            {submissions.slice(0, 5).map(submission => (
              <li key={submission.id} className="submission-item">
                <Link to={`/problem/${submission.problemId}`}>
                  Problem #{submission.problemId}
                </Link>
                <span className={`status ${submission.status}`}>
                  {submission.status}
                </span>
                <span className="submission-date">
                  {new Date(submission.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">You haven't submitted any solutions yet.</p>
        )}
        <Link to="/submissions" className="action-button">
          View All Submissions
        </Link>
      </div>

      {showModal && (
        <CreatePlaylistModal
          onClose={() => setShowModal(false)}
          onPlaylistCreated={handleNewPlaylist}
        />
      )}
    </div>
  );
}
