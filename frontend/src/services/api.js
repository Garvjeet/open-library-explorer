const BASE_URL = 'http://localhost:3000'

export async function fetchBooks(query = '') {
  const res = await fetch(`${BASE_URL}/books?${query}`);
  return res.json();
}

export async function fetchBookById(id) {
  const res = await fetch(`${BASE_URL}/books/${id}`);
  return res.json();
}

export async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genres`);
  return res.json();
}
