<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Login</h1>
    <input
      v-model="password"
      type="password"
      placeholder="Enter password"
      class="border p-2 mb-2 w-full"
      @keyup.enter="login"
    />
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded w-full"
      @click="login"
    >
      Login
    </button>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authenticate } from "../logic/api"; // Adjust the import path as necessary

const password = ref("");
const error = ref("");
const router = useRouter();

async function login() {
  try {
    const response = await authenticate(password.value);
    if (response.success) {
      sessionStorage.setItem("password", password.value);
      error.value = "";
      router.push("/");
    } else {
      error.value = "Login failed.";
    }
  } catch (err) {
    error.value = "Login failed: " + err;
  }
}
</script>

<style scoped></style>
