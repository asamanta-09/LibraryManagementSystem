import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import BookCard from '../components/BookCard';

const AdminPanel = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publicationYear: '',
    quantity: ''
  });

  useEffect(() => {
    fetchBooks();
    fetchBorrows();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await axiosInstance.get('/books');
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchBorrows = async () => {
    try {
      const { data } = await axiosInstance.get('/borrows/all');
      setBorrows(data);
    } catch (error) {
      console.error('Error fetching borrows:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBook) {
        await axiosInstance.put(`/books/${editingBook._id}`, formData);
        alert('Book updated successfully!');
      } else {
        await axiosInstance.post('/books', formData);
        alert('Book added successfully!');
      }

      setFormData({
        title: '',
        author: '',
        genre: '',
        publicationYear: '',
        quantity: ''
      });
      setShowAddForm(false);
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving book');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publicationYear: book.publicationYear,
      quantity: book.quantity
    });
    setShowAddForm(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axiosInstance.delete(`/books/${bookId}`);
        alert('Book deleted successfully!');
        fetchBooks();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting book');
      }
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await axiosInstance.put(`/borrows/${borrowId}/return`);
      alert('Book returned successfully!');
      fetchBorrows();
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error returning book');
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <div className="admin-section">
        <div className="section-header">
          <h2>Manage Books</h2>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingBook(null);
              setFormData({
                title: '',
                author: '',
                genre: '',
                publicationYear: '',
                quantity: ''
              });
            }}
            className="btn btn-primary"
          >
            {showAddForm ? 'Cancel' : 'Add New Book'}
          </button>
        </div>

        {showAddForm && (
          <div className="book-form">
            <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Publication Year</label>
                <input
                  type="number"
                  value={formData.publicationYear}
                  onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
            </form>
          </div>
        )}

        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={handleEdit}
              onDelete={handleDelete}
              user={user}
            />
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h2>Borrowed Books</h2>
        {borrows.length === 0 ? (
          <p>No books currently borrowed.</p>
        ) : (
          <div className="borrow-list">
            {borrows.map((borrow) => (
              <div key={borrow._id} className="borrow-item admin">
                <div className="borrow-info">
                  <h3>{borrow.book?.title}</h3>
                  <p>Borrowed by: {borrow.user?.name} ({borrow.user?.email})</p>
                  <p>Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}</p>
                  <p>Due: {new Date(borrow.dueDate).toLocaleDateString()}</p>
                  <p className="status">Status: {borrow.status}</p>
                </div>
                {borrow.status === 'borrowed' && (
                  <button
                    onClick={() => handleReturn(borrow._id)}
                    className="btn btn-primary"
                  >
                    Mark as Returned
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
