<template>
  <div class="container max-w-7xl mx-auto">
    <div class="navbar bg-base-100">
      <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl">Guepardosys Mockup</a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><RouterLink to="/">Mockup</RouterLink></li>
          <li tabindex="0">
            <RouterLink to="/config"> Configurações </RouterLink>
          </li>
          <li><RouterLink to="/about">Sobre</RouterLink></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="flex">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
