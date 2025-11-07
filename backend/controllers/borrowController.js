import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';

export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableQuantity <= 0) {
      return res.status(400).json({ message: 'Book not available' });
    }

    const activeBorrow = await Borrow.findOne({
      user: userId,
      book: bookId,
      status: 'borrowed'
    });

    if (activeBorrow) {
      return res.status(400).json({ message: 'You have already borrowed this book' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrow = new Borrow({
      user: userId,
      book: bookId,
      dueDate
    });

    book.availableQuantity -= 1;
    await book.save();

    const createdBorrow = await borrow.save();
    await createdBorrow.populate('book');
    
    res.status(201).json(createdBorrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    if (borrow.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    borrow.returnDate = new Date();
    borrow.status = 'returned';

    const book = await Book.findById(borrow.book);
    book.availableQuantity += 1;
    await book.save();

    const updatedBorrow = await borrow.save();
    res.json(updatedBorrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user._id })
      .populate('book')
      .sort('-borrowDate');
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({})
      .populate('user', 'name email')
      .populate('book')
      .sort('-borrowDate');
    
    const borrowsWithStatus = borrows.map(borrow => {
      if (borrow.status === 'borrowed' && new Date() > borrow.dueDate) {
        borrow.status = 'overdue';
      }
      return borrow;
    });

    res.json(borrowsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalBorrowed = await Borrow.countDocuments({ status: 'borrowed' });
    
    const allBorrows = await Borrow.find({ status: 'borrowed' });
    const overdue = allBorrows.filter(borrow => new Date() > borrow.dueDate).length;

    res.json({
      totalBooks,
      totalBorrowed,
      overdue,
      available: totalBooks - totalBorrowed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
