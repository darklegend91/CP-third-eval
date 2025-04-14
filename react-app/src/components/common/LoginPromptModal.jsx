import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPromptModal({ isOpen, onClose, message = "You need to log in to perform this action." }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Login Required</h2>
        <p>{message}</p>
        <div className="login-modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-login"
            onClick={() => {
              onClose && onClose();
              navigate('/login');
            }}
          >
            Go To Login
          </button>
        </div>
      </div>
    </div>
  );
}
