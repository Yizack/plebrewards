<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { data: service } = await useFetch("/api/twitch/rewards/spotify-sr");
const { data: service2 } = await useFetch("/api/twitch/rewards/spotify-skip");

const webhook = ref(service.value?.rewards ? service.value?.rewards[0] : null);
const webhook2 = ref(service2.value?.rewards ? service2.value?.rewards[0] : null);

const loading = ref(false);
const { $toasts } = useNuxtApp();

const { form: formSr, formReset: formResetSr } = useFormState({
  title: "",
  description: "",
  cost: null as number | null,
  color: "#1ED760"
});

const { form: formSkip, formReset: formResetSkip } = useFormState({
  title: "",
  description: "",
  cost: null as number | null,
  color: "#1ED760"
});

if (webhook.value) {
  formSr.value.title = webhook.value.reward.title;
  formSr.value.description = webhook.value.reward.description;
  formSr.value.cost = webhook.value.reward.cost;
  formSr.value.color = webhook.value.reward.color;
}

if (webhook2.value) {
  formSkip.value.title = webhook2.value.reward.title;
  formSkip.value.description = webhook2.value.reward.description;
  formSkip.value.cost = webhook2.value.reward.cost;
  formSkip.value.color = webhook2.value.reward.color;
}

const createReward = async () => {
  loading.value = true;
  const newWebhook = await $fetch("/api/twitch/rewards/spotify-sr", {
    method: "POST",
    body: formSr.value
  }).catch(() => null);
  loading.value = false;

  if (!newWebhook) return;
  $toasts.add({ message: "Reward added to your Twitch channel", success: true });
  webhook.value = {
    id: newWebhook.data[0].id,
    transport: newWebhook.data[0].transport,
    reward: {
      id: newWebhook.data[0].condition.reward_id,
      title: formSr.value.title,
      description: formSr.value.description,
      cost: Number(formSr.value.cost),
      color: formSr.value.color
    }
  };
};

const createReward2 = async () => {
  loading.value = true;
  const newWebhook = await $fetch("/api/twitch/rewards/spotify-skip", {
    method: "POST",
    body: formSkip.value
  }).catch(() => null);
  loading.value = false;

  if (!newWebhook) return;
  $toasts.add({ message: "Reward added to your Twitch channel", success: true });
  webhook2.value = {
    id: newWebhook.data[0].id,
    transport: newWebhook.data[0].transport,
    reward: {
      id: newWebhook.data[0].condition.reward_id,
      title: formSkip.value.title,
      description: formSkip.value.description,
      cost: Number(formSkip.value.cost),
      color: formSkip.value.color
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
  formResetSr();
  webhook.value = null;
};

const deleteReward2 = async (id_webhook: string, id_reward: string) => {
  loading.value = true;
  const remove = await $fetch(`/api/twitch/rewards/spotify-skip?id_webhook=${id_webhook}&id_reward=${id_reward}`, {
    method: "DELETE"
  }).catch(() => null);
  loading.value = false;
  if (!remove) return;
  $toasts.add({ message: "Reward deleted from your Twitch channel", success: true });
  formResetSkip();
  webhook2.value = null;
};
</script>

<template>
  <main class="py-4">
    <h1 class="mb-4">Setup</h1>
    <div class="row flex-gap-4 gy-4">
      <div class="col-lg-6">
        <div class="rounded-4 p-4 bg-body-secondary border border-2 position-relative">
          <form @submit.prevent="webhook ? deleteReward(webhook.id, webhook.reward.id) : createReward()">
            <div :class="`d-flex gap-1 justify-content-center align-items-center position-absolute top-0 end-0 m-2 px-3 py-1 rounded-4 small text-body-emphasis ${webhook ? 'bg-success' : 'bg-secondary'}`">
              <Icon name="solar:record-bold-duotone" size="1.2rem" />
              <span v-if="webhook" class="d-none d-lg-block">Created</span>
              <span v-else class="d-none d-lg-block">Not created</span>
            </div>
            <div class="d-flex gap-2 justify-content-center align-items-center mb-3">
              <Icon name="bi:twitch" size="2em" />
              <h2 class="m-0">Spotify SR</h2>
            </div>
            <div class="form-floating mb-2">
              <InputLeft max="45" :text="formSr.title" class="position-absolute top-0 end-0 px-2 pt-1" />
              <input id="title" v-model="formSr.title" type="text" class="form-control" placeholder="Title" maxlength="45" required :disabled="webhook ? true : false">
              <label for="client">Title</label>
            </div>
            <div class="form-floating mb-2">
              <InputLeft max="200" :text="formSr.description" class="position-absolute top-0 end-0 px-2 pt-1" />
              <textarea id="description" v-model="formSr.description" type="text" class="form-control" placeholder="Description" maxlength="200" style="height: 150px;" :disabled="webhook ? true : false" />
              <label for="client">Description</label>
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text text-body-emphasis" :style="{ backgroundColor: formSr.color }">
                <IconsReward size="1.4rem" />
              </span>
              <div class="form-floating">
                <input id="cost" v-model="formSr.cost" type="number" class="form-control" placeholder="Cost" required :disabled="webhook ? true : false">
                <label for="cost">Cost</label>
              </div>
            </div>
            <div class="mb-2 d-flex gap-2 align-items-center">
              <input id="color" v-model="formSr.color" type="color" class="form-control form-control-color" title="Choose your color" :disabled="webhook ? true : false">
              <label for="color">Background color</label>
            </div>
            <div v-if="!service?.connected" class="alert alert-dark d-flex align-items-center" role="alert">
              <Icon class="bi flex-shrink-0 me-2" name="solar:danger-triangle-bold" role="img" aria-label="Warning:" size="1.3rem" />
              <div>Please <NuxtLink to="/app/connections">Connect your Spotify App</NuxtLink> before creating a reward</div>
            </div>
            <div class="d-grid">
              <button type="submit" :class="`btn btn-lg ${webhook ? 'btn-danger' : 'btn-primary'} mt-2 rounded-4`" :disabled="loading || !service?.connected">
                <Transition name="slide" mode="out-in">
                  <SpinnerCircle v-if="loading" />
                  <span v-else>{{ webhook ? 'Delete reward' : 'Create reward' }}</span>
                </Transition>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="rounded-4 p-4 bg-body-secondary border border-2 position-relative">
          <form @submit.prevent="webhook2 ? deleteReward2(webhook2.id, webhook2.reward.id) : createReward2()">
            <div :class="`d-flex gap-1 justify-content-center align-items-center position-absolute top-0 end-0 m-2 px-3 py-1 rounded-4 small text-body-emphasis ${webhook2 ? 'bg-success' : 'bg-secondary'}`">
              <Icon name="solar:record-bold-duotone" size="1.2rem" />
              <span v-if="webhook2" class="d-none d-lg-block">Created</span>
              <span v-else class="d-none d-lg-block">Not created</span>
            </div>
            <div class="d-flex gap-2 justify-content-center align-items-center mb-3">
              <Icon name="bi:twitch" size="2em" />
              <h2 class="m-0">Spotify Skip To Next Song</h2>
            </div>
            <div class="form-floating mb-2">
              <InputLeft max="45" :text="formSkip.title" class="position-absolute top-0 end-0 px-2 pt-1" />
              <input id="title" v-model="formSkip.title" type="text" class="form-control" placeholder="Title" maxlength="45" required :disabled="webhook2 ? true : false">
              <label for="client">Title</label>
            </div>
            <div class="form-floating mb-2">
              <InputLeft max="200" :text="formSkip.description" class="position-absolute top-0 end-0 px-2 pt-1" />
              <textarea id="description" v-model="formSkip.description" type="text" class="form-control" placeholder="Description" maxlength="200" style="height: 150px;" :disabled="webhook2 ? true : false" />
              <label for="client">Description</label>
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text text-body-emphasis" :style="{ backgroundColor: formSkip.color }">
                <IconsReward size="1.4rem" />
              </span>
              <div class="form-floating">
                <input id="cost" v-model="formSkip.cost" type="number" class="form-control" placeholder="Cost" required :disabled="webhook2 ? true : false">
                <label for="cost">Cost</label>
              </div>
            </div>
            <div class="mb-2 d-flex gap-2 align-items-center">
              <input id="color" v-model="formSkip.color" type="color" class="form-control form-control-color" title="Choose your color" :disabled="webhook2 ? true : false">
              <label for="color">Background color</label>
            </div>
            <div v-if="!service2?.connected" class="alert alert-dark d-flex align-items-center" role="alert">
              <Icon class="bi flex-shrink-0 me-2" name="solar:danger-triangle-bold" role="img" aria-label="Warning:" size="1.3rem" />
              <div>Please <NuxtLink to="/app/connections">Connect your Spotify App</NuxtLink> before creating a reward</div>
            </div>
            <div class="d-grid">
              <button type="submit" :class="`btn btn-lg ${webhook2 ? 'btn-danger' : 'btn-primary'} mt-2 rounded-4`" :disabled="loading || !service2?.connected">
                <Transition name="slide" mode="out-in">
                  <SpinnerCircle v-if="loading" />
                  <span v-else>{{ webhook2 ? 'Delete reward' : 'Create reward' }}</span>
                </Transition>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
