<script setup lang="ts">
definePageMeta({ middleware: "session" });

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
    <h1>Setup Twitch Reward</h1>
    <div class="rounded m-4 p-4 bg-body-secondary">
      <form @submit.prevent="webhook ? deleteReward(webhook.id, webhook.reward.id) : createReward()">
        <h2>Create</h2>
        <div class="form-floating mb-2">
          <input id="title" v-model="form.title" type="text" class="form-control" placeholder="Title" required>
          <label for="client">Title</label>
        </div>
        <div class="form-floating">
          <input id="cost" v-model="form.cost" type="number" class="form-control" placeholder="Cost" required>
          <label for="secret">Cost</label>
        </div>
        <div class="d-grid">
          <button type="submit" :class="`btn btn-lg ${webhook ? 'btn-danger' : 'btn-primary'} mt-2 rounded-pill`">
            <SpinnerCircle v-if="loading" />
            <template v-else>
              <span v-if="webhook">Delete reward</span>
              <span v-else>Create reward</span>
            </template>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
