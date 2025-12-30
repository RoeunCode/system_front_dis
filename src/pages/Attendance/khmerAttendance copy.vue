<script setup>
import { ref, watch, onMounted } from "vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import Swal from "sweetalert2";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const status = ref("");

const checkData = ref("");

const isloading = ref(false);

const isloadingAdd = ref(false);

const isAlert = ref(true);

const formSearch = ref({
  edu_id: "",
  class_id: "",
  year_id: "",
  month_id: "",
  level: "",
});

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

const years = ref([]);

const get_year = async () => {
  try {
    await api.post("/get_all_year").then((res) => {
      years.value = res.data;
    });
  } catch (error) {
    console.log(error);
  } finally {
    isAlert.value = false;
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

const classrooms = ref([]);

const get_classroom = async () => {
  try {
    await api
      .post("/get_all_classroom", {
        campus_id: campus_id.value,
      })
      .then((res) => {
        classrooms.value = res.data.filter((c) => c.deleted != 1);
      });
  } catch (error) {
    console.log(error);
  }
};

const debouncedGetClassroom = debounce(get_classroom, 300);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    formSearch.value = {
      edu_id: "",
      class_id: "",
      year_id: "",
      month_id: "",
      level: "",
    };
    checkData.value = false;
    debouncedGetClassroom();
  },
  { immediate: true }
);

const classroomFilter = ref([]);

const checkYear = ref(false);

const classInYear = ref([]);
// deleteAttendance
const deleteAttendance = async (id) => {
  try {
    Swal.fire({
      title: "តើអ្នកប្រាកដដែរឬទេថាចង់លុប?",
      text: "បើលុបហើយមិនអាចត្រលប់មកវិញទេ",
      showCancelButton: true,
      confirmButtonColor: "#ED5E68",
      cancelButtonColor: "#8388A4",
      confirmButtonText: "បាទ/ចា៎, លុប",
      cancelButtonText: "បោះបង់",
      customClass: {
        popup: "colored-toast custom-delete-swal-title",
        cancelButton: "custom-swal-cancel-button",
        confirmButton: "custom-swal-confirm-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.post(`/deleteAttendance/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        findData();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => formSearch.value.class_id,
  (newVal) => {
    const foundClass = classroomFilter.value?.find((e) => e.id == newVal);
    if (foundClass) {
      formSearch.value.level = foundClass.level;
    } else {
      formSearch.value.level = "";
    }
    console.log("level", formSearch.value.level);
  },
  { immediate: true }
);

watch(
  [() => formSearch.value.edu_id, () => formSearch.value.year_id],
  ([newEduId, newYearId]) => {
    // Filter classes by year if year_id changes
    console.log("nY", newYearId);
    if (newYearId) {
      classInYear.value = classrooms.value?.filter(
        (c) => c.year_id == newYearId
      );
      checkYear.value = true;
    }

    // Filter classrooms by edu_id and reset class_id
    if (newEduId) {
      classroomFilter.value = classInYear.value?.filter(
        (c) => c.education_id == newEduId
      );

      console.log("classroomfilter", classroomFilter.value);
      formSearch.value.class_id = null;
    }
  },
  { immediate: true }
);

const studentsAttendance = ref([]);
const findData = async () => {
  try {
    isloading.value = true;
    await api
      .post("/showStudentAttendance", formSearch.value, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        studentsAttendance.value = res.data.student_class;
        status.value = res.data.status;
      });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
    if (studentsAttendance.value.length > 0) {
      checkData.value = true;
    } else {
      checkData.value = false;
      Toast.fire({
        title: "មិនមានទិន្នន័យសិស្សសម្រាប់បញ្ចូលអវត្តមាន",
        icon: "warning",
      });
    }
  }
};

const addAttendance = async () => {
  isloadingAdd.value = true;
  const data = {
    ...studentsAttendance.value,
    class_id: formSearch.value.class_id,
    month_id: formSearch.value.month_id,
    status: status.value,
  };
  try {
    await api
      .post("/save_attendance", data, {
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
  } catch (error) {
    Toast.fire({
      title: error.response.data.messaage,
      icon: "error",
    });
  } finally {
    isloadingAdd.value = false;
    checkData.value = false;
  }
};

onMounted(() => {
  get_year();
  getEdu();
  get_classroom();
  get_month();
});
</script>
<template>
  <div>
    <div
      v-if="isAlert"
      class="d-flex flex-column justify-center align-center"
      style="margin-top: 300px"
    >
      <v-progress-circular
        color="green-darken-4"
        indeterminate
      ></v-progress-circular>
      <p class="customFont mt-2">សូមរងចាំ</p>
    </div>
    <VRow v-else>
      <VCol cols="12" md="12" sm="12">
        <VCard elevation="0" class="border">
          <v-card-title
            class="customKhmerMoul text-green-darken-4 bg-grey-lighten-4 py-4 text-center"
          >
            បញ្ចូលអវត្តមានសិស្ស
          </v-card-title>

          <div class="mt-3">
            <v-col cols="6" md="3" sm="6" class="d-flex ga-2">
              <VSelect
                :items="years"
                item-value="id"
                item-title="name"
                class="customFont w-33"
                density="compact"
                placeholder="៦"
                label="ឆ្នាំសិក្សា"
                variant="outlined"
                v-model="formSearch.year_id"
              />
            </v-col>

            <v-col cols="6" md="6" v-if="checkYear">
              <VRow>
                <VCol cols="12" sm="6" md="4"
                  ><VSelect
                    :items="educationLevels"
                    item-value="id"
                    item-title="edu_name"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="កម្រិតអប់រំ"
                    variant="outlined"
                    v-model="formSearch.edu_id"
                /></VCol>

                <VCol cols="12" sm="6" md="3">
                  <VSelect
                    :items="classroomFilter"
                    item-value="id"
                    item-title="grade"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="កម្រិតថ្នាក់"
                    variant="outlined"
                    v-model="formSearch.class_id"
                  />
                </VCol>

                <VCol cols="12" sm="6" md="3">
                  <VSelect
                    :items="months"
                    item-value="id"
                    item-title="name_kh"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="ប្រចាំខែ"
                    variant="outlined"
                    v-model="formSearch.month_id"
                  />
                </VCol>

                <VCol cols="6" md="2">
                  <v-btn
                    @click="findData"
                    variant="tonal"
                    color="green"
                    class="customFont"
                    :loading="isloading"
                    :disabled="isloading"
                    >ស្វែងរក</v-btn
                  >
                </VCol>
              </VRow>
            </v-col>
          </div>

          <VCardText v-if="checkData">
            <table style="width: 100%">
              <thead
                class="customFont bg-grey-lighten-4 my-custom-table"
                style="font-weight: bold; font-size: 15px"
              >
                <th style="width: 25%" class="py-2">ឈ្មោះសិស្ស</th>
                <th style="width: 6%">ភេទ</th>
                <th style="width: 15%">មានច្បាប់</th>
                <th style="width: 15%">អត់ច្បាប់</th>
                <th style="width: 35%">ចំណាំ</th>
                <th style="width: 4%">ចំណាំ</th>
              </thead>

              <tbody class="customFont">
                <tr v-for="(item, idx) in studentsAttendance" :key="idx">
                  <td class="pl-4">{{ item.kh_name }}</td>
                  <td class="text-center">
                    <p v-if="item.gender == 1 || item.gender == 'M'">ប្រុស</p>
                    <p v-else-if="item.gender == 2 || item.gender == 'F'">
                      ស្រី
                    </p>
                  </td>
                  <td class="pa-2">
                    <VTextField
                      hide-details
                      density="compact"
                      variant="outlined"
                      v-model="item.permission"
                    />
                  </td>
                  <td class="pa-2">
                    <VTextField
                      hide-details
                      density="compact"
                      variant="outlined"
                      v-model="item.absen"
                    />
                  </td>
                  <td class="pa-2">
                    <VTextField
                      hide-details
                      density="compact"
                      variant="outlined"
                    />
                  </td>
                  <td class="pa-2">
                    <VBtn
                      @click="deleteAttendance(item.id)"
                      color="bg-grey-lighten-4"
                      variant="outlined"
                      >លុប</VBtn
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-center customFont mt-2">
              <VBtn
                variant="tonal"
                :loading="isloadingAdd"
                @click="addAttendance"
                color="green-darken-1"
                >បញ្ចូលអវត្តមាន</VBtn
              >
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
<style scoped>
.my-custom-table {
  text-overflow: ellipsis;
  white-space: nowrap;
}
table,
th {
  border: 1px solid black;
}

table,
td {
  border: 1px solid grey;
  border-collapse: collapse;
}
</style>
