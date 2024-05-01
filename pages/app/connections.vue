<script setup lang="ts">
const { user } = useUserSession();

const form = ref({
  client: "",
  secret: "",
});

const linkSpotify = async () => {
  const response = await $fetch("/api/spotify/link", {
    method: "POST",
    body: {
      id_user: user.value?.id,
      type: "spotify",
      client_id: form.value.client,
      client_secret: form.value.secret,
    }
  }).catch(() => null);

  if (!response) return alert("Failed to link Spotify");

  const params = new URLSearchParams({
    client: form.value.client
  });

  navigateTo(`/api/auth/spotify?${params.toString()}`, { external: true });
//
};
</script>

<template>
  <main>
    <h1>Connections</h1>
    <div class="rounded m-4 p-4 bg-body-secondary">
      <form @submit.prevent="linkSpotify">
        <h2>Link Spotify</h2>
        <div class="form-floating mb-2">
          <input id="client" v-model="form.client" type="text" class="form-control" placeholder="Client ID" required>
          <label for="client">Client ID</label>
        </div>
        <div class="form-floating">
          <input id="secret" v-model="form.secret" type="text" class="form-control" placeholder="Client Secret" required>
          <label for="secret">Client Secret</label>
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-primary mt-2">Link</button>
        </div>
      </form>
    </div>
  </main>
</template>
