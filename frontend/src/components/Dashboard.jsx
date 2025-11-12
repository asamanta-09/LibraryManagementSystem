import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const Dashboard = ({ user }) => {
  const [borrows, setBorrows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const borrowsRes = await axiosInstance.get('/borrows/my-borrows');
      setBorrows(borrowsRes.data);

      const statsRes = await axiosInstance.get('/borrows/stats');
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await axiosInstance.put(`/borrows/${borrowId}/return`);
      fetchData();
      alert('Book returned successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error returning book');
    }
  };

  const isOverdue = (dueDate, status) => {
    return status === 'borrowed' && new Date() > new Date(dueDate);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalBooks}</h3>
            <p>Total Books</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalBorrowed}</h3>
            <p>Currently Borrowed</p>
          </div>
          <div className="stat-card">
            <h3>{stats.available}</h3>
            <p>Available Books</p>
          </div>
          <div className="stat-card">
            <h3>{stats.overdue}</h3>
            <p>Overdue Books</p>
          </div>
        </div>
      )}

      <h2 className='borrow'>My Borrowed Books</h2>
      {borrows.length === 0 ? (
        <p className='borrow-p'>You haven't borrowed any books yet.</p>
      ) : (
        <div className="borrow-list">
          {borrows.map((borrow) => (
            <div 
              key={borrow._id} 
              className={`borrow-item ${isOverdue(borrow.dueDate, borrow.status) ? 'overdue' : ''}`}
            >
              <div className="borrow-info">
                <h3>{borrow.book?.title || 'Unknown Book'}</h3>
                <p>Author: {borrow.book?.author}</p>
                <p>Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}</p>
                <p>Due Date: {new Date(borrow.dueDate).toLocaleDateString()}</p>
                <p className="status">Status: {borrow.status}</p>
                {isOverdue(borrow.dueDate, borrow.status) && (
                  <p className="overdue-text">OVERDUE!</p>
                )}
              </div>
              {borrow.status === 'borrowed' && (
                <button 
                  onClick={() => handleReturn(borrow._id)} 
                  className="btn btn-primary"
                >
                  Return Book
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
