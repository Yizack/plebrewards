<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { loggedIn, user, clear } = useUserSession();
</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome {{ user?.login }}!</h1>
    <button class="btn btn-primary" @click="clear">Logout</button>
  </div>
</template>
