<script setup lang="ts">
const { user, clear } = useUserSession();
const navbar = ref<HTMLElement>();

const logout = async () => {
  await clear();
  navigateTo("/");
};

onMounted(() => {
  const { $bootstrap } = useNuxtApp();
  if (!(window.innerWidth < 768 && navbar.value)) return;

  $bootstrap.hideOffcanvas(navbar.value);
  const navItems = navbar.value.querySelectorAll(".nav-item");
  for (const navItem of navItems) {
    navItem.setAttribute("data-bs-dismiss", "offcanvas");
  }
});
</script>

<template>
  <nav class="navbar bg-body-tertiary sticky-top">
    <div class="container-fluid">
      <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbar" aria-controls="navbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <NuxtLink class="navbar-brand d-lg-none" to="/">{{ SITE.name }}</NuxtLink>
      <div id="navbar" ref="navbar" class="offcanvas offcanvas-start w-lg-100 show" tabindex="-1" aria-labelledby="navbarLabel" data-bs-scroll="true" data-bs-backdrop="false">
        <div class="offcanvas-header">
          <h5 id="navbarLabel" class="offcanvas-title">{{ SITE.name }}</h5>
          <button type="button" class="btn-close d-lg-none" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div class="offcanvas-body d-flex flex-column justify-content-between">
          <ul class="navbar-nav flex-grow-1 gap-1">
            <li class="nav-item">
              <NuxtLink class="nav-link active" aria-current="page" to="/app">Home</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link active" aria-current="page" to="/app/connections">Connections</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link active" aria-current="page" to="/app/setup">Setup</NuxtLink>
            </li>
          </ul>
          <div>
            <div class="d-grid">
              <button class="btn btn-primary rounded-pill" @click="logout">Logout</button>
            </div>
          </div>
        </div>
      </div>
      <div class="ms-auto">
        <div class="">
          <NuxtLink class="btn btn-primary rounded-pill d-flex align-items-center gap-1">
            <img :src="user?.profile_image_url" class="border rounded-circle" width="30" height="30">
            <span>{{ user?.display_name }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>
