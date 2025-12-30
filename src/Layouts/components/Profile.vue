<script setup>
import { api } from "@/utils/axios";
import { onMounted } from "vue";
import { ref } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

const router = useRouter();

const authStore = useStore();

const profileInfo = ref("");

const getProfile = async () => {
  try {
    api.post("/profile").then((res) => {
      profileInfo.value = res.data.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const getPhoto = () => {
  return (
    "https://iconic.disreportcard.com/storage/" + profileInfo.value?.photo_path
  );
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/");
};

onMounted(() => {
  getProfile();
});
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="2"
    offset-y="2"
    color="success"
    bordered
    class="ml-2 mr-2"
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg v-if="profileInfo.photo_path" :src="getPhoto()" />
      <VImg
        v-else
        src="https://st4.depositphotos.com/9998432/24428/v/450/depositphotos_244284796-stock-illustration-person-gray-photo-placeholder-man.jpg"
      />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VImg v-if="profileInfo.photo_path" :src="getPhoto()" />
                    <VImg
                      v-else
                      src="https://st4.depositphotos.com/9998432/24428/v/450/depositphotos_244284796-stock-illustration-person-gray-photo-placeholder-man.jpg"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold customFont">
              {{ profileInfo.username }}
            </VListItemTitle>
            <VListItemSubtitle>{{ profileInfo.email }}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-1" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="mdi-account" size="22" />
            </template>

            <VListItemTitle class="customFont">ប្រវត្តរូប</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="mdi-cog" size="22" />
            </template>

            <VListItemTitle class="customFont">ការកំណត់</VListItemTitle>
          </VListItem>

          <!-- 👉 Pricing -->

          <!-- Divider -->
          <VDivider class="my-1" />

          <!-- 👉 Logout -->
          <VListItem>
            <v-btn
              @click="handleLogout"
              class="bg-red-darken-1 customFont w-100"
              prepend-icon="mdi-logout-variant"
              >ចាកចេញ</v-btn
            >
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
