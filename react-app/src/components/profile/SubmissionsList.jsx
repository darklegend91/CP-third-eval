import { useState, useEffect } from 'react';
import api from '../../api/client';
import '../../styles/profile.css';

function SubmissionsList({ userId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get(`/submissions/user/${userId}`);
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions');
        setLoading(false);
      }
    };

    if (userId) {
      fetchSubmissions();
    }
  }, [userId]);

  if (loading) return <div className="loading">Loading submissions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="submissions-list-component">
      <h3>Submissions</h3>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <ul className="submissions-list">
          {submissions.map(submission => (
            <li key={submission.id} className="submission-item">
              <div className="submission-header">
                <strong>Problem ID:</strong> {submission.problemId}
                <span className={`status ${submission.status}`}>{submission.status}</span>
              </div>
              <div className="submission-details">
                <div><strong>Runtime:</strong> {submission.runtime}</div>
                <div><strong>Language:</strong> {submission.language}</div>
                <div><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleString()}</div>
              </div>
              <div className="submission-code">
                <pre>{submission.code}</pre>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SubmissionsList;
