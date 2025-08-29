import React, { useState, useEffect } from 'react';

// Simple in-memory mock for fetching result by roll
export function StudentResultViewer({ onBack }) {
  const [rollQuery, setRollQuery] = useState('');
  const [record, setRecord] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // In real app this would query a backend. For now we read from localStorage if present
  function fetchResult(e) {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('eduportal_results')||'[]');
    const found = data.find(r=> r.roll === rollQuery.trim());
    setRecord(found||null);
    setNotFound(!found);
  }

  useEffect(()=>{
    const listener = e => { if(e.key==='eduportal_results') { if(record){ // refresh displayed record
        const data = JSON.parse(localStorage.getItem('eduportal_results')||'[]');
        const found = data.find(r=> r.roll === record.roll);
        setRecord(found||null);
      }} };
    window.addEventListener('storage', listener);
    return ()=> window.removeEventListener('storage', listener);
  }, [record]);

  useEffect(()=>{
    // if roll provided via session through onBack closure (optional future), keep manual search for now
  }, []);

  return (
    <div className="panel student-panel">
      <div className="panel-header">
        <button onClick={onBack} className="btn-text">← Back</button>
        <h1 className="title-lg">View Result</h1>
      </div>
      <form onSubmit={fetchResult} className="form-inline gap-md">
        <input placeholder="Enter Roll Number" value={rollQuery} onChange={e=>setRollQuery(e.target.value)} />
        <button type="submit" className="btn-primary">Search</button>
      </form>
      {notFound && <div className="form-error mt-md">No record found.</div>}
      {record && (
        <div className="result-detail mt-lg">
          <h2 className="title-md">{record.name} <span className="muted">(Roll {record.roll})</span></h2>
          <div className="marks-grid">
            {record.marks.map(m=> (
              <div key={m.subject} className="mark-item">
                <span className="subject">{m.subject}</span>
                <span className="score">{m.score}</span>
              </div>
            ))}
          </div>
          <div className="overall">Total: {record.total} | Percentage: {record.percentage}%</div>
        </div>
      )}
    </div>
  );
}
