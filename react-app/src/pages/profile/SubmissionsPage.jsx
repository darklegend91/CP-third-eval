// import React, { useEffect, useState } from 'react';
// import api from '../../api/client';
// import { useAuth } from '../../contexts/AuthContext';

// export default function SubmissionsPage() {
//   const { user } = useAuth(); // Get the current logged-in user
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         const response = await api.get(`/submissions/user/${user.id}`);
//         setSubmissions(response.data);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching submissions:', err);
//         setError('Failed to load submissions');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.id) {
//       fetchSubmissions();
//     }
//   }, [user]);

//   if (loading) return <div className="loading">Loading submissions...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="submissions-page">
//       <h2>My Submissions</h2>
      
//       {submissions.length > 0 ? (
//         <table className="submissions-table">
//           <thead>
//             <tr>
//               <th>Problem ID</th>
//               <th>Status</th>
//               <th>Submitted At</th>
//               <th>Language</th>
//             </tr>
//           </thead>
//           <tbody>
//             {submissions.map((submission) => (
//               <tr key={submission.id}>
//                 <td>
//                   <a href={`/problem/${submission.problemId}`}>
//                     {submission.problemId}
//                   </a>
//                 </td>
//                 <td className={`status ${submission.status}`}>
//                   {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
//                 </td>
//                 <td>{new Date(submission.createdAt).toLocaleString()}</td>
//                 <td>{submission.language}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="empty-message">You haven't made any submissions yet.</p>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/client';

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
  );
}
