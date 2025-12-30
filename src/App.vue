<script setup>
import { onMounted, ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useStore } from "./store";
import ClickSpark from "./pages/components/ClickSpark.vue";
onMounted(() => {
  // useStore().startTokenExpirationMonitor();
  // if (useStore().isLogout) {
  //   useRouter().push({ name: "Login" });
  // }
});

const dialog = ref(true);

const keyword = ref("");

const closeDialog = () => {
  if (keyword.value === 123 || keyword.value === "123") {
    dialog.value = false;
  }
};

console.log();
</script>
<template>
  <div>
    <RouterView />
    <ClickSpark
      :sparkColor="'#ff4032'"
      :sparkSize="2"
      :sparkRadius="5"
      :sparkCount="10"
      :duration="200"
    />

    <!-- alert when update -->

    <!-- <VDialog maxWidth="500" opacity="0.9" persistent v-model="dialog">
      <VCard>
        <VCardTitle class="text-center font-weight-bold">
          <VIcon color="yellow" size="80">mdi-alert-decagram</VIcon><br />
          <span class="customKhmerMoul text-black"
            >ប្រព័ន្ធកំពុងធ្វើបច្ចុប្បន្នភាព UPDATE! <br
          /></span>
        </VCardTitle>
        <VCardText class="text-center customKhmerMoul text-black">
          សូមរងចាំ អរគុណ
          <div class="d-flex">
            <VTextField
              v-model="keyword"
              density="compact"
              variant="plain"
              hideDetails
            >
            </VTextField>
            <VBtn @click="closeDialog" variant="flat" icon="mdi-check"></VBtn>
          </div>
        </VCardText>
      </VCard>
    </VDialog> -->
  </div>
  <!-- <ClickSpark
    :sparkColor="'#00ff0f'"
    :sparkSize="10"
    :sparkRadius="15"
    :sparkCount="8"
    :duration="400"
  >
    <RouterView />
  </ClickSpark> -->
</template>
