<script setup lang="ts">
const navbar = ref<HTMLElement>();

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
      <NuxtLink class="navbar-brand d-lg-none" to="/">{{ SITE.name }}</NuxtLink>
      <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbar" aria-controls="navbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbar" ref="navbar" class="offcanvas offcanvas-start w-lg-100 show" tabindex="-1" aria-labelledby="navbarLabel" data-bs-scroll="true" data-bs-backdrop="false">
        <div class="offcanvas-header">
          <h5 id="navbarLabel" class="offcanvas-title">{{ SITE.name }}</h5>
          <button type="button" class="btn-close d-lg-none" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3 gap-1">
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
        </div>
      </div>
    </div>
  </nav>
</template>
