<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { data: webhooks } = await useFetch("/api/twitch/rewards");

const webhook = ref(webhooks.value ? webhooks.value[0] : null);
const loading = ref(false);
const { $toasts } = useNuxtApp();

const form = ref({
  title: webhook.value ? webhook.value.reward.title : "",
  cost: webhook.value ? webhook.value.reward.cost : null,
});

const createReward = async () => {
  loading.value = true;
  const newWebhook = await $fetch("/api/twitch/rewards", {
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
      cost: form.value.cost || 0
    }
  };
};

const deleteReward = async (id_webhook: string, id_reward: string) => {
  loading.value = true;
  const remove = await $fetch(`/api/twitch/rewards?id_webhook=${id_webhook}&id_reward=${id_reward}`, {
    method: "DELETE"
  }).catch(() => null);
  loading.value = false;
  if (!remove) return;
  $toasts.add({ message: "Reward deleted from your Twitch channel", success: true });
  webhook.value = null;
};
</script>

<template>
  <main>
    <div class="py-4">
      <h1 class="mb-4">Setup</h1>
      <div class="rounded p-4 bg-body-secondary position-relative">
        <form @submit.prevent="webhook ? deleteReward(webhook.id, webhook.reward.id) : createReward()">
          <div :class="`d-flex gap-2 justify-content-center align-items-center position-absolute top-0 end-0 m-2 px-3 py-1 rounded-pill small ${webhook ? 'bg-success' : 'bg-secondary'}`">
            <template v-if="webhook">
              <Icon name="icon-park-twotone:soap-bubble" class="text-white" />
              <span class="text-white">Created</span>
            </template>
            <template v-else>
              <span class="text-white">Not created</span>
            </template>
          </div>
          <div class="d-flex gap-2 justify-content-center align-items-center mb-3">
            <Icon name="bi:twitch" size="2em" />
            <h2 class="m-0">Twitch Channel Reward</h2>
          </div>
          <div class="form-floating mb-2">
            <input id="title" v-model="form.title" type="text" class="form-control" placeholder="Title" required>
            <label for="client">Title</label>
          </div>
          <div class="form-floating">
            <input id="cost" v-model="form.cost" type="number" class="form-control" placeholder="Points cost" required>
            <label for="secret">Points cost</label>
          </div>
          <div class="d-grid">
            <button type="submit" :class="`btn btn-lg ${webhook ? 'btn-danger' : 'btn-primary'} mt-2 rounded-pill`" :disabled="loading">
              <Transition name="slide" mode="out-in">
                <SpinnerCircle v-if="loading" />
                <span v-else>{{ webhook ? 'Delete reward' : 'Create reward'}}</span>
              </Transition>
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
