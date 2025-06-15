<template>
  <h2 class="text-lg font-semibold mt-6 mb-2">Texts</h2>
  <ul v-if="textList.length">
    <TextUnit
      v-for="text in textList"
      :key="text.textId"
      :text-id="text.textId"
      :text-content="text.textContent"
      @view-text="emit('viewText', text.textId)"
    />
  </ul>
  <p v-else class="text-gray-500">No texts available.</p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TextUnit from "./TextUnit.vue";

const props = defineProps<{
  texts: { [textId: string]: string };
}>();
const emit = defineEmits<{
  (e: "viewText", textId: string): void;
}>();

const textList = computed(() =>
  Object.entries(props.texts).map(([textId, textContent]) => ({
    textId,
    textContent,
  }))
);
</script>
