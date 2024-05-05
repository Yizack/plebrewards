<script setup lang="ts">
const { loggedIn } = useUserSession();

const login = async () => {
  if (loggedIn.value) return navigateTo("/app");
  return navigateTo("/api/auth/twitch", { external: true });
};
</script>

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="col-lg-8 mx-auto" style="height: 80%">
        <div class="d-flex flex-column flex-lg-row border rounded-3 bg-body-secondary overflow-hidden h-100">
          <div class="border-end col-lg-6" style="background-image: url('/images/login.jpg'); background-size: cover; min-height: 30%;">
            <h1 class="m-0 p-4">Pleb Rewards</h1>
          </div>
          <div class="col-lg-6 p-5">
            <h2 class="mb-4">Sign In</h2>
            <button class="btn btn-lg btn-twitch w-100 mb-2 d-flex align-items-center justify-content-center gap-2" @click="login">
              <Icon name="bi:twitch" size="1.3rem" />
              <span>Sign in with Twitch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
