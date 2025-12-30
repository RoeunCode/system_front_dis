<script setup>
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import { useRouter } from "vue-router";

import { useStore } from "@/store";
import router from "@/router";

const store = useStore();

onMounted(() => {
  if (store.token == undefined) {
    router.push("/login");
  }
  if (store.token) {
    router.push("/dashboard");
  } else {
    router.push("/login");
  }
});


</script>

<template>
  <RouterView />
</template>
