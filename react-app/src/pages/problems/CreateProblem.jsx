import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/problems.css';

function CreateProblem() {
  const navigate = useNavigate();
  const { isTeacher, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    constraints: [],
    testCases: [{ input: '', output: '' }],
    solutionTemplate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not authorized
  if (!isTeacher && !isAdmin) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', output: '' }]
    }));
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length === 1) return;
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: newTestCases });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.testCases.some(tc => !tc.input.trim() || !tc.output.trim())) {
      setError('All test cases must have both input and output');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formattedData = {
        ...formData,
        constraints: formData.constraints.split('\n').filter(c => c.trim()),
        testCases: formData.testCases.map(tc => ({
          input: tc.input.trim(),
          output: tc.output.trim()
        }))
      };

      const response = await api.post('/problems', formattedData);
      setSuccess('Problem created successfully!');
      setTimeout(() => navigate(`/problem/${response.data.id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-problem-page">
      <Navbar />
      
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>Create Problem</span>
      </div>
      
      <div className="create-problem-container">
        <h1>Create New Problem</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter problem title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem in detail"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="constraints">Constraints (one per line)</label>
            <textarea
              id="constraints"
              name="constraints"
              rows="3"
              value={formData.constraints}
              onChange={handleChange}
              placeholder="Example:&#10;1 <= nums.length <= 10^4&#10;-10^9 <= nums[i] <= 10^9"
            />
          </div>

          <div className="form-group">
            <label>Test Cases *</label>
            {formData.testCases.map((tc, index) => (
              <div key={index} className="test-case-group">
                <div className="test-case-inputs">
                  <input
                    type="text"
                    placeholder={`Test case ${index + 1} input`}
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder={`Test case ${index + 1} expected output`}
                    value={tc.output}
                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="remove-test-case"
                  onClick={() => removeTestCase(index)}
                  disabled={formData.testCases.length === 1}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-test-case"
              onClick={addTestCase}
            >
              Add Test Case +
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="solutionTemplate">Solution Template *</label>
            <textarea
              id="solutionTemplate"
              name="solutionTemplate"
              rows="8"
              value={formData.solutionTemplate}
              onChange={handleChange}
              placeholder="Provide a starter code template for students"
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Problem'}
            </button>
            <Link to="/" className="cancel-btn">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProblem;
