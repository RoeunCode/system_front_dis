<script setup>
import Toast from "@/helper";
import { api } from "@/utils/axios";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const route = useRoute();
const router = useRouter();

const isloading = ref(false);

const editMode = ref(false);

const form = ref({
  name: null,
  grade_id: null,
  room_id: null,
  classtype_id: null,
  session_id: null,
  year_id: null,
  description: null,
  campus_id: campus_id.value,
});
watch(
  () => settingStore.campus_id,
  (newVal) => {
    campus_id.value = newVal;
    form.value.campus_id = campus_id.value;
  }
);

const resetForm = () => {
  form.value = {
    name: null,
    grade_id: null,
    room_id: null,
    classtype_id: null,
    session_id: null,
    year_id: null,
    description: null,
    campus_id: campus_id.value,
  };
};

const grades = ref([]);
const get_grade = async () => {
  try {
    await api.post("/get_all_grade").then((res) => {
      grades.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const years = ref([]);

const get_year = async () => {
  try {
    await api.post("/get_all_year").then((res) => {
      years.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const rooms = ref([]);

const get_room = async () => {
  try {
    await api
      .post("/get_all_room", {
        campus_id: campus_id.value,
      })
      .then((res) => {
        rooms.value = res.data;
      });
  } catch (error) {
    console.log(error);
  }
};

const debouncedGetRoom = debounce(get_room, 300);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;

    debouncedGetRoom();
  },
  { immediate: true }
);

const sessions = ref([]);

const get_session = async () => {
  try {
    await api.post("/get_session").then((res) => {
      sessions.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const classtypes = ref([]);

const get_classtypes = async () => {
  try {
    await api.post("/get_all_classtype").then((res) => {
      classtypes.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => [form.value.grade_id, grades.value],
  ([newGradeId, newGrades]) => {
    if (newGradeId) {
      if (newGrades.length > 0) {
        const g = newGrades.find((e) => e.id == newGradeId)?.name;
        form.value.name = `${g}`;
      } else {
        console.log("Grades are not loaded yet.");
      }
    }
  }
);

const getOneClass = async () => {
  try {
    await api.post(`/getOneClass/${route.params.id}`).then((res) => {
      Object.assign(form.value, res.data);
      // form.value = res.data;
      form.value.session_id = parseInt(form.value.session_id, 10);
    });
  } catch (error) {
    console.log(error);
  }
};

const addClassroom = async () => {
  isloading.value = true;
  console.log(form.value);
  try {
    await api
      .post("/add_classroom", form.value, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    router.push({
      name: "ClassroomList",
    });
    resetForm();
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};

const updateClassroom = async () => {
  isloading.value = true;
  const updateStudent = {
    ...form.value,
    editMode: editMode.value,
  };
  try {
    await api
      .post("/updateClassroom", updateStudent, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });

    router.push({
      name: "ClassroomList",
    });
  } catch (error) {
    console.log(error);
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};

const submit = () => {
  if (editMode.value) {
    updateClassroom();
  } else {
    addClassroom();
  }
};

onMounted(async () => {
  if (route.params.id) {
    editMode.value = true;
    getOneClass();
  }
  get_session();
  get_year();
  await get_grade();
  // get_room();
  get_classtypes();
});
</script>
<template>
  <v-row>
    <v-col cols="12" md="7" sm="12">
      <v-card class="mt-2 pa-4 border border-1" elevation="0">
        <v-card-title class="customKhmerMoul text-green-darken-4"
          ><v-icon>mdi-plus</v-icon> បង្កើតថ្នាក់រៀន</v-card-title
        >
        <v-card-text>
          <!-- 👉 Form -->
          <v-form class="mt-7 customFont">
            <v-row>
              <!-- 👉 ឈ្មោះថ្នាក់រៀន -->
              <v-col md="5" cols="12" sm="5">
                <v-text-field
                  bg-color="grey-lighten-4"
                  label="ឈ្មោះថ្នាក់រៀន"
                  variant="outlined"
                  density="compact"
                  v-model="form.name"
                >
                </v-text-field>
              </v-col>

              <!-- 👉 grade -->
              <v-col cols="6" md="4" sm="4">
                <VSelect
                  :items="grades"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  placeholder="៦"
                  label="កម្រិតថ្នាក់ *"
                  variant="outlined"
                  v-model="form.grade_id"
                />
              </v-col>

              <!-- 👉 room -->
              <v-col cols="6" md="3" sm="3">
                <VSelect
                  :items="rooms"
                  item-title="room_number"
                  item-value="id"
                  density="compact"
                  placeholder="ក"
                  label="បន្ទប់ *"
                  variant="outlined"
                  v-model="form.room_id"
                />
              </v-col>

              <!-- 👉 ប្រភេទថ្នាក់ -->
              <v-col md="4" cols="12" sm="4">
                <v-select
                  :items="classtypes"
                  label="ប្រភេទថ្នាក់"
                  variant="outlined"
                  item-title="type"
                  item-value="id"
                  density="compact"
                  v-model="form.classtype_id"
                >
                </v-select>
              </v-col>
              <!-- 👉 វេនសិក្សា -->
              <v-col md="4" cols="12" sm="4">
                <v-select
                  :items="sessions"
                  label="វេនសិក្សា"
                  variant="outlined"
                  item-title="time"
                  item-value="id"
                  density="compact"
                  v-model="form.session_id"
                >
                </v-select>
              </v-col>
              <!-- 👉 ឆ្នាំសិក្សា -->
              <v-col md="4" cols="12" sm="4">
                <v-select
                  :items="years"
                  label="ឆ្នាំសិក្សា *"
                  variant="outlined"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  v-model="form.year_id"
                >
                </v-select>
              </v-col>
              <!-- 👉 Description -->
              <v-col cols="12" md="12">
                <v-textarea
                  clearable
                  label="កត់សម្គាល់"
                  row-height="10"
                  rows="1"
                  variant="outlined"
                  auto-grow
                  shaped
                  v-model="form.description"
                ></v-textarea>
              </v-col>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap ga-4 justify-end">
                <VBtn
                  color="green"
                  :loading="isloading"
                  :disabled="isloading"
                  variant="tonal"
                  @click="submit"
                >
                  <v-icon class="text-h6">mdi-download</v-icon>រក្សាទុក
                </VBtn>
              </VCol>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
