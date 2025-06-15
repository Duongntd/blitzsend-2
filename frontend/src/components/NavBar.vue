<template>
  <nav
    class="flex items-center justify-between bg-gray-800 p-4 mb-6 rounded shadow"
  >
    <div class="flex items-center space-x-4">
      <router-link to="/" class="text-white font-bold hover:underline"
        >Home</router-link
      >
      <router-link to="/download" class="text-white font-bold hover:underline"
        >Download</router-link
      >
    </div>
  </nav>
</template>

<script setup lang="ts">
// No script needed for static navbar
</script>

<style scoped>
nav {
  /* Optional: sticky top nav */
}
</style>
