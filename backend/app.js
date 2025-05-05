import express from 'express';
import cors from 'cors';
import { BookDatabase } from './db/BookDatabase.js';
import { bookRoutes, genreRoutes } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Load and initialize DB
export const db = new BookDatabase();

// Global middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/books', bookRoutes);
app.use('/genres', genreRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
