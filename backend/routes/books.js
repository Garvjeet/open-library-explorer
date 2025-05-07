import express from 'express';
import { db } from '../app.js';

const router = express.Router();

// GET /books?page=1&limit=10&genre=&author=&publishedYear=
router.get('/', (req, res) => {
  const { page, limit, genre, author, publishedYear } = req.query;
  const result = db.getBooks({ page: +page || null, limit: +limit || null, genre, author, publishedYear });

  // Delay of 500 miliseconds to simulate real API call.
  setTimeout(() => {
    res.json(result);
  }, 500);
});

// GET /books/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  const book = db.getBookById(id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

export default router;
