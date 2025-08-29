import React, { useState, useEffect } from 'react';

export function MarksUpload({ onLogout }) {
  const [roll, setRoll] = useState('');
  const [name, setName] = useState('');
  const [marks, setMarks] = useState([{ subject: 'Math', score: '' }]);
  const [resultStore, setResultStore] = useState([]);

  // load existing
  useEffect(()=> {
    const data = JSON.parse(localStorage.getItem('eduportal_results')||'[]');
    setResultStore(data);
  }, []);

  function updateMark(index, field, value) {
    setMarks(m => m.map((row,i)=> i===index ? { ...row, [field]: value } : row));
  }
  function addSubject() {
    setMarks(m => [...m, { subject: '', score: '' }]);
  }
  function removeSubject(i) {
    setMarks(m => m.filter((_,idx)=> idx!==i));
  }
  function saveResult(e) {
    e.preventDefault();
    if(!roll.trim()||!name.trim()) return;
    const parsed = marks.filter(m=>m.subject && m.score!=='' ).map(m=> ({...m, score: Number(m.score)}));
    const total = parsed.reduce((a,b)=> a + (isNaN(b.score)?0:b.score), 0);
    const percentage = parsed.length? (total / (parsed.length*100))*100 : 0;
    const record = { roll, name, marks: parsed, total, percentage: Number(percentage.toFixed(2)) };
    setResultStore(s => {
      const existingIdx = s.findIndex(r=> r.roll===roll);
      if(existingIdx>-1) {
        const clone = [...s];
        clone[existingIdx] = record;
        localStorage.setItem('eduportal_results', JSON.stringify(clone));
        return clone;
      }
      const next = [...s, record];
      localStorage.setItem('eduportal_results', JSON.stringify(next));
      return next;
    });
    setRoll(''); setName(''); setMarks([{ subject: 'Math', score: '' }]);
  }

  return (
    <div className="panel upload-panel">
      <div className="panel-header">
        <h1 className="title-lg">Upload Marks</h1>
        <button onClick={onLogout} className="btn-text">Logout</button>
      </div>
      <form onSubmit={saveResult} className="form-vertical gap-lg">
        <div className="grid-2">
          <label><span>Roll No.</span><input value={roll} onChange={e=>setRoll(e.target.value)} required /></label>
          <label><span>Student Name</span><input value={name} onChange={e=>setName(e.target.value)} required /></label>
        </div>
        <div className="marks-table">
          {marks.map((m,i)=> (
            <div key={i} className="marks-row">
              <input className="subject-input" placeholder="Subject" value={m.subject} onChange={e=>updateMark(i,'subject',e.target.value)} />
              <input className="score-input" placeholder="Score" type="number" min="0" max="100" value={m.score} onChange={e=>updateMark(i,'score',e.target.value)} />
              {marks.length>1 && <button type="button" className="icon-btn" onClick={()=>removeSubject(i)}>✕</button>}
            </div>
          ))}
          <button type="button" className="btn-secondary small" onClick={addSubject}>+ Add Subject</button>
        </div>
        <button type="submit" className="btn-primary align-self-start">Save Result</button>
      </form>

      <div className="results-list">
        {resultStore.length===0 && <p className="muted">No results saved yet.</p>}
        {resultStore.map(r=> (
          <div key={r.roll} className="result-card">
            <div className="result-summary">
              <strong>{r.name}</strong> (Roll {r.roll}) – {r.percentage}%
            </div>
            <div className="sub-marks">
              {r.marks.map(sm=> <span key={sm.subject}>{sm.subject}: {sm.score}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
