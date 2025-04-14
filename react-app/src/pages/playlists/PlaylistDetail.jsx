import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import '../../styles/problems.css';

export default function PlaylistDetail() {
  const { playlistId } = useParams(); // Correct param for playlist!

  const [playlist, setPlaylist] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylistAndProblems = async () => {
      try {
        // 1. Fetch playlist
        const playlistResponse = await api.get(`/playlists/${playlistId}`);
        setPlaylist(playlistResponse.data);

        // 2. Fetch all problems
        const allProblemsResponse = await api.get('/problems');
        const allProblems = allProblemsResponse.data;

        // 3. Filter problems in the playlist
        const playlistProblemIds = playlistResponse.data.problems || [];
        const playlistProblems = allProblems.filter(p => playlistProblemIds.includes(p.id));
        setProblems(playlistProblems);

        setError(null);
      } catch (err) {
        setError('Failed to load playlist details.');
        setPlaylist(null);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylistAndProblems();
    } else {
      setError('No playlist ID in URL');
      setLoading(false);
    }
  }, [playlistId]);

  if (loading) return <div className="loading">Loading playlist...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!playlist) return <div className="error-message">Playlist not found</div>;

  return (
    <div className="playlist-detail">
      <div className="playlist-header">
        <h1>{playlist.name}</h1>
        <p>{problems.length} Problems</p>
      </div>

      <div className="problems-list">
        {problems.length > 0 ? (
          <ul>
            {problems.map((problem) => (
              <li key={problem.id} className="problem-item">
                {/* Link to ProblemDetail using frontend route */}
                <Link to={`/problems/${problem.id}`}>
                  <span className="problem-title">{problem.title}</span>
                  <span className={`difficulty ${problem.difficulty}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No problems in this playlist.</p>
        )}
      </div>
    </div>
  );
}