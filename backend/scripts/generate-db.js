import fs from 'fs';

import { GENRES, AUTHORS, TITLES, DESCRIPTIONS } from '../constants/mock-books-data.js';

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBooks(count = 100) {
  const books = [];

  for (let i = 1; i <= count; i++) {
    books.push({
      id: i,
      title: `${getRandomItem(TITLES)} ${i}`,
      author: `${getRandomItem(AUTHORS)}`,
      genre: `${getRandomItem(GENRES)}`,
      description: `${getRandomItem(DESCRIPTIONS)} ${i}`,
      publishedYear: Math.floor(Math.random() * 74) + 1950, // Random year between 1950 and 2024
      coverUrl: `https://placehold.co/200x300?text=Book+${i}`
    });
  }

  return books;
}

const DB_SIZE = 1000;
const books = generateBooks(DB_SIZE);

fs.writeFileSync('data/books.json', JSON.stringify(books, null, 2), 'utf-8');

console.log(`Generated ${DB_SIZE} books into data/books.json`);
