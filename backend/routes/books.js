import express from 'express';
import { db } from '../app.js';

const router = express.Router();

// GET /books?limit=10&after=<id>&genre=&author=&publishedYear=
router.get('/', (req, res) => {
  const { limit, after, genre, author, publishedYear } = req.query;
  const result = db.getBooks({ limit: +limit || 10, after: Number(after), genre, author, publishedYear });
  res.json(result);
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
