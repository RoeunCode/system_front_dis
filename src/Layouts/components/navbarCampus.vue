<script setup>
import { useSettingStore } from "@/store/setting";
import { ref, onMounted, computed } from "vue";

// Parse JSON from localStorage
const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const campus = ref(JSON.parse(localStorage.getItem("campus") || "[]"));

console.log("user", user.value);

const settingStore = useSettingStore();

const filter = ref({
  campus_id: settingStore.campus_id,
});

// Computed campuses to show
const showCampus = computed(() => {
  if (user.value.is_AllCampus === true || user.value.is_AllCampus === 1) {
    const all = [
      {
        name: "គ្រប់សាខា",
        name_en: "All Campus",
        id: "*",
      },
    ];
    return [...all, ...campus.value];
  }
  return campus.value;
});

// On mount: initialize filter and store
onMounted(() => {
  filter.value.campus_id =
    settingStore.campus_id || showCampus.value?.[0]?.id || null;

  settingStore.setCampusId(filter.value.campus_id);
});

// Update campus
const changeCampus = (id) => {
  settingStore.setCampusId(id);
};
</script>

<template>
  <div>
    <VSelect
      :items="showCampus"
      item-title="name"
      item-value="id"
      :readonly="showCampus.length === 1"
      @update:model-value="changeCampus"
      density="compact"
      variant="outlined"
      v-model="filter.campus_id"
      class="customFont"
    />
  </div>
</template>
