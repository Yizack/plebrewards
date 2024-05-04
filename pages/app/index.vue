<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { loggedIn, user } = useUserSession();
const { data: connections } = await useFetch(`/api/user/${user.value?.id}/connections`);
</script>

<template>
  <main class="py-4">
    <h1 class="mb-4">Profile</h1>
    <div class="row flex-gap-1">
      <div class="col-lg-8">
        <div class="rounded-3 p-4 bg-body-secondary border border-2">
          <div v-if="loggedIn">
            <div class="d-flex gap-2 align-items-center mb-3">
              <img :src="user?.profile_image_url" class="border border-3 rounded-circle" width="100" height="100">
              <div>
                <h2 class="m-0">{{ user?.display_name }}</h2>
                <p class="m-0">@{{ user?.login }}</p>
              </div>
            </div>
            <div class="bg-body p-3 rounded-3">
              <div>
                <span class="fw-medium text-uppercase">Joined</span>
                <p>{{ new Date(Number(user?.created_at)).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric", weekday: "short" }) }}</p>
              </div>
              <div v-if="user?.description">
                <span class="fw-medium text-uppercase">Description</span>
                <p>{{ user.description }}</p>
              </div>
              <div v-if="connections?.length">
                <span class="fw-medium text-uppercase">Connections</span>
                <ul class="list-unstyled d-flex gap-1 m-0 mt-1">
                  <li v-for="connection of connections" :key="connection.type">
                    <Icon :name="`bi:${connection.type}`" size="2rem" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
