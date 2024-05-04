<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();
</script>

<template>
  <main>
    <div v-if="loggedIn">
      <h1>Welcome {{ user?.login }}!</h1>
      <div class="mb-2">
        <NuxtLink to="/app">Go to the APP</NuxtLink>
      </div>
      <button class="btn btn-primary rounded-pill" @click="clear">Logout</button>
    </div>
    <div v-else>
      <h1>Not logged in</h1>
      <a href="/api/auth/twitch">Login with Twitch</a>
    </div>
  </main>
</template>
