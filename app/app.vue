<script setup lang="ts">
setScrollBehavior();

const { $bootstrap, $toasts } = useNuxtApp();

onMounted(() => {
  // eslint-disable-next-line no-global-assign
  $fetch = $fetch.create({
    onResponseError: ({ response }) => {
      const message = response.status === 500 ? "error" : response._data.message;
      $toasts.add({ message, success: false });
    }
  });

  $bootstrap.hideModalEscEvent();
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator :throttle="0" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ToastsController />
  </div>
</template>
