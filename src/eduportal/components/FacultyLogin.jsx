import React, { useState } from 'react';

export function FacultyLogin({ onAuthenticated, onChangeRole }) {
  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!facultyId.trim() || !password) {
      setError('Enter both Faculty ID and password');
      return;
    }
    // Simple mock auth: required facultyId=test1234 password=1234
    if (facultyId === 'test1234' && password === '1234') {
      setError('');
      onAuthenticated({ facultyId });
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="panel auth-panel">
      <div className="panel-header">
        <h1 className="title-lg">Faculty Login</h1>
        {onChangeRole && <button type="button" className="btn-text" onClick={onChangeRole}>Change Role</button>}
      </div>
      <form onSubmit={handleSubmit} className="form-vertical">
        <label>
          <span>Faculty ID</span>
          <input value={facultyId} onChange={e => setFacultyId(e.target.value)} placeholder="FAC123" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
}
