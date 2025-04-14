import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/client';
import LoginPromptModal from '../../components/common/LoginPromptModal';
import '../../styles/problem.css';

export default function ProblemDetail() {
  const { id: problemId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [problem, setProblem] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/problems/${problemId}`);
        setProblem(response.data);
      } catch (err) {
        setError('Failed to load problem details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  // Authentication handling
  const handleAuthAction = useCallback((actionCallback) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      actionCallback();
    }
  }, [isAuthenticated]);

  // Form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleAuthAction(async () => {
      try {
        await api.post('/submissions', {
          problemId,
          code,
          language: 'javascript'
        });
        navigate('/submissions');
      } catch (err) {
        console.error('Submission failed:', err);
      }
    });
  }, [code, problemId, handleAuthAction, navigate]);

  // Favorite handling
  const handleFavorite = useCallback(() => {
    handleAuthAction(async () => {
      try {
        await api.patch(`/users/${user.id}/favorites/${problemId}`);
      } catch (err) {
        console.error('Failed to update favorites:', err);
      }
    });
  }, [handleAuthAction, user?.id, problemId]);

  // Loading and error states
  if (loading) return <div className="loading">Loading problem...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!problem) return <div className="error">Problem not found</div>;

  // Calculate favorite status
  const isFavorite = user?.favorites?.includes(problemId) || false;

  return (
    <div className="problem-detail">
      {/* Problem Header */}
      <div className="problem-header">
        <h1>{problem.title}</h1>
        <div className="problem-meta">
          <span className={`difficulty ${problem.difficulty}`}>
            {problem.difficulty}
          </span>
          <span className="problem-id">ID: {problem.id}</span>
        </div>
      </div>

      {/* Problem Content */}
      <div className="problem-content">
        <div className="description-section">
          <h3>Description</h3>
          <p>{problem.description}</p>
          
          {problem.constraints?.length > 0 && (
            <div className="constraints">
              <h4>Constraints</h4>
              <ul>
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Interactive Section */}
        <div className="interactive-section">
          {isAuthenticated ? (
            <>
              <div className="action-buttons">
                <button 
                  className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                  onClick={handleFavorite}
                >
                  {isFavorite ? '❤️ Unfavorite' : '♡ Favorite'}
                </button>
                <PlaylistSelector 
                  problemId={problemId}
                  playlists={user?.playlists || []}
                />
              </div>
              
              <form onSubmit={handleSubmit} className="submission-form">
                <h3>Your Solution</h3>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Write your code here"
                  rows={10}
                />
                <button type="submit">Submit Code</button>
              </form>
            </>
          ) : (
            <div className="auth-prompt">
              <p>Want to solve this problem?</p>
              <button 
                className="login-btn"
                onClick={() => navigate('/login')}
              >
                Login to Submit Code
              </button>
            </div>
          )}
        </div>
      </div>

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => navigate('/login')}
      />
    </div>
  );
}

// Playlist Selector Component
const PlaylistSelector = ({ problemId, playlists }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) return;
    
    try {
      await api.post(`/playlists/${selectedPlaylist}/problems/${problemId}`);
      alert('Added to playlist!');
    } catch (err) {
      alert('Failed to add to playlist');
    }
  };

  return (
    <div className="playlist-selector">
      <select 
        value={selectedPlaylist} 
        onChange={(e) => setSelectedPlaylist(e.target.value)}
      >
        <option value="">Add to Playlist</option>
        {playlists.map(playlist => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
      <button onClick={handleAddToPlaylist}>Add</button>
    </div>
  );
};


// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../api/client';
// import LoginPromptModal from '../../components/common/LoginPromptModal';
// import '../../styles/problem.css';

// export default function ProblemDetail() {
//   const { id } = useParams();
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const [problem, setProblem] = useState(null);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const response = await api.get(`/problems/${id}`);
//         setProblem(response.data);
//       } catch (err) {
//         console.error('Failed to load problem:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchProblem();
//   }, [id]);

//   const handleAuthAction = (actionCallback) => {
//     if (!isAuthenticated) {
//       setShowLoginPrompt(true);
//     } else {
//       actionCallback();
//     }
//   };

//   const handleSubmit = (code) => {
//     handleAuthAction(async () => {
//       try {
//         await api.post('/submissions', { problemId: id, code });
//         navigate('/submissions');
//       } catch (err) {
//         console.error('Submission failed:', err);
//       }
//     });
//   };

//   const handleFavorite = () => {
//     handleAuthAction(async () => {
//       try {
//         await api.patch(`/users/${user.id}/favorites/${id}`);
//         // Update UI state
//       } catch (err) {
//         console.error('Failed to update favorites:', err);
//       }
//     });
//   };

//   if (loading) return <div className="loading">Loading problem...</div>;

//   return (
//     <div className="problem-detail">
//       {/* Problem Header */}
//       <div className="problem-header">
//         <h1>{problem.title}</h1>
//         <div className="problem-meta">
//           <span className={`difficulty ${problem.difficulty}`}>
//             {problem.difficulty}
//           </span>
//           <span className="problem-id">ID: {problem.id}</span>
//         </div>
//       </div>

//       {/* Problem Content - Visible to all */}
//       <div className="problem-content">
//         <div className="description-section">
//           <h3>Description</h3>
//           <p>{problem.description}</p>
          
//           <div className="constraints">
//             <h4>Constraints</h4>
//             <ul>
//               {problem.constraints.map((c, i) => (
//                 <li key={i}>{c}</li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Interactive Sections - Require Login */}
//         <div className="interactive-section">
//           {isAuthenticated ? (
//             <>
//               <button 
//                 className="favorite-btn"
//                 onClick={handleFavorite}
//               >
//                 {problem.isFavorite ? '❤️ Unfavorite' : '♡ Favorite'}
//               </button>
              
//               <SubmissionForm onSubmit={handleSubmit} />
              
//               <PlaylistSelector 
//                 problemId={id}
//                 playlists={user.playlists || []}
//               />
//             </>
//           ) : (
//             <div className="auth-prompt">
//               <p>Want to solve this problem?</p>
//               <button 
//                 className="login-btn"
//                 onClick={() => navigate('/login')}
//               >
//                 Login to Submit Code
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <LoginPromptModal
//         isOpen={showLoginPrompt}
//         onClose={() => setShowLoginPrompt(false)}
//         onLogin={() => navigate('/login')}
//       />
//     </div>
//   );
// }

// // Separate components for better organization
// const SubmissionForm = ({ onSubmit }) => {
//   const [code, setCode] = useState('');

//   return (
//     <form onSubmit={(e) => {
//       e.preventDefault();
//       onSubmit(code);
//     }}>
//       <h3>Your Solution</h3>
//       <textarea
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         placeholder="// Write your code here"
//       />
//       <button type="submit">Submit Code</button>
//     </form>
//   );
// };

// const PlaylistSelector = ({ problemId, playlists }) => {
//   const [selectedPlaylist, setSelectedPlaylist] = useState('');

//   const handleAddToPlaylist = async () => {
//     if (!selectedPlaylist) return;
    
//     try {
//       await api.post(`/playlists/${selectedPlaylist}/problems/${problemId}`);
//       alert('Added to playlist!');
//     } catch (err) {
//       alert('Failed to add to playlist');
//     }
//   };

//   return (
//     <div className="playlist-selector">
//       <select 
//         value={selectedPlaylist} 
//         onChange={(e) => setSelectedPlaylist(e.target.value)}
//       >
//         <option value="">Add to Playlist</option>
//         {playlists.map(playlist => (
//           <option key={playlist.id} value={playlist.id}>
//             {playlist.name}
//           </option>
//         ))}
//       </select>
//       <button onClick={handleAddToPlaylist}>Add</button>
//     </div>
//   );
// };
