<script setup>
import Toast from "@/helper";
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import GradeList from "./gradeList.vue";
import { api } from "@/utils/axios";

const router = useRouter();

const route = useRoute();

const isloading = ref(false);

const curriculums = ref([]);

const editMode = ref(false);

const form = ref({
  cur_id: null,
  name: null,
  grade_level_id: null,
  symbol: null,
  edu_id: "",
});

const resetForm = () => {
  form.value = {
    cur_id: null,
    name: null,
    grade_level_id: null,
    symbol: null,
    edu_id: "",
  };
};

const isEdu = ref(false);

watch(
  () => form.value.cur_id,
  (newVal) => {
    if (newVal != 1) {
      isEdu.value = true;
      form.value.edu_id = "";
    } else {
      isEdu.value = false;
    }
  }
);

const grades = ref([]);

const get_grade = async () => {
  try {
    await api.post("/get_grade_level").then((res) => {
      grades.value = res.data;
      console.log(grades.value);
    });
  } catch (error) {
    console.log(error);
  }
};

const educationLevels = ref([]);

const getEdu = async () => {
  try {
    await api.post("/get_all_edu").then((res) => {
      educationLevels.value = res.data;
      console.log(educationLevels.value);
    });
  } catch (error) {
    console.log(error);
  }
};

const getCur = async () => {
  try {
    await api.post("/get_all_curriculum").then((res) => {
      curriculums.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const addGrade = async () => {
  console.log(form.value);
  try {
    isloading.value = true;
    await api
      .post("/add_grade", form.value, {
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
    router.push("grade");
    resetForm();
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

const symbols = ref([
  {
    name: "ក",
  },
  {
    name: "ខ",
  },
  {
    name: "គ",
  },
  {
    name: "ឃ",
  },
  {
    name: "ង",
  },
  {
    name: "ក(រសៀល)",
  },
  {
    name: "ខ(រសៀល)",
  },
  {
    name: "គ(រសៀល)",
  },
  {
    name: "ឃ(រសៀល)",
  },
  {
    name: "ង(រសៀល)",
  },

  {
    name: "A",
  },
  {
    name: "B",
  },
  {
    name: "C",
  },
  {
    name: "D",
  },
  {
    name: "E",
  },
]);

watch([() => form.value.grade_level_id, () => form.value.symbol], ([g, s]) => {
  // const gl = grades.value.find((t) => t.id === g)?.level;
  const gl = g;
  // if (form.value.id) {
  //   gl = grades.value.find((t) => t.id === form.value.grade_level_id)?.level;
  // }

  console.log("gl", gl);
  if (!s) {
    form.value.name = `${gl}`;
  } else {
    form.value.name = `${gl} ${s}`;
  }
});

const getOneGrade = async () => {
  await api.post(`getOneGrade/${route.params.id}`).then((res) => {
    form.value = res.data;
    console.log("getOne", form.value);
  });
};

const updateGrade = async () => {
  try {
    isloading.value = true;
    await api.post("/updateGrade", form.value).then((res) => {
      Toast.fire({
        title: res.data.message,
        icon: "success",
      });
    });
    resetForm();
    router.push({
      name: "GradeList",
    });
  } catch (error) {
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
    updateGrade();
  } else {
    addGrade();
  }
};

onMounted(() => {
  if (route.params.id) {
    editMode.value = true;
    console.log(editMode.value);
    getOneGrade();
  }
  get_grade();
  getCur();
  getEdu();
});
</script>
<template>
  <v-row>
    <v-col cols="12" md="7" sm="12">
      <v-card class="mt-2 pa-4 border border-1" elevation="0">
        <v-card-title class="customKhmerMoul text-green-darken-4"
          >បង្កើតកម្រិតថ្នាក់</v-card-title
        >

        <v-card-text>
          <!-- 👉 Form -->
          <v-form class="mt-6 customFont">
            <v-row>
              <!-- 👉 ឈ្មោះកម្រិតថ្នាក់សិក្សា -->
              <v-col md="5" cols="12" sm="6">
                <v-text-field
                  readonly
                  label="ឈ្មោះកម្រិតថ្នាក់សិក្សា"
                  variant="outlined"
                  density="compact"
                  v-model="form.name"
                >
                </v-text-field>
              </v-col>

              <!-- 👉 grade -->
              <v-col cols="6" md="4" sm="3">
                <VSelect
                  :items="grades"
                  item-title="level"
                  item-value="id"
                  density="compact"
                  placeholder="៦ក"
                  label="កម្រិតសិក្សា *"
                  variant="outlined"
                  v-model="form.grade_level_id"
                />
              </v-col>

              <!-- 👉 អក្សរសម្គាល់ -->
              <v-col cols="6" md="3" sm="3">
                <VSelect
                  :items="symbols"
                  item-title="name"
                  item-value="name"
                  density="compact"
                  placeholder="ក"
                  label="អក្សរសម្គាល់ *"
                  variant="outlined"
                  v-model="form.symbol"
                />
              </v-col>

              <!-- 👉 កម្មវិធីសិក្សា -->
              <v-col md="6" cols="12" sm="6">
                <v-select
                  label="កម្មវិធីសិក្សា *"
                  variant="outlined"
                  :items="curriculums"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  v-model="form.cur_id"
                >
                </v-select>
              </v-col>

              <!-- 👉 eduLevel -->
              <v-col md="6" cols="12" v-if="isEdu" sm="6">
                <v-select
                  disabled
                  label="កម្មវិធីសិក្សា *"
                  variant="outlined"
                  :items="educationLevels"
                  item-title="edu_name"
                  item-value="id"
                  density="compact"
                >
                </v-select>
              </v-col>
              <!-- 👉 eduLevel -->
              <v-col md="6" cols="12" v-else sm="6">
                <v-select
                  label="កម្រិតអប់រំ *"
                  variant="outlined"
                  :items="educationLevels"
                  item-title="edu_name"
                  item-value="id"
                  density="compact"
                  v-model="form.edu_id"
                >
                </v-select>
              </v-col>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap ga-4 justify-end">
                <VBtn
                  :loading="isloading"
                  :disabled="isloading"
                  variant="tonal"
                  color="green"
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
