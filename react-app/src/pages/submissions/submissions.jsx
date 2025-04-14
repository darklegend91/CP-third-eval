import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import Navbar from '../../components/layout/Navbar';
import '../../styles/submissions.css';

function Submissions() {
  const { user, isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProblemId, setSelectedProblemId] = useState('all');
  const [uniqueProblems, setUniqueProblems] = useState([]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await api.get('/submissions');
        setSubmissions(response.data);
        
        // Extract unique problem IDs for filtering
        const problemIds = [...new Set(response.data.map(sub => sub.problemId))];
        setUniqueProblems(problemIds);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions. Please try again later.');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [isAuthenticated]);

  // Filter submissions based on selected problem ID
  const filteredSubmissions = selectedProblemId === 'all' 
    ? submissions 
    : submissions.filter(sub => sub.problemId === selectedProblemId);

  return (
    <div className="submissions-page">
      <Navbar />
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>Submissions</span>
      </div>
      
      <div className="submissions-container">
        <h1>Your Submissions</h1>
        
        {/* Problem filter */}
        {uniqueProblems.length > 0 && (
          <div className="filter-container">
            <label htmlFor="problem-filter">Filter by Problem: </label>
            <select 
              id="problem-filter" 
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
            >
              <option value="all">All Problems</option>
              {uniqueProblems.map(id => (
                <option key={id} value={id}>Problem #{id}</option>
              ))}
            </select>
          </div>
        )}
        
        {loading ? (
          <div className="loading-spinner">Loading submissions...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="no-submissions">
            <p>No submissions found. Try solving some problems!</p>
            <Link to="/" className="solve-btn">Solve Problems</Link>
          </div>
        ) : (
          <div className="submissions-list">
            {filteredSubmissions.map(submission => (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <h3>
                    <Link to={`/problem/${submission.problemId}`}>
                      Problem #{submission.problemId}
                    </Link>
                  </h3>
                  <span className={`status ${submission.status || 'pending'}`}>
                    {submission.status || 'Pending'}
                  </span>
                </div>
                
                <div className="submission-meta">
                  <div className="meta-item">
                    <strong>Submitted:</strong> {new Date(submission.timestamp || submission.createdAt).toLocaleString()}
                  </div>
                  <div className="meta-item">
                    <strong>Runtime:</strong> {submission.runtime || 'N/A'}
                  </div>
                  {submission.complexity && (
                    <div className="meta-item">
                      <strong>Complexity:</strong> {submission.complexity}
                    </div>
                  )}
                  {submission.testCasesPassed !== undefined && (
                    <div className="meta-item">
                      <strong>Test Cases Passed:</strong> {submission.testCasesPassed}
                    </div>
                  )}
                  {submission.language && (
                    <div className="meta-item">
                      <strong>Language:</strong> {submission.language}
                    </div>
                  )}
                </div>
                
                <div className="submission-code">
                  <h4>Code:</h4>
                  <pre>{submission.code}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Submissions;
