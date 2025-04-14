import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/client';
import Navbar from '../../components/layout/Navbar';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlistSelections, setPlaylistSelections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch submissions for user
    const fetchSubmissions = async () => {
      try {
        const subResp = await api.get(`/submissions/user/${user.id}`);
        setSubmissions(subResp.data || []);
      } catch (e) {
        setSubmissions([]);
      }
    };

    // Fetch user's playlists
    const fetchPlaylists = async () => {
      try {
        const plResp = await api.get(`/playlists/user/${user.id}`);
        setPlaylists(plResp.data || []);
      } catch (e) {
        setPlaylists([]);
      }
    };

    if (user?.id) {
      fetchSubmissions();
      fetchPlaylists();
      setLoading(false);
    }
  }, [user]);

  const handleAddToPlaylist = async (submissionId, problemId) => {
    const selectedPlaylistId = playlistSelections[submissionId];
    if (!selectedPlaylistId) {
      alert('Please select a playlist!');
      return;
    }
    try {
      await api.post(`/playlists/${selectedPlaylistId}/problems/${problemId}`);
      alert('Problem added to playlist!');
    } catch (err) {
      alert('Failed to add to playlist.');
    }
  };

  const handleSelectionChange = (submissionId, playlistId) => {
    setPlaylistSelections(prev => ({
      ...prev,
      [submissionId]: playlistId
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <Navbar></Navbar>
    <div className="submissions-page">
      <h2>My Submissions</h2>
      <ul>
        {submissions.map(sub => (
          <li key={sub.id} style={{ marginBottom: '1.5rem' }}>
            <div>
              Problem #{sub.problemId} - <b>{sub.status}</b>
              <span style={{ marginLeft: '1em', color: '#888', fontSize: '0.92em' }}>
                [{new Date(sub.createdAt).toLocaleString()}]
              </span>
            </div>

            {/* Playlist add section */}
            <div style={{ marginTop: '0.3em' }}>
              <select
                value={playlistSelections[sub.id] || ''}
                onChange={e => handleSelectionChange(sub.id, e.target.value)}
              >
                <option value="">Add to Playlist</option>
                {playlists.map(pl => (
                  <option key={pl.id} value={pl.id}>{pl.name}</option>
                ))}
              </select>
              <button
                style={{ marginLeft: '0.4em' }}
                onClick={() => handleAddToPlaylist(sub.id, sub.problemId)}
              >
                Add
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
