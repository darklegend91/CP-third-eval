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

// import { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../api/client';
// import LoginPromptModal from '../../components/common/LoginPromptModal';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import '../../styles/problems.css'; // Make sure you have this import

// export default function ProblemDetail() {
//   const { id: problemId } = useParams();
//   const { user, isAuthenticated } = useAuth();
  
//   // State declarations
//   const [problem, setProblem] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [solution, setSolution] = useState('');
//   const [submissionStatus, setSubmissionStatus] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch problem details
//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const res = await api.get(`/api/problems/${problemId}`);
//         setProblem(res.data);
//         setError(null);
//       } catch (err) {
//         setError('Failed to load problem');
//         console.error('Error fetching problem:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchProblem();
//   }, [problemId]);

//   // Check if problem is favorite
//   useEffect(() => {
//     if (user?.id && user?.favorites?.includes(problemId)) {
//       setIsFavorite(true);
//     }
//   }, [user, problemId]);

//   const handleFavorite = useCallback(async () => {
//     if (!isAuthenticated) {
//       setShowLoginPrompt(true);
//       return;
//     }

//     try {
//       const { data } = await api.patch(`/users/${user.id}/favorites/${problemId}`);
//       setIsFavorite(data.favorites.includes(problemId));
//     } catch (error) {
//       console.error('Failed to update favorites:', error);
//       // Optional: Show error to user
//     }
//   }, [isAuthenticated, user, problemId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       setShowLoginPrompt(true);
//       return;
//     }
    
//     setSubmissionStatus('loading');
//     try {
//       const res = await api.post(`/submissions`, {
//         problemId,
//         code: solution,
//         language: 'javascript'
//       });
//       setSubmissionStatus(res.data.status || 'submitted');
//     } catch (err) {
//       setSubmissionStatus('error');
//       console.error('Submission error:', err);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return <div className="loading">Loading problem details...</div>;
//   }

//   // Error state
//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   // Problem not found
//   if (!problem) {
//     return <div className="error-message">Problem not found</div>;
//   }

//   // Main render
//   return (
//     <div className="problem-detail">
//       <div className="problem-header">
//         <h1>{problem.title}</h1>
//         <button 
//           onClick={handleFavorite}
//           className={`favorite-button ${isFavorite ? 'active' : ''}`}
//           aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
//         >
//           {isFavorite ? <FaHeart /> : <FaRegHeart />}
//         </button>
//       </div>

//       <div className="problem-meta">
//         <span className={`difficulty ${problem.difficulty}`}>
//           {problem.difficulty}
//         </span>
//       </div>

//       <div className="problem-description">
//         <h3>Description</h3>
//         <p>{problem.description}</p>
        
//         {problem.constraints?.length > 0 && (
//           <>
//             <h4>Constraints</h4>
//             <ul>
//               {problem.constraints.map((c, i) => (
//                 <li key={i}>{c}</li>
//               ))}
//             </ul>
//           </>
//         )}

//         {problem.testCases?.length > 0 && (
//           <>
//             <h4>Examples</h4>
//             {problem.testCases.map((ex, i) => (
//               <div key={i} className="example">
//                 <div><b>Input:</b> {ex.input}</div>
//                 <div><b>Output:</b> {ex.output}</div>
//               </div>
//             ))}
//           </>
//         )}
//       </div>

//       <div className="problem-submission">
//         <h3>Your Solution</h3>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             rows={10}
//             value={solution}
//             onChange={(e) => setSolution(e.target.value)}
//             placeholder="// Write your code here"
//             disabled={!isAuthenticated}
//           />
//           <button
//             type="submit"
//             className="action-button"
//             disabled={!isAuthenticated || submissionStatus === 'loading'}
//           >
//             {isAuthenticated
//               ? submissionStatus === 'loading'
//                 ? 'Submitting...'
//                 : 'Submit Code'
//               : 'Login To Submit'}
//           </button>
//         </form>

//         {submissionStatus && (
//           <div className={`submission-status ${submissionStatus}`}>
//             {submissionStatus === 'accepted' && '✅ Accepted'}
//             {submissionStatus === 'rejected' && '❌ Not Accepted'}
//             {submissionStatus === 'error' && '❗ Error Submitting. Try again.'}
//             {submissionStatus === 'submitted' && 'Submission received!'}
//           </div>
//         )}
//       </div>

//       <LoginPromptModal
//         isOpen={showLoginPrompt}
//         onClose={() => setShowLoginPrompt(false)}
//       />
//     </div>
//   );
// }
