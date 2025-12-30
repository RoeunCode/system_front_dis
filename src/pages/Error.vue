<template>
  <!-- 👉 Image -->
  <div class="w-100 text-center" style="margin-top: 10px">
    <h1 class="text-h1 text-blue-grey-darken-3">404</h1>
    <h2 class="text-h5 my-2 text-blue-grey-lighten-1">
      Page Not Found
      <v-icon color="yellow">mdi-alert</v-icon>
    </h2>
    <p class="text-body-1 text-blue-grey-lighten-3">
      We couldn't find the page that you are looking for
    </p>
    <VImg
      src="https://sneat-vuetify-admin-template.vercel.app/assets/404-df5d1da7.png"
      alt="Page Not Found"
      max-width="750"
      class="mx-auto"
    />
    <v-btn to="/dashboard" class="mt-5 bg-pink-accent-3">Back To Home</v-btn>
  </div>
</template>
