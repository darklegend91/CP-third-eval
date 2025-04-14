import React from 'react';
import { Link } from 'react-router-dom';

export default function TeacherDashboard({ classes = [], problems = [], submissions = [] }) {
  return (
    <div className="teacher-dashboard">
      <div className="dashboard-card">
        <h3>My Classes</h3>
        {classes.length > 0 ? (
          <ul className="class-list">
            {classes.map(classItem => (
              <li key={classItem.id} className="class-item">
                <Link to={`/class/${classItem.id}`}>
                  <span className="class-name">{classItem.name}</span>
                  <span className="student-count">
                    {classItem.students?.length || 0} students
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">You haven't created any classes yet.</p>
        )}
        <Link to="/create-class" className="action-button">
          Create Class
        </Link>
      </div>

      <div className="dashboard-card">
        <h3>My Problems</h3>
        {problems.length > 0 ? (
          <ul className="problem-list">
            {problems.map(problem => (
              <li key={problem.id} className="problem-item">
                <Link to={`/problem/${problem.id}`}>
                  <span className="problem-title">{problem.title}</span>
                  <span className={`difficulty ${problem.difficulty}`}>
                    {problem.difficulty}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">You haven't created any problems yet.</p>
        )}
        <Link to="/create-problem" className="action-button">
          Create Problem
        </Link>
      </div>

      <div className="dashboard-card">
        <h3>Recent Submissions</h3>
        {submissions.length > 0 ? (
          <ul className="submissions-list">
            {submissions.slice(0, 5).map(submission => (
              <li key={submission.id} className="submission-item">
                <div>
                  <Link to={`/problem/${submission.problemId}`}>
                    Problem #{submission.problemId}
                  </Link>
                  <span> by </span>
                  <Link to={`/user/${submission.userId}`}>
                    User #{submission.userId}
                  </Link>
                </div>
                <span className={`status ${submission.status}`}>
                  {submission.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">No submissions from your students yet.</p>
        )}
        <Link to="/all-submissions" className="action-button">
          View All Submissions
        </Link>
      </div>
    </div>
  );
}
