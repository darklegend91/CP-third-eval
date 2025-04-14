import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import '../../styles/problems.css';

function CodeSubmissionForm({ problemId }) {
  const { isAuthenticated } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to submit code');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const response = await api.post('/api/submissions', {
        problemId,
        code,
        language
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit code');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submission-form">
      <h3>Submit Your Solution</h3>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <select 
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="code">Your Code:</label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="10"
            placeholder="Write your solution here..."
            required
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitting || !isAuthenticated}
        >
          {submitting ? 'Submitting...' : 'Submit Solution'}
        </button>
      </form>
      
      {result && (
        <div className={`result ${result.status}`}>
          <h4>Submission Result:</h4>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Runtime:</strong> {result.runtime}</p>
          {result.testCasesPassed && (
            <p><strong>Test Cases Passed:</strong> {result.testCasesPassed}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CodeSubmissionForm;
    