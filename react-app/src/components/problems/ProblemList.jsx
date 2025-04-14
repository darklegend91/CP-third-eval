import { useEffect, useState } from 'react';
import ProblemCard from './ProblemCard';
import api from '../../api/client';
import '../../styles/problems.css';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get('/problems');
        setProblems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError('Failed to load problems. Please try again later.');
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) return <div className="loading">Loading problems...</div>;
  if (error) return <div className="error">{error}</div>;
  if (problems.length === 0) return <div>No problems found.</div>;

  return (
    <div className="roadmap-list">
      {problems.map(problem => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}

export default ProblemList;
