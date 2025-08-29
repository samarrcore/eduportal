import React, { useState } from 'react';

export function StudentLogin({ onAuthenticated, onChangeRole }) {
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    if(roll === 'test1234' && password === '1234') {
      setError('');
      onAuthenticated({ roll });
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="panel auth-panel">
      <div className="panel-header">
        <h1 className="title-lg">Student Login</h1>
        {onChangeRole && <button type="button" className="btn-text" onClick={onChangeRole}>Change Role</button>}
      </div>
      <form onSubmit={handleSubmit} className="form-vertical">
        <label>
          <span>Roll Number</span>
          <input value={roll} onChange={e=>setRoll(e.target.value)} placeholder="test1234" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="1234" />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
}
