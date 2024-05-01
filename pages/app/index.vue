<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();
</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome {{ user?.login }}!</h1>
    <button @click="clear">Logout</button>
    <br>
    <NuxtLink to="/app/connections">Connections</NuxtLink>
    <br>
    <NuxtLink to="/app/setup">Setup Twitch Reward</NuxtLink>
  </div>
</template>
