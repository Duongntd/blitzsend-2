<template>
  <div>
    <NavBar />
    <main class="container mx-auto px-4">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from "../components/NavBar.vue";
</script>

<style scoped>
main {
  min-height: 80vh;
}
</style>
