<template>
  <span class="flex-1">{{ textId }}</span>
  <button
    class="ml-2 bg-purple-500 text-white px-2 py-1 rounded"
    @click="emit('viewText', textId)"
  >
    View
  </button>
  <p>{{ textContent }}</p>
</template>

<script setup lang="ts">
defineProps<{
  textId: string;
  textContent?: string;
}>();
const emit = defineEmits<{
  (e: "viewText", textId: string): void;
}>();
</script>
