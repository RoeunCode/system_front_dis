<script setup>
import Toast from "@/helper";
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api } from "@/utils/axios";
import { shallowRef } from "vue";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";



const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);
const route = useRoute();

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const user_id = ref(user.value.id);
const user_role_id = ref(user.value.role_id);

const router = useRouter();

const editMode = ref(false);

const isloading = ref(false);

const threeMonth1 = shallowRef([]);
const threeMonth2 = shallowRef([]);

const form = ref({
  id: "",
  type: "",
  semester_month1: "",
  semester_month2: "",
  three_months_semester1: "",
  three_months_semester2: "",
  edu_id: "",
  year_id: "",
  campus_id: campus_id.value,
});

watch(
  () => threeMonth1.value,
  (newVal) => {
    form.value.three_months_semester1 = newVal;
  }
);
watch(
  () => threeMonth2.value,
  (newVal) => {
    form.value.three_months_semester2 = newVal;
  }
);

const resetForm = () => {
  form.value = {
    id: "",
    type: "",
    semester_month1: "",
    semester_month2: "",
    three_months_semester1: "",
    three_months_semester2: "",
    edu_id: "",
    year_id: "",
    campus_id: campus_id.value,
  };
  threeMonth1.value = null;
  threeMonth2.value = null;
};

watch(
  () => settingStore.campus_id,
  (newVal) => {
    campus_id.value = newVal;
    form.value.campus_id = campus_id.value;
  }
);

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

const months = ref([]);

const get_month = async () => {
  try {
    await api.post("/get_all_month").then((res) => {
      months.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const addSemester = async () => {
  form.value.three_months_semester1 = form.value.three_months_semester1
    .map((item) => item)
    .join(",");
  form.value.three_months_semester2 = form.value.three_months_semester2
    .map((item) => item)
    .join(",");
  console.log(form.value);
  isloading.value = true;
  try {
    await api
      .post("/createSemester", form.value, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    resetForm();
    router.push("semester");
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};

const updateSemester = async () => {
  form.value.three_months_semester1 = form.value.three_months_semester1
    .map((item) => item)
    .join(",");
  form.value.three_months_semester2 = form.value.three_months_semester2
    .map((item) => item)
    .join(",");
  isloading.value = true;
  try {
    await api
      .post("/updateSemesterlist", form.value, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    router.go(-1);
  } catch (error) {
    console.log(error);
  } finally {
    isloading.value = false;
  }
};

const getOneSemester = async () => {
  try {
    await api.post(`/getOneSemesterList/${route.params.id}`).then((res) => {
      Object.assign(form.value, res.data);
      threeMonth1.value = res.data.three_months_semester1;
      threeMonth2.value = res.data.three_months_semester2;
      // form.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const onSubmit = () => {
  if (editMode.value) {
    updateSemester();
  } else {
    addSemester();
  }
};

const numberedSteps = [
  {
    title: "Account Details",
    subtitle: "Setup Account Details",
  },

  {
    title: "Social Links",
    subtitle: "Add social links",
  },
];

const currentStep = ref(0);
const isPasswordVisible = ref(false);
const isCPasswordVisible = ref(false);
onMounted(() => {
  get_month();
  getEdu();
  get_year();
  if (route.params.id) {
    editMode.value = true;
    console.log(editMode.value);
  }
  getOneSemester();
});
</script>
<template>
  <div>
    <VRow>
      <VCol cols="12" md="6">
        <v-card class="mt-5 pa-4 border" elevation="0">
          <v-card-title class="customKhmerMoul text-green-darken-4"
            ><h4>ការកំណត់ខែឆមាស</h4></v-card-title
          >

          <VCardText>
            <!-- 👉 stepper content -->
            <VForm>
              <VRow>
                <VCol cols="12">
                  <h3
                    class="customKhmerMoul text-orange-darken-4 text-center mt-4"
                  >
                    ឆមាសទី១
                  </h3>
                </VCol>

                <!-- <VCol cols="12" md="4">
                      <VSelect
                        :items="years"
                        item-value="id"
                        item-title="name"
                        class="customFont"
                        density="compact"
                        placeholder="៦"
                        label="ឆ្នាំសិក្សា"
                        variant="outlined"
                        v-model="form.year_id"
                      />
                    </VCol>

                    <VCol cols="12" md="4">
                      <VSelect
                        :items="educationLevels"
                        item-value="id"
                        item-title="edu_name"
                        class="customFont"
                        density="compact"
                        placeholder="៦"
                        label="កម្រិតអប់រំ"
                        variant="outlined"
                        v-model="form.edu_id"
                      />
                    </VCol> -->

                <VCol cols="12" md="4">
                  <VSelect
                    :items="months"
                    item-value="id"
                    item-title="name_kh"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="ខែឆមាស"
                    variant="outlined"
                    v-model="form.semester_month1"
                  />
                </VCol>

                <VCol cols="12" md="8">
                  <VSelect
                    :items="months"
                    item-value="id"
                    item-title="name_kh"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="បីខែឆមាស"
                    variant="outlined"
                    chips
                    multiple
                    v-model="threeMonth1"
                  />
                </VCol>

                <VCol cols="12">
                  <h3
                    class="customKhmerMoul text-orange-darken-4 text-center mt-4"
                  >
                    ឆមាសទី២
                  </h3>
                </VCol>

                <VCol cols="12" md="4">
                  <VSelect
                    :items="months"
                    item-value="id"
                    item-title="name_kh"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="ខែឆមាស"
                    variant="outlined"
                    v-model="form.semester_month2"
                  />
                </VCol>

                <VCol cols="12" md="8">
                  <VSelect
                    :items="months"
                    item-value="id"
                    item-title="name_kh"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="បីខែឆមាស"
                    variant="outlined"
                    chips
                    multiple
                    v-model="threeMonth2"
                  />
                </VCol>
                <VCol cols="12" md="12" class="text-end">
                  <VBtn
                    color="success"
                    elevation="0"
                    variant="tonal"
                    @click="updateSemester"
                    class="customFont"
                  >
                    បញ្ជូន
                  </VBtn></VCol
                >
              </VRow>

              <!-- <div
                class="d-flex gap-4 justify-sm-space-between justify-center mt-8"
              ></div> -->
            </VForm>
          </VCardText>
        </v-card>
      </VCol>
    </VRow>
  </div>
</template>
