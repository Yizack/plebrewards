<script setup lang="ts">
const form = ref({
  title: "",
  cost: null as number | null,
});

const createReward = async () => {
  await $fetch("/api/twitch/rewards", {
    method: "POST",
    body: form.value,
  });
};
</script>

<template>
  <main>
    <h1>Setup Twitch Reward</h1>
    <div class="rounded m-4 p-4 bg-body-secondary">
      <form @submit.prevent="createReward">
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
          <button type="submit" class="btn btn-primary mt-2">Create</button>
        </div>
      </form>
    </div>
  </main>
</template>
