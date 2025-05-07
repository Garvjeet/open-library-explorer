<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <BookFilters :genres="genres" @updateFilters="handleFilters" />

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
      <BookCard
        v-for="book in books"
        :key="`book-${book.id}`"
        :book="book"
        @click="selectBook(book.id)"
      />
    </div>

    <Loader v-if="isLoading" />
    <button
      v-if="!isLoading && showLoadMore"
      @click="loadMore"
      class="block mx-auto mt-4 px-4 py-2 bg-sky-500 text-white rounded cursor-pointer hover:bg-sky-600/90"
    >
      Load More
    </button>
    <p v-else-if="books.length == 0 && !isLoading" class="text-center">No Results.</p>

    <BookDetail v-if="selectedBook" :book="selectedBook" @close="selectedBook = null" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchBooks, fetchGenres, fetchBookById } from '../services/api.js';
import BookCard from '../components/BookCard.vue';
import BookFilters from '../components/BookFilters.vue';
import Loader from '../components/Loader.vue';
import BookDetail from '../components/BookDetail.vue';

const PAGE_LIMIT = 12;

const books = ref([]);
const page = ref(1);
const filters = ref({});
const isLoading = ref(false);
const genres = ref([]);
const selectedBook = ref(null);
const showLoadMore = ref(true);

async function loadBooks(reset = false) {
  isLoading.value = true;
  const params = {
    page: page.value.toString(),
    limit: PAGE_LIMIT
  }

  if (filters.value.genre) params.genre = filters.value.genre;
  if (filters.value.author) params.author = filters.value.author;
  if (filters.value.publishedYear) params.publishedYear = filters.value.publishedYear;

  const query = new URLSearchParams(params).toString();

  const result = await fetchBooks(query);
  const bookData = result.books;
  if (reset) {
    books.value = bookData;
    showLoadMore.value = true;
  } else books.value.push(...bookData);

  if (!bookData || bookData.length === 0) {
    showLoadMore.value = false;
  }
  isLoading.value = false;
}

function loadMore() {
  page.value++
  loadBooks()
}

async function handleFilters(newFilters) {
  isLoading.value = true;
  books.value = [];
  filters.value = newFilters;
  page.value = 1;
  await loadBooks(true);
  isLoading.value = false;
}

async function selectBook(id) {
  selectedBook.value = await fetchBookById(id);
}

onMounted(async () => {
  genres.value = await fetchGenres();
  loadBooks();
})
</script>
