import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (adminOnly && user.role !== 'admin') {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <BookList user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel user={user} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
