<template>
  <h2 class="text-lg font-semibold mt-6 mb-2">Files</h2>
  <ul v-if="files.length">
    <li v-for="file in files" :key="file" class="mb-2 flex items-center">
      <span class="flex-1">{{ file }}</span>
      <button
        class="ml-2 bg-green-500 text-white px-2 py-1 rounded"
        @click="emit('download', file)"
      >
        Download
      </button>
    </li>
  </ul>
  <p v-else class="text-gray-500">No files available.</p>
</template>

<script setup lang="ts">
defineProps<{
  files: string[];
}>();

const emit = defineEmits<{
  (e: "download", fileId: string): void;
}>();
</script>
