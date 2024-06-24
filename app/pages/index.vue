<script setup lang="ts">
const { loggedIn } = useUserSession();

const login = async () => {
  if (loggedIn.value) return navigateTo("/app");
  return navigateTo("/api/auth/twitch", { external: true });
};
</script>

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100 text-body-emphasis">
      <div class="col-lg-8 mx-auto shadow" style="height: 80%">
        <div class="d-flex flex-column flex-lg-row rounded-4 bg-body-secondary overflow-hidden h-100">
          <div class="col-lg-6 p-4 p-lg-5" style="background-image: url('/images/login.jpg'); background-size: cover; min-height: 30%;">
            <h1 class="m-0">{{ SITE.name }}</h1>
          </div>
          <div class="col-lg-6 p-4 p-lg-5">
            <h2 class="mb-4">Sign In</h2>
            <button class="btn btn-lg btn-twitch rounded-4 w-100 mb-2 d-flex align-items-center justify-content-center gap-2 py-3" @click="login">
              <Icon name="bi:twitch" class="flex-shrink-0" size="2rem" />
              <span>Sign in with Twitch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
