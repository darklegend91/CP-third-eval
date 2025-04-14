import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import '../../styles/problems.css';

function ProblemCard({ problem }) {
  const { isAuthenticated, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(
    user?.favorites?.includes(problem.id)
  );

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await api.delete(`/favorites/${problem.id}`);
        setIsFavorite(false);
      } else {
        // Add to favorites
        await api.post('/favorites', { problemId: problem.id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <div className="roadmap-card">
      <Link to={`/problem/${problem.id}`}>
        <div className="roadmap-image">
          <img src="/assets/python.svg" alt={`${problem.title} icon`} />
        </div>
        <div className="roadmap-info">
          <h2>{problem.title}</h2>
          <p>{problem.description}</p>
          <p>Difficulty: {problem.difficulty}</p>
        </div>
      </Link>
      {isAuthenticated && (
        <span 
          className={`favorite-icon ${isFavorite ? 'favorited' : ''}`}
          onClick={toggleFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? '♥' : '♡'}
        </span>
      )}
    </div>
  );
}

export default ProblemCard;
