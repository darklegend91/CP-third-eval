import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/client';
import CreateClassModal from '../../components/teacher/CreateClassModal';
import '../../styles/classes.css';
import Navbar from '../../components/layout/Navbar';

export default function ClassManagement() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showClassModal, setShowClassModal] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // const response = await api.get(`/teachers/${user.id}/classes`);
        const response = await api.get(`/classes/teacher/${user.id}`);
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes');
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user.id]);

  const handleClassCreated = (newClass) => {
    setClasses(prev => [...prev, newClass]);
    setShowClassModal(false);
  };

  if (loading) return <div className="loading">Loading classes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="classes-header">
        <h1>My Classes</h1>
        <button 
          className="create-class-btn" 
          onClick={() => setShowClassModal(true)}
        >
          Create New Class
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="no-classes">
          <p>You haven't created any classes yet.</p>
          <button className="create-class-btn" onClick={() => setShowClassModal(true)}>Create Your First Class</button>
        </div>
      ) : (
        <div className="classes-grid">
          {classes.map(classItem => (
            <div key={classItem.id} className="class-card">
              <h2>{classItem.name}</h2>
              <p>{classItem.description}</p>
              <div className="class-stats">
                <span>{classItem.students?.length || 0} Students</span>
                <span>{classItem.problems?.length || 0} Problems</span>
              </div>
              <Link to={`/classes/${classItem.id}`} className="view-class-btn">View Class</Link>
            </div>
          ))}
        </div>
      )}

      {showClassModal && (
        <CreateClassModal 
          onClose={() => setShowClassModal(false)}
          onClassCreated={handleClassCreated}
        />
      )}
    </div>
  );
}
