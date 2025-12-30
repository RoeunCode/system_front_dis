<script setup>
import { ref, computed } from "vue";
import { useTheme } from "vuetify";

const themeName = ref("light");
const theme = useTheme();
const toggleTheme = () => {
  themeName.value = themeName.value == "dark" ? "light" : "dark";
  theme.global.name.value = themeName.value;
  console.log(`Current theme is dark? ${themeName.value}`);
};
</script>
<template>
  <v-btn icon class="ml-2" @click.prevent="toggleTheme()">
    <v-icon class="text-h5">
      {{
        themeName === "dark" ? "mdi-white-balance-sunny" : "mdi-weather-night"
      }}
    </v-icon>
  </v-btn>
</template>
