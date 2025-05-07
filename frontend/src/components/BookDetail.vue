<template>
  <div class="fixed inset-0 bg-transparent flex justify-center items-center z-51">
    <div class="flex flex-col sm:flex-row bg-white max-w-lg w-full p-6 rounded relative m-4">
      <div>
        <button
          class="absolute top-2 right-3 text-gray-400 cursor-pointer hover:text-gray-600"
          @click="$emit('close')"
        >
          ✕
        </button>
        <h2 class="text-xl font-bold mb-2">{{ book.title }}</h2>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Genre:</strong> {{ book.genre }}</p>
        <p><strong>Published:</strong> {{ book.publishedYear }}</p>
        <p class="mt-2 text-sm text-gray-700 italic">{{ book.description }}</p>
      </div>
      <div class="flex justify-center items-center p-2 pt-4 sm:pt-2 h-[140px] w-[100px] relative">
        <!-- Skeleton Placeholder -->
        <div
          v-if="!imageLoaded"
          class="h-full flex justify-center items-center bg-gray-100"
        >
          <div class="w-20 h-full bg-gray-300 animate-pulse rounded"></div>
        </div>

        <!-- Image (always rendered, visibility toggled) -->
        <img
          :src="book.coverUrl"
          class="h-full object-contain transition-opacity duration-300"
          :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
          loading="lazy"
          @load="imageLoaded = true"
          @error="imageLoaded = true"
        />
      </div>
    </div>
  </div>
  <div class="fixed inset-0 bg-black opacity-80 flex justify-center items-center z-50"></div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({ book: Object });

const imageLoaded = ref(false);
</script>
