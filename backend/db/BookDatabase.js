import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PAGINATION_LIMIT = 12;

export class BookDatabase {
  constructor(dataFilePath = '../data/books.json') {
    this.books = [];
    this.bookIndexById = new Map(); // Primary index
    this.genreIndex = new Map(); // Secondary index (genre -> array of book IDs)
    this.authorIndex = new Map(); // Secondary index (author -> array of book IDs)
    this.yearIndex = new Map(); // Secondary index (year -> array of book IDs)
    this.filter_result_cache = {};

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

    let books = null;

    const cacheKey = this.getUniqueCacheKey({ genre, author, publishedYear });
    if (this.filter_result_cache[cacheKey]) {
      // If cache contains the cacheKey, read from cache and save DB call.
      books = this.filter_result_cache[cacheKey];
    } else {
      books = this.books;
      if (genre) books = books.filter(b => b.genre === genre);
      if (author) books = books.filter(b => b.author === author);
      if (publishedYear) books = books.filter(b => b.publishedYear === +publishedYear);
      this.filter_result_cache[cacheKey] = books;
      this.cacheFilterResult(cacheKey, books);
    }

    books = books.slice(startIndex, startIndex + limit);

    return { books };
  }

  getUniqueCacheKey(filters = {}) {
    // Get keys, sort them alphabetically
    const sortedKeys = Object.keys(filters).sort();

    // Build cache key by joining string values with hyphen
    const cacheKey = sortedKeys.map(key => String(filters[key] ?? '')).join('-');
    return cacheKey;
  }

  cacheFilterResult(cacheKey, filteredBooks) {
   this.filter_result_cache[cacheKey] = filteredBooks;
  }

  getGenres() {
    return Array.from(this.genreIndex.keys());
  }
}
