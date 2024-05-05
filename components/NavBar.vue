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
  <nav class="navbar bg-body-tertiary sticky-top border-bottom">
    <div class="container-fluid">
      <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbar" aria-controls="navbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <NuxtLink class="navbar-brand d-lg-none" to="/">{{ SITE.name }}</NuxtLink>
      <div id="navbar" ref="navbar" class="offcanvas offcanvas-start w-lg-100 show bg-body-tertiary" tabindex="-1" aria-labelledby="navbarLabel" data-bs-scroll="true" data-bs-backdrop="false">
        <div class="offcanvas-header">
          <h5 id="navbarLabel" class="offcanvas-title">{{ SITE.name }}</h5>
          <button type="button" class="btn-close d-lg-none" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div class="offcanvas-body d-flex flex-column justify-content-between">
          <ul class="navbar-nav flex-grow-1 gap-1">
            <li class="nav-item ">
              <NuxtLink class="nav-link d-flex align-items-center gap-2" aria-current="page" to="/app">
                <Icon name="solar:smile-circle-bold" size="1.3rem" />
                <span>Home</span>
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link d-flex align-items-center gap-2" aria-current="page" to="/app/connections">
                <Icon name="solar:link-round-angle-bold" size="1.3rem" />
                <span>Connections</span>
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link d-flex align-items-center gap-2" aria-current="page" to="/app/setup">
                <Icon name="solar:star-bold" size="1.3rem" />
                <span>Setup</span>
              </NuxtLink>
            </li>
          </ul>
          <div>
            <div class="d-grid">
              <button class="btn btn-danger rounded-4" @click="logout">
                <span class="position-relative">
                  <Icon name="solar:bell-off-bold" class="position-absolute end-100 top-50 translate-middle" size="1.3rem" />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="ms-auto">
        <div class="">
          <NuxtLink class="btn btn-primary rounded-4 d-flex align-items-center gap-1" to="/app">
            <img :src="user?.profile_image_url" class="border rounded-circle" width="30" height="30">
            <span>{{ user?.display_name }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>
