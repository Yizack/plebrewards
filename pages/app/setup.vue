<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { data: service } = await useFetch("/api/twitch/rewards/spotify-sr");

const webhook = ref(service.value?.rewards ? service.value?.rewards[0] : null);
const loading = ref(false);
const { $toasts } = useNuxtApp();

const form = ref({
  title: webhook.value ? webhook.value.reward.title : "",
  description: webhook.value ? webhook.value.reward.description : "",
  cost: webhook.value ? webhook.value.reward.cost : null,
});

const createReward = async () => {
  loading.value = true;
  const newWebhook = await $fetch("/api/twitch/rewards/spotify-sr", {
    method: "POST",
    body: form.value
  }).catch(() => null);
  loading.value = false;
  if (!newWebhook) return;
  $toasts.add({ message: "Reward added to your Twitch channel", success: true });
  webhook.value = {
    id: newWebhook.data[0].id,
    transport: newWebhook.data[0].transport,
    reward: {
      id: newWebhook.data[0].condition.reward_id,
      title: form.value.title,
      description: form.value.description || "",
      cost: form.value.cost || 0
    }
  };
};

const deleteReward = async (id_webhook: string, id_reward: string) => {
  loading.value = true;
  const remove = await $fetch(`/api/twitch/rewards/spotify-sr?id_webhook=${id_webhook}&id_reward=${id_reward}`, {
    method: "DELETE"
  }).catch(() => null);
  loading.value = false;
  if (!remove) return;
  $toasts.add({ message: "Reward deleted from your Twitch channel", success: true });
  webhook.value = null;
};
</script>

<template>
  <main class="py-4">
    <h1 class="mb-4">Setup</h1>
    <div class="row flex-gap-1">
      <div class="col-lg-12">
        <div class="rounded-4 p-4 bg-body-secondary border border-2 position-relative">
          <form @submit.prevent="webhook ? deleteReward(webhook.id, webhook.reward.id) : createReward()">
            <div :class="`d-flex gap-1 justify-content-center align-items-center position-absolute top-0 end-0 m-2 px-3 py-1 rounded-4 small text-white ${webhook ? 'bg-success' : 'bg-secondary'}`">
              <Icon name="solar:record-bold-duotone" size="1.2rem" />
              <span v-if="webhook" class="d-none d-lg-block">Created</span>
              <span v-else class="d-none d-lg-block">Not created</span>
            </div>
            <div class="d-flex gap-2 justify-content-center align-items-center mb-3">
              <Icon name="bi:twitch" size="2em" />
              <h2 class="m-0">Spotify SR</h2>
            </div>
            <div class="form-floating mb-2">
              <input id="title" v-model="form.title" type="text" class="form-control" placeholder="Title" required>
              <label for="client">Title</label>
            </div>
            <div class="form-floating mb-2">
              <textarea id="title" v-model="form.description" type="text" class="form-control" placeholder="Description" maxlength="200" style="height: 150px;" />
              <label for="client">Description</label>
            </div>
            <div class="form-floating mb-2">
              <input id="cost" v-model="form.cost" type="number" class="form-control" placeholder="Points cost" required>
              <label for="secret">Points cost</label>
            </div>
            <div v-if="!service?.connected" class="alert alert-dark d-flex align-items-center" role="alert">
              <Icon class="bi flex-shrink-0 me-2" name="solar:danger-triangle-bold" role="img" aria-label="Warning:" size="1.3rem" />
              <div>Please <NuxtLink to="/app/connections">Connect your Spotify App</NuxtLink> before creating a reward</div>
            </div>
            <div class="d-grid">
              <button type="submit" :class="`btn btn-lg ${webhook ? 'btn-danger' : 'btn-primary'} mt-2 rounded-4`" :disabled="loading || !service?.connected">
                <Transition name="slide" mode="out-in">
                  <SpinnerCircle v-if="loading" />
                  <span v-else>{{ webhook ? 'Delete reward' : 'Create reward'}}</span>
                </Transition>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
