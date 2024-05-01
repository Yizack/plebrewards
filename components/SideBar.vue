<script setup lang="ts">
</script>

<template>
  <nav class="navbar bg-body-tertiary sticky-top">
    <div class="container-fluid">
      <NuxtLink class="navbar-brand d-lg-none" to="/">{{ SITE.name }}</NuxtLink>
      <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <div id="offcanvasNavbar" class="offcanvas offcanvas-start show w-lg-100" tabindex="-1" aria-labelledby="offcanvasNavbarLabel" data-bs-scroll="true" data-bs-backdrop="false">
        <div class="offcanvas-header">
          <h5 id="offcanvasNavbarLabel" class="offcanvas-title">{{ SITE.name }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
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

<style>
.wrapper {
  margin-left: 400px;
}
</style>
