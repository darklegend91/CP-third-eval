import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Navbar from '../layout/Navbar';

export default function AdminDashboard({ users = [], stats = {} }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      await api.put(`/admin/users/${selectedUser.id}/role`, { role: selectedRole });
      setMessage({ 
        text: `Role updated for ${selectedUser.name} to ${selectedRole}`, 
        type: 'success' 
      });
      
      // Update user in the list
      selectedUser.role = selectedRole;
      setSelectedUser(null);
      setSelectedRole('');
    } catch (error) {
      setMessage({ text: 'Failed to update role', type: 'error' });
    }
  };

  return (
<>
    <div className="admin-dashboard">
      <div className="stats-row">
        <div className="stat-card">
          <h3>Users</h3>
          <p className="stat-number">{stats.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Problems</h3>
          <p className="stat-number">{stats.totalProblems || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Submissions</h3>
          <p className="stat-number">{stats.totalSubmissions || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Classes</h3>
          <p className="stat-number">{stats.totalClasses || 0}</p>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>User Management</h3>
        
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        
        {selectedUser ? (
          <div className="role-manager">
            <h4>Change Role for {selectedUser.name}</h4>
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <div className="button-group">
              <button 
                className="primary-button" 
                onClick={handleRoleChange}
                disabled={!selectedRole}
              >
                Update Role
              </button>
              <button 
                className="secondary-button" 
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button 
                      className="table-button" 
                      onClick={() => {
                        setSelectedUser(user);
                        setSelectedRole(user.role);
                      }}
                    >
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </>  
  );
}
