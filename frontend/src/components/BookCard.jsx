const BookCard = ({ book, onBorrow, onEdit, onDelete, user }) => {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p className="book-author">by {book.author}</p>
      <div className="book-details">
        <p><strong>Genre:</strong> {book.genre}</p>
        <p><strong>Year:</strong> {book.publicationYear}</p>
        <p><strong>Available:</strong> {book.availableQuantity} / {book.quantity}</p>
      </div>
      <div className="book-actions">
        {user?.role === 'user' && book.availableQuantity > 0 && (
          <button onClick={() => onBorrow(book._id)} className="btn btn-primary">
            Borrow Book
          </button>
        )}
        {user?.role === 'admin' && (
          <>
            <button onClick={() => onEdit(book)} className="btn btn-secondary">
              Edit
            </button>
            <button onClick={() => onDelete(book._id)} className="btn btn-danger">
              Delete
            </button>
          </>
        )}
        {book.availableQuantity === 0 && (
          <span className="unavailable">Not Available</span>
        )}
      </div>
    </div>
  );
};

export default BookCard;
