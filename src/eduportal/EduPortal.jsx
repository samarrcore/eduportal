// Main layout for EduPortal, matching Figma structure
import React, { useState, useEffect } from 'react';
import './EduPortal.css';
import './EduPortal.layout.css';
import { RoleSelect } from './components/RoleSelect';
import { FacultyLogin } from './components/FacultyLogin';
import { MarksUpload } from './components/MarksUpload';
import { StudentResultViewer } from './components/StudentResultViewer';
import { StudentLogin } from './components/StudentLogin';

export default function EduPortal() {
  const [view, setView] = useState('role'); // role | faculty-login | faculty-dashboard | student-login | student-view
  const [facultySession, setFacultySession] = useState(null);
  const [studentSession, setStudentSession] = useState(null);

  // hydrate results from localStorage for student viewer + faculty list
  const [persistedTrigger, setPersistedTrigger] = useState(0);

  useEffect(()=> {
    // when marks upload updates local storage, we can listen via storage event in real multi-tab
    const listener = e => { if(e.key==='eduportal_results') setPersistedTrigger(t=>t+1); };
    window.addEventListener('storage', listener);
    return ()=> window.removeEventListener('storage', listener);
  }, []);

  function handleFacultyAuth(data){
    setFacultySession(data);
    setView('faculty-dashboard');
  }
  function logoutFaculty(){
    setFacultySession(null);
    setView('role');
  }
  function handleStudentAuth(data){
    setStudentSession(data);
    setView('student-view');
  }
  function logoutStudent(){
    setStudentSession(null);
    setView('role');
  }

  return (
    <div className="eduportal-root portal-mode">
      <header className="eduportal-header compact">
        <div className="eduportal-logo">Result Portal</div>
        {view!=='role' && (
          <nav className="eduportal-nav mini">
            {view.startsWith('faculty') && facultySession && <span className="badge">Faculty: {facultySession.facultyId}</span>}
            {view.startsWith('student') && studentSession && <span className="badge">Student: {studentSession.roll}</span>}
            {view==='faculty-dashboard' && <button onClick={logoutFaculty} className="btn-text">Logout</button>}
            {view==='student-view' && <button onClick={logoutStudent} className="btn-text">Logout</button>}
          </nav>
        )}
      </header>
      <main className="portal-main">
  {view === 'role' && <RoleSelect onSelect={(role)=> setView(role==='faculty' ? 'faculty-login' : 'student-login')} />}
  {view === 'faculty-login' && <FacultyLogin onAuthenticated={handleFacultyAuth} onChangeRole={()=> setView('role')} />}
        {view === 'faculty-dashboard' && <MarksUpload onLogout={logoutFaculty} key={persistedTrigger} />}
  {view === 'student-login' && <StudentLogin onAuthenticated={handleStudentAuth} onChangeRole={()=> setView('role')} />}
  {view === 'student-view' && <StudentResultViewer onBack={logoutStudent} key={persistedTrigger} />}
      </main>
      <footer className="eduportal-footer">
        <div>© 2025 EduPortal Results</div>
      </footer>
    </div>
  );
}
