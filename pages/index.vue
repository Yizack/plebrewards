<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();
</script>

<template>
  <main>
    <div v-if="loggedIn">
      <h1>Welcome {{ user?.login }}!</h1>
      <button @click="clear">Logout</button>
    </div>
    <div v-else>
      <h1>Not logged in</h1>
      <a href="/api/auth/twitch">Login with Twitch</a>
    </div>
  </main>
</template>
