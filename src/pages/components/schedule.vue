<script setup>
import { onMounted, ref } from "vue";
import { api } from "@/utils/axios";
import { useRoute } from "vue-router";
import Toast from "@/helper";
import { defineProps } from "vue";
import { watch } from "vue";

const route = useRoute();

// Reactive state variables
const days = ref([]);
const subjects = ref([]);
const times = ref([]);
const timetable = ref({});
const displayTimetable = ref({});
const isDialogVisible = ref(false);
const isAddLoading = ref(false);
const schedules = ref([]);

const checkData = ref(true);

const props = defineProps({
  subjects: {
    type: Array,
    required: true,
  },
});

// Fetch days from API
const getDay = async () => {
  try {
    const res = await api.post("/getDay");
    days.value = res.data;
  } catch (error) {
    console.log("Error fetching days:", error);
  }
};

// Fetch subjects from API
const getSubject = async () => {
  watch(
    () => props.subjects,
    (newVal) => {
      console.log("Updated subjects:", newVal);
      subjects.value = newVal;
    },
    { immediate: true }
  );
};

// Fetch times from API
const getTime = async () => {
  try {
    const res = await api.post("/getTime");
    times.value = res.data;
  } catch (error) {
    console.log("Error fetching times:", error);
  }
};

// Fetch schedule data
const getSchedule = async () => {
  try {
    const res = await api.post(`/getScheduleKhmer/${route.params.id}`);
    schedules.value = res.data || [];
    buildDisplayTimetable();
  } catch (error) {
    console.log("Error fetching schedule:", error);
  } finally {
    checkData.value = false;
  }
};

// Initialize timetable structure for dialog
const initializeTimetable = () => {
  timetable.value = {};
  times.value.forEach((time) => {
    timetable.value[time.id] = {};
    days.value.forEach((day) => {
      timetable.value[time.id][day.id] = null;
    });
  });
};

// Pre-fill timetable with existing schedules for editing
const prefillTimetable = () => {
  initializeTimetable();
  schedules.value.forEach((schedule) => {
    if (
      timetable.value[schedule.timeId] &&
      timetable.value[schedule.timeId][schedule.dayId] !== undefined
    ) {
      timetable.value[schedule.timeId][schedule.dayId] = schedule.subjectId;
    }
  });
};

// Build display timetable for main table
const buildDisplayTimetable = () => {
  displayTimetable.value = {};
  times.value.forEach((time) => {
    displayTimetable.value[time.id] = {};
    days.value.forEach((day) => {
      const entry = schedules.value.find(
        (s) => s.timeId == time.id && s.dayId == day.id
      );
      displayTimetable.value[time.id][day.id] = entry ? entry.subject_name : "";
    });
  });
};

// Open dialog for editing
const editSchedule = () => {
  prefillTimetable();
  isDialogVisible.value = true;
};

// Submit timetable data to server (add or update)
const submit = async () => {
  isAddLoading.value = true;
  const records = [];
  for (const timeId in timetable.value) {
    for (const dayId in timetable.value[timeId]) {
      const subjectId = timetable.value[timeId][dayId];
      if (subjectId) {
        records.push({
          classId: route.params.id,
          subjectId,
          timeId,
          dayId,
        });
      }
    }
  }
  // if (records.length === 0) {
  //   alert("Please select at least one subject.");
  //   isAddLoading.value = false;
  //   return;
  // }

  try {
    await api.post("/addSchedule", { records });
    initializeTimetable(); // Reset timetable
    isDialogVisible.value = false; // Close dialog
    await getSchedule(); // Refresh main table
    Toast.fire({
      title: "បង្កើតកាលវិភាគបានជោគជ័យ",
      icon: "success",
    });
  } catch (error) {
    console.error("Error saving timetable:", error);
    alert("Failed to save timetable.");
  } finally {
    isAddLoading.value = false;
  }
};

// Fetch data and initialize on mount
onMounted(async () => {
  await Promise.all([getDay(), getTime(), getSubject()]);
  initializeTimetable();
  await getSchedule();
});
</script>

<template>
  <div class="customFont">
    <!-- Header and Button -->
    <div class="d-flex align-center">
      <p style="font-size: 16px">កាលវិភាគប្រចាំសប្ដាហ៍</p>
      <v-spacer></v-spacer>
      <VBtn
        prepend-icon="mdi-pencil"
        class="py-0"
        variant="tonal"
        color="green"
        @click="editSchedule"
      >
        កំណត់កាលវិភាគ
      </VBtn>
    </div>

    <div
      v-if="checkData"
      class="d-flex flex-column justify-center align-center"
      style="margin-top: 60px"
    >
      <v-progress-circular
        color="green-darken-4"
        indeterminate
      ></v-progress-circular>
      <p class="customFont mt-2">សូមរងចាំ</p>
    </div>
    <!-- 
    <div>
      <div></div>
    </div> -->

    <!-- Main Timetable Display -->
    <table style="width: 100%; margin-top: 10px; color: grey" v-else>
      <thead>
        <th style="width: 14.2%; padding-top: 5px; color: grey">ម៉ោង</th>
        <th
          style="width: 14.2%; padding-top: 5px; color: grey"
          v-for="item in days"
          :key="item.id"
        >
          {{ item.nameKh }}
        </th>
      </thead>
      <tbody class="text-center">
        <tr v-for="time in times" :key="time.id">
          <td class="py-2">
            <p>ម៉ោងទី {{ time.id }}</p>
            <p>{{ time.time }}</p>
          </td>
          <td v-for="day in days" :key="day.id">
            {{ displayTimetable?.[time.id]?.[day.id] || "-" }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Timetable Setup Dialog -->
    <VDialog v-model="isDialogVisible" max-width="1100" class="customFont">
      <VCard>
        <VCardTitle class="text-center bg-green-darken-4">
          ព័ត៌មានកាលវិភាគប្រចាំសប្ដាហ៍
        </VCardTitle>
        <VCardText>
          <table style="width: 100%; color: grey">
            <thead>
              <th style="width: 14.2%; padding-top: 5px; color: grey">ម៉ោង</th>
              <th
                style="width: 14.2%; padding-top: 5px; color: grey"
                v-for="item in days"
                :key="item.id"
              >
                {{ item.nameKh }}
              </th>
            </thead>
            <tbody class="text-center">
              <tr v-for="t in times" :key="t.id">
                <td class="py-2">
                  <p>{{ t.time }}</p>
                </td>
                <td v-for="day in days" :key="day.id" class="pa-2">
                  <VSelect
                    hide-details
                    density="compact"
                    variant="outlined"
                    :items="subjects"
                    item-title="subject_name"
                    item-value="id"
                    v-model="timetable[t.id][day.id]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap ga-3">
          <VBtn variant="tonal" color="red" @click="isDialogVisible = false">
            បិទ
          </VBtn>
          <VBtn
            variant="tonal"
            color="green"
            @click="submit"
            :loading="isAddLoading"
          >
            រក្សាទុក
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
table,
th,
td {
  border: 1px solid rgb(189, 189, 189);
  border-collapse: collapse;
}
</style>
