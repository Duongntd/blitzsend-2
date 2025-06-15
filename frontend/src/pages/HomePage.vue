<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Ephemeral Share (Vue)2</h1>
    <input ref="fileInput" type="file" class="mb-2 w-full" />
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded w-full"
      @click="upload"
    >
      Upload
    </button>
    <router-link
      to="/download"
      class="block mt-6 text-center text-blue-600 underline"
      >Go to Download Page</router-link
    >

    <hr class="my-6" />
    <h2 class="text-xl font-semibold mb-2">Write and Upload Text</h2>
    <textarea
      v-model="text"
      rows="4"
      class="w-full border p-2 mb-2"
      placeholder="Enter your text here..."
    ></textarea>
    <button
      class="bg-green-500 text-white px-4 py-2 rounded w-full"
      @click="uploadTextEntry"
    >
      Upload Text
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { uploadFile, uploadText } from "../logic/api";

const link = ref<string>("");
const fileInput = ref<HTMLInputElement | null>(null);
const text = ref<string>("");

async function upload() {
  if (
    fileInput.value &&
    fileInput.value.files &&
    fileInput.value.files.length > 0
  ) {
    const file = fileInput.value.files[0];
    try {
      link.value = await uploadFile(file);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file.");
    }
  } else {
    alert("Please select a file to upload.");
  }
}

async function uploadTextEntry() {
  if (!text.value.trim()) {
    alert("Please enter some text.");
    return;
  }
  try {
    await uploadText(text.value);
    alert("Text uploaded successfully!");
    text.value = "";
  } catch (error) {
    console.error("Upload text failed:", error);
    alert("Failed to upload text.");
  }
}
</script>

<style>
/* optional Tailwind via CDN in index.html, or install it */
</style>
