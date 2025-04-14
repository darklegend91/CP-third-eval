import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import Navbar from '../../components/layout/Navbar';

export default function ClassDetail() {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await api.get(`/classes/${id}`);
        setClassData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch class data');
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!classData) return <div>Class not found</div>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>{classData.name}</h1>
        <p>{classData.description}</p>
        <h2>Students ({classData.students.length})</h2>
        <ul>
          {classData.students.map(student => (
            <li key={student.id}>{student.name} ({student.email})</li>
          ))}
        </ul>
        <h2>Assigned Problems ({classData.problems.length})</h2>
        <ul>
          {classData.problems.map(problem => (
            <li key={problem.id}>{problem.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
