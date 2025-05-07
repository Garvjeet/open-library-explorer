<template>
  <div class="flex flex-col sm:flex-row  flex-wrap gap-4 mb-6">
    <select
      class="border px-3 py-2 rounded"
      v-model="genre"
    >
      <option value="">All Genres</option>
      <option v-for="g in genres" :key="g">{{ g }}</option>
    </select>

    <input
      class="border px-3 py-2 rounded"
      v-model="author"
      placeholder="Author"
    />

    <input
      class="border px-3 py-2 rounded"
      v-model.number="publishedYear"
      placeholder="Published Year"
      type="number"
    />

    <button
      @click="fetchDataWithFilters"
      class="bg-sky-500 text-white px-4 py-2 w-fit self-center rounded cursor-pointer hover:bg-sky-600"
    >
      Apply
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineProps({ genres: Array });
const emit = defineEmits(['updateFilters']);

const genre = ref('');
const author = ref('');
const publishedYear = ref('');

function fetchDataWithFilters() {
  emit('updateFilters', {
    genre: genre.value,
    author: author.value,
    publishedYear: publishedYear.value,
  });
}
</script>
