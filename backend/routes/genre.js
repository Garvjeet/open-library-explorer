import express from 'express';
import { db } from '../app.js';

const router = express.Router();

// GET /genres
router.get('/', (req, res) => {
  res.json(db.getGenres());
});

export default router;
