<script setup lang="ts">
definePageMeta({ middleware: "session" });
const { loggedIn, user, clear } = useUserSession();
</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome {{ user?.login }}!</h1>
    <button @click="clear">Logout</button>
  </div>
</template>
