<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
</script>

<template>
  <main class="py-4">
    <h1 class="mb-4">Setup</h1>
    <div class="d-flex gap-2 flex-wrap">
      <div v-for="(reward, name) in REWARDS" :key="name">
        <NuxtLink :to="`/app/setup/${name}`" class="btn btn-lg btn-primary border rounded-4">
          <span>
            {{ reward.title }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
