<template>
  <div
    class="bg-gray-100 p-4 rounded shadow hover:shadow-md transition cursor-pointer"
    @click="$emit('click')"
  >
    <h3 class="truncate text-md font-semibold">{{ book.title }}</h3>
    <p class="text-sm text-gray-700">{{ book.author }}</p>
    <p class="text-xs text-gray-500">{{ book.publishedYear }}</p>
  </div>
</template>

<script setup>
defineProps({ book: Object });
</script>
