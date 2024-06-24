<script setup lang="ts">
defineProps({
  max: { type: [String, Number], required: true },
  text: { type: String, required: true }
});
</script>

<template>
  <span>{{ text.length }}/{{ max }}</span>
</template>
