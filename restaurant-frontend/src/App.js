import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Menu from './Menu';
import Admin from './Admin';
import AdminLogin from './AdminLogin';

function App() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Menu</Link> | <Link to="/admin">Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/admin-login" />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;