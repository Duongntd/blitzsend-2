<template>
  <PageLayout> </PageLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import PageLayout from "./pages/PageLayout.vue";

const router = useRouter();

onMounted(() => {
  const password = sessionStorage.getItem("password");
  if (!password) {
    router.push("/login");
  }
});
</script>

<style>
/* optional Tailwind via CDN in index.html, or install it */
</style>
