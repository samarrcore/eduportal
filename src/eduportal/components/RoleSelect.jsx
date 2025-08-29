import React from 'react';

export function RoleSelect({ onSelect }) {
  return (
    <div className="panel role-select">
      <h1 className="title-xl">Select Portal</h1>
      <div className="role-cards">
        <button className="role-card" onClick={() => onSelect('faculty')}>
          <h2>Faculty</h2>
          <p>Upload student marks</p>
        </button>
        <button className="role-card" onClick={() => onSelect('student')}>
          <h2>Student</h2>
          <p>View your result</p>
        </button>
      </div>
    </div>
  );
}
