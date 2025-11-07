import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import BookCard from '../components/BookCard';

const BookList = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, [search, genre]);

  const fetchBooks = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (genre) params.genre = genre;

      const { data } = await axiosInstance.get('/books', { params });
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await axiosInstance.post('/borrows', { bookId });
      alert('Book borrowed successfully!');
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error borrowing book');
    }
  };

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="book-list-page">
      <h1>Available Books</h1>
      
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Filter by genre..."
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="search-input"
        />
      </div>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onBorrow={handleBorrow}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
