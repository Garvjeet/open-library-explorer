import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PAGINATION_LIMIT = 10;

export class BookDatabase {
  constructor(dataFilePath = '../data/books.json') {
    this.books = [];
    this.bookIndexById = new Map(); // Primary index
    this.genreIndex = new Map(); // Secondary index (genre -> array of book IDs)
    this.authorIndex = new Map(); // Secondary index (author -> array of book IDs)
    this.yearIndex = new Map(); // Secondary index (year -> array of book IDs)
    this.allIds = []; // Primary index (clustered list of all record IDs)

    this.loadData(dataFilePath);
    this.buildIndexes();
  }

  loadData(relativePath) {
    const fullPath = path.join(__dirname, relativePath);
    const json = fs.readFileSync(fullPath, 'utf-8');
    this.books = JSON.parse(json);
  }

  buildIndexes() {
    this.books.forEach((book) => {
      const { id, genre, author, publishedYear } = book;

      this.bookIndexById.set(id, book);
      this.allIds.push(id);

      // Genre index
      if (!this.genreIndex.has(genre)) this.genreIndex.set(genre, []);
      this.genreIndex.get(genre).push(id);

      // Author index
      if (!this.authorIndex.has(author)) this.authorIndex.set(author, []);
      this.authorIndex.get(author).push(id);

      // Year index
      if (!this.yearIndex.has(publishedYear)) this.yearIndex.set(publishedYear, []);
      this.yearIndex.get(publishedYear).push(id);
    });
  }

  getBookById(id) {
    return this.bookIndexById.get(id);
  }

  getBooks({ page = 1, limit, genre, author, publishedYear }) {
    if (typeof page !== 'number') page = 1;
    if (typeof page !== 'number' || limit <= 0) limit = DEFAULT_PAGINATION_LIMIT
    const startIndex = Math.abs((page - 1) * limit);

    // Linear search for the index of the "after" id
    const idsSlice = this.allIds.slice(startIndex, startIndex + limit);
    let result = idsSlice.map(id => this.getBookById(id));
  
    // Additional filters using respective indexes.
    if (genre) result = result.filter(b => b.genre === genre);
    if (author) result = result.filter(b => b.author === author);
    if (publishedYear) result = result.filter(b => b.publishedYear === +publishedYear);
  
    const nextCursor = idsSlice.length === limit ? idsSlice[idsSlice.length - 1] : null;
  
    return { results: result, nextCursor };
  }

  getGenres() {
    return Array.from(this.genreIndex.keys());
  }
}
