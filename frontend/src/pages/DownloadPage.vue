<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Available Files for Download</h1>
    <router-link to="/" class="block mb-4 text-center text-blue-600 underline"
      >Go to Home Page</router-link
    >
    <button
      class="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      @click="fetchFiles"
    >
      Refresh List
    </button>
    <FilesList :files="fileList" @download="download"></FilesList>
    <TextList :texts="textList" @view-text="viewText"></TextList>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { listFiles, downloadFile, getText } from "../logic/api";
import FilesList from "@/components/Files/FilesList.vue";
import TextList from "@/components/Texts/TextList.vue";

const fileList = ref<string[]>([]);
const textList = ref<{ [textId: string]: string }>({});

async function fetchFiles() {
  try {
    const result = await listFiles();
    fileList.value = result.files;
    // Convert result.texts from string[] to { [textId: string]: string }
    textList.value = result.texts.reduce(
      (acc: { [textId: string]: string }, textId: string) => {
        acc[textId] = ""; // Initialize with empty content
        return acc;
      },
      {}
    );
  } catch (error) {
    alert("Failed to fetch files: " + error);
  }
}

async function download(fileId: string) {
  await downloadFile(`/download/${fileId}`);
}

async function viewText(textId: string) {
  // Open the text in a new tab or modal (simple alert for now)
  const textContent = await getText(textId);
  textList.value[textId] = textContent.text;
}

onMounted(() => {
  fetchFiles();
});
</script>

<style scoped></style>
