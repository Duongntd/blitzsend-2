<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Ephemeral Share (Vue)2</h1>
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="border p-2 mb-2 w-full"
    />
    <input ref="fileInput" type="file" class="mb-2 w-full" />
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded w-full"
      @click="upload"
    >
      Upload
    </button>
    <p v-if="link" class="mt-4 text-blue-600 break-all">
      <button class="underline text-blue-600" @click="download">
        Download Link
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { downloadFile, uploadFile } from "../logic/api";

const password = ref<string>("");
const link = ref<string>("");
const fileInput = ref<HTMLInputElement | null>(null);

async function download() {
  console.log(link.value);
  if (link.value) {
    await downloadFile(password.value, link.value);
  }
}

async function upload() {
  if (
    fileInput.value &&
    fileInput.value.files &&
    fileInput.value.files.length > 0
  ) {
    const file = fileInput.value.files[0];
    try {
      link.value = await uploadFile(password.value, file);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file.");
    }
  } else {
    alert("Please select a file to upload.");
  }
}
</script>

<style>
/* optional Tailwind via CDN in index.html, or install it */
</style>
