import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre'],
    trim: true
  },
  publicationYear: {
    type: Number,
    required: [true, 'Please add publication year']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: 0
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
