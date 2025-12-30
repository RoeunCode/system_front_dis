<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import Toast from "@/helper";
import { useStore } from "@/store";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import LetterGlitch from "./components/letterGlit.vue";
import GlitchText from "./components/GlitchText.vue";

const router = useRouter();

const route = useRoute();

const authStore = useStore();

const isloading = ref(false);

const visible = ref(false);

const form = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  try {
    isloading.value = true;
    const success = await authStore.login(form.value);

    if (success) {
      const redirect = route.query.redirect || "/dashboard";
      router.push(redirect);
      console.log("Redirecting to:", redirect);
      Toast.fire({
        title: authStore.message,
        icon: "success",
      });
    } else if (authStore.alert) {
      Swal.fire({
        title: "ការព្រមាន!",
        text: "អ្នកបានបញ្ចូលពាក្យសម្ងាត់ខុសច្រើនជាង ៣ ដង។ សូមទាក់ទងទៅកាន់អ្នកគ្រប់គ្រងប្រព័ន្ធ!",
        confirmButtonColor: "#ED5E68",
        confirmButtonText: "យល់ព្រម",
        customClass: {
          popup: "colored-toast custom-delete-swal-title",
          confirmButton: "custom-swal-confirm-button",
        },
      });
    } else {
      Swal.fire({
        title: "បរាជ័យ",
        text: authStore.message,
        icon: "error",
        confirmButtonColor: "#ED5E68",
        confirmButtonText: "យល់ព្រម",
        customClass: {
          popup: "colored-toast custom-delete-swal-title",
          confirmButton: "custom-swal-confirm-button",
        },
      });
    }
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};
</script>

<!-- <template>
  <div style="width: 100vw; height: 100vh">
    <LetterGlitch
      :glitchSpeed="50"
      :centerVignette="true"
      :outerVignette="false"
      :smooth="true"
    >
      <v-card
        class="mx-auto px-10 py-5"
        style="
          margin-top: 80px;
          background-color: rgba(8, 8, 8, 0.1) !important;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          box-shadow: none !important;
          border-radius: 12px;
        "
        max-width="450"
      >
        <v-card-title
          class="customKhmerMoul"
          style="
            font-size: 23px;
            color: green;
            font-weight: bold;
            text-align: center;
          "
        >
          <GlitchText :speed="6"> ប្រព័ន្ធគ្រប់គ្រងពិន្ទុសិស្ស </GlitchText>
        </v-card-title>

        <form @submit.prevent="handleLogin">
          <div class="text-subtitle-1 mt-5">
            <p class="customFont text-green">អុីម៉ែល</p>
          </div>

          <v-text-field
            density="compact"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            color="green"
            class="text-green"
            v-model="form.email"
            type="email"
          ></v-text-field>

          <div
            class="text-green customFont d-flex align-center justify-space-between"
          >
            ពាក្យសម្ងាត់
          </div>

          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            color="green"
            class="text-green"
            v-model="form.password"
            @click:append-inner="visible = !visible"
          ></v-text-field>

          <v-btn
            class="mb-8 customFont"
            color="green"
            size="large"
            variant="tonal"
            block
            :loading="isloading"
            :disabled="isloading"
            @click="handleLogin"
          >
            ចូល
          </v-btn>
        </form>
      </v-card>
    </LetterGlitch>
  </div>
</template> -->

<template>
  <div class="div">
    <v-card
      class="mx-auto px-10 py-5 bg-green-lighten-5"
      style="margin-top: 80px"
      max-width="400"
    >
      <v-card-title
        class="customKhmerMoul"
        style="
          font-size: 23px;
          color: green;
          font-weight: bold;
          text-align: center;
        "
      >
        ប្រព័ន្ធគ្រប់គ្រងពិន្ទុសិស្ស
      </v-card-title>

      <form @submit.prevent="handleLogin">
        <div class="text-subtitle-1 mt-5">
          <p class="customFont text-medium-emphasis">អុីម៉ែល</p>
        </div>

        <v-text-field
          density="compact"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          color="green"
          v-model="form.email"
          type="email"
        ></v-text-field>

        <div
          class="text-medium-emphasis customFont d-flex align-center justify-space-between"
        >
          ពាក្យសម្ងាត់
        </div>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          color="green"
          v-model="form.password"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-btn
          class="mb-8 customFont"
          color="green"
          size="large"
          variant="tonal"
          block
          :loading="isloading"
          :disabled="isloading"
          @click="handleLogin"
        >
          ចូល
        </v-btn>
      </form>
    </v-card>
  </div>
</template>
<style scoped>
.div {
  height: 100vh;
  padding-top: 8%;
  background-image: linear-gradient(
      0deg,
      rgba(100, 97, 97, 0.75),
      rgba(100, 97, 97, 0.75)
    ),
    url("https://e1.pxfuel.com/desktop-wallpaper/975/55/desktop-wallpaper-login-page-login.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: local;
}
</style>
