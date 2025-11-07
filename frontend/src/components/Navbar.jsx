import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📚 Library Management
        </Link>
        <div className="nav-menu">
          {user ? (
            <>
              <Link to="/" className="nav-link">Books</Link>
              <Link to="/dashboard" className="nav-link">My Dashboard</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">Admin Panel</Link>
              )}
              <span className="nav-user">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
