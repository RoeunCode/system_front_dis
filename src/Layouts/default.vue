<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import Footer from "./components/Footer.vue";
import NavbarNavigation from "./components/NavbarNavigation.vue";
</script>
<template>
  <v-app>
    <NavbarNavigation />
    <v-main>
      <v-container class="mt-2" max-width="2000">
        <!-- 👉 Pages -->
        <div class="layout-page-content">
          <router-view v-slot="{ Component, route }">
            <transition name="slide-x-transition" mode="out-in">
              <div :key="route.name">
                <component :is="Component"></component>
              </div>
            </transition>
          </router-view>
        </div>
        <Footer />
        <!-- <Test /> -->
      </v-container>
    </v-main>
  </v-app>
</template>
