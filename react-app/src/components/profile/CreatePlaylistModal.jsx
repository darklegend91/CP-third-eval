import { useState } from 'react';
import api from '../../api/client';

export default function CreatePlaylistModal({ onClose, onPlaylistCreated }) {
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
