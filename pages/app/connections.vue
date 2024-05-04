<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { user } = useUserSession();

if (!user.value) navigateTo("/");
const { data: connections } = await useFetch(`/api/user/${user.value?.id}/connections`);

const loading = ref(false);
const spotifyConnection = ref(connections.value?.find((c) => c.type === "spotify"));

const form = ref({
  client: spotifyConnection.value?.client_id || "",
  secret: "",
});

const linkSpotify = async () => {
  loading.value = true;
  const response = await $fetch("/api/spotify/link", {
    method: spotifyConnection.value ? "DELETE" : "POST",
    body: spotifyConnection.value ? undefined : {
      id_user: user.value?.id,
      type: "spotify",
      client_id: form.value.client,
      client_secret: form.value.secret
    }
  }).catch(() => null);
  loading.value = false;
  if (!response) return;
  if (!spotifyConnection.value) return navigateTo(`/api/auth/spotify?client=${form.value.client}`, { external: true });
  spotifyConnection.value = undefined;
  form.value.client = "";
};
</script>

<template>
  <main>
    <div class="py-4">
      <h1 class="mb-4">Connections</h1>
      <div class="row flex-gap-1">
        <div class="col-lg-6">
          <div class="rounded-3 p-4 bg-body-secondary border border-2 position-relative">
            <form autocomplete="off" @submit.prevent="linkSpotify">
              <div class="d-flex gap-2 justify-content-center align-items-center mb-3">
                <Icon name="bi:spotify" size="2em" />
                <h2 class="m-0">Spotify</h2>
              </div>
              <div :class="`d-flex gap-2 justify-content-center align-items-center position-absolute top-0 end-0 m-2 px-3 py-1 rounded-pill small text-white ${spotifyConnection ? 'bg-success' : 'bg-secondary'}`">
                <Icon name="solar:link-round-angle-bold-duotone" size="1rem" />
                <span v-if="spotifyConnection" class="d-none d-lg-block">Linked</span>
                <span v-else class="d-none d-lg-block">Not connected</span>
              </div>
              <div v-if="!spotifyConnection">
                <div class="form-floating mb-2">
                  <input id="client" v-model="form.client" type="text" class="form-control" placeholder="Client ID" required>
                  <label for="client">Client ID</label>
                </div>
                <div class="form-floating">
                  <input id="secret" v-model="form.secret" type="text" class="form-control" placeholder="Client Secret" required>
                  <label for="secret">Client Secret</label>
                </div>
              </div>
              <div class="d-grid">
                <a type="submit" class="btn btn-lg btn-secondary mt-2 rounded-pill" href="/docs/connections/spotify" target="_blank">Learn how to create your app</a>
                <button type="submit" :class="`btn btn-lg ${spotifyConnection ? 'btn-danger' : 'btn-primary'} mt-2 rounded-pill`" :disabled="loading">
                  <Transition name="slide" mode="out-in">
                    <SpinnerCircle v-if="loading" />
                    <span v-else>{{ spotifyConnection ? "Unlink" : "Link" }}</span>
                  </Transition>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
