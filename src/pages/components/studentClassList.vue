<script setup>
import { onMounted, ref, computed, nextTick } from "vue";
import draggable from "vuedraggable";
import { useStore } from "@/store/index";
import { useRoute } from "vue-router";
import axios from "axios";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import Swal from "sweetalert2";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";
import primary from "./tranfer/primary.vue";
import secondary from "./tranfer/secondary.vue";
import upper from "./tranfer/upper.vue";

const dialogRfId = ref(false);

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const dialogUpgrade = ref(false);

const router = useRouter();

const dialogChangeClass = ref(false);

const isloading = ref(false);

const route = useRoute();

const store = useStore();

const dialog = ref(false);

const search = ref("");

const loading = ref(false);

const students = ref([]);

const studentNoClass = ref();

const grade = ref([]);

const searchSelect = ref("");

const selectedStudent = ref([]);

const selectedStudentToRemove = ref([]);

const oldClassId = ref(route.params.id);

const dragdrop = ref(false);

const eduId = ref(null);

const dialogPrimary = ref(false);

const dialogSecondary = ref(false);

const dialogHigh = ref(false);

const formUpgrade = ref({
  yearId: "",
  classId: "",
});

const exportExcel = async () => {
  try {
    const response = await api.post(
      `exportStudentClass/${route.params.id}`,
      {},
      {
        responseType: "blob", // Important to handle file downloads
      }
    );
    let fileURL = window.URL.createObjectURL(new Blob([response.data]));
    let fileLink = document.createElement("a");
    fileLink.href = fileURL;
    fileLink.setAttribute("download", `student_class_${route.params.id}.xlsx`);
    document.body.appendChild(fileLink);
    fileLink.click();
    document.body.removeChild(fileLink);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

const getStudent = async () => {
  loading.value = true;
  try {
    await api.post(`/get_one_student_class/${route.params.id}`).then((res) => {
      students.value = res.data.students;
      // console.log("student", students.value);
      studentNoClass.value = res.data.students_not_in_class;
    });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const loadingUpgrade = ref(false);

const upgradeClass = async () => {
  let transformedData = selectedStudentToRemove.value.map((student) => ({
    id: student.student_id,
  }));

  loadingUpgrade.value = true;

  try {
    await api
      .post(
        `add_student_class/${formUpgrade.value.classId}`,
        {
          data: transformedData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
  } catch (error) {
    console.log(error);
  } finally {
    dialogUpgrade.value = false;
    loadingUpgrade.value = false;
    formUpgrade.value = {
      yearId: null,
      classId: null,
    };
    transformedData = [];
    selectedStudentToRemove.value = [];
  }

  console.log(transformedData);
};

const classrooms = ref({});
const filterClass = ref({});

const get_classroom = async () => {
  loading.value = true;
  try {
    await api
      .post("/get_all_classroom", {
        campus_id: campus_id.value, // Pass campus_id
      })
      .then((res) => {
        classrooms.value = res.data;
        eduId.value = classrooms.value.find(
          (c) => c.id == route.params.id
        ).education_id;

        console.log("edu", eduId.value);

        filterClass.value = classrooms.value.filter((c) => c.deleted != 1);
      });
  } catch (error) {
    console.log(error);
  }
};

const newClassId = ref();

const studentChangeClass = async () => {
  loadingUpgrade.value = true;
  try {
    let transformedData = selectedStudentToRemove.value.map((student) => ({
      id: student.student_id,
    }));
    await api
      .post(
        "/student_change_class",
        {
          data: transformedData,
          new_class_id: newClassId.value,
          old_class_id: route.params.id,
          edu_id: eduId.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    getStudent();
    dialogChangeClass.value = false;
    loadingUpgrade.value = false;
  }
};

const AddStudentClass = async () => {
  isloading.value = true;

  // console.log(selectedStudent.value);

  let transformedData = selectedStudent.value.map((student) => ({
    id: student.id,
  }));

  try {
    await api
      .post(
        `add_student_class/${route.params.id}`,
        { data: transformedData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });

    dialog.value = false;

    getStudent();
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
    console.log(error);
  } finally {
    isloading.value = false;
    selectedStudent.value = null;
    transformedData = null;
  }
};

const changeSort = async () => {
  let transformedDataSort = students.value.map((student) => ({
    id: student.id,
    sort: student.sort,
    student_id: student.student_id,
  }));

  console.log(students.value);

  try {
    await api
      .post(
        `change_sort/${route.params.id}`,
        {
          data: transformedDataSort,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: error,
    });
  }
};

const removeStudentFromClass = async (id) => {
  let transformedData = selectedStudentToRemove.value.map((student) => ({
    id: student.id,
  }));
  console.log("remove", transformedData);

  Swal.fire({
    title: "តើប្រាកដឬទេថាចង់ដកសិស្សចេញ?",
    text: "បើដកហើយមិនអាចត្រលប់មកវិញទេ",
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
      try {
        await api.post(
          `remove_student_class/${id}`,
          { data: transformedData },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // .then((res) => {
        //   Toast.fire({
        //     title: res.data.message,
        //     icon: "success",
        //   });
        // });
        getStudent();
      } catch (error) {
        Toast.fire({
          title: error.response.data.message,
          icon: "error",
        });
        console.log(error);
      } finally {
        console.log("final0", transformedData);
        isloading.value = false;
        transformedData = [];
        selectedStudentToRemove.value = [];
        console.log("final", transformedData);

        Toast.fire({
          title: "សិស្សត្រូវបានដកចេញពីថ្នាក់",
          icon: "success",
        });
      }
    }
  });
};

const removeStudentFromId = async (id) => {
  Swal.fire({
    title: "តើប្រាកដឬទេថាចង់ដកសិស្សចេញ?",
    text: "បើដកហើយមិនអាចត្រលប់មកវិញទេ",
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
      try {
        await api.post(`remove_student_id/${id}`).then((res) => {
          Toast.fire({
            title: res.data.message,
            icon: "success",
          });
        });
        getStudent();
      } catch (error) {
        Toast.fire({
          title: error.response.data.message,
          icon: "error",
        });
        console.log(error);
      } finally {
        isloading.value = false;
      }
    }
  });
};

const headers = ref([
  {
    key: "student_card_id",
    title: "អត្តលេខ",
  },
  {
    key: "kh_name",
    title: "ឈ្មោះខ្មែរ",
  },
  {
    key: "en_name",
    title: "ឈ្មោះអង់គ្លេស",
  },
  {
    key: "gender",
    title: "ភេទ",
  },
  {
    key: "dob",
    title: "ថ្ងៃខែឆ្នាំកំណើត",
  },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

const headersSelect = ref([
  {
    key: "student_card_id",
    title: "អត្តលេខ",
  },
  {
    key: "kh_name",
    title: "ឈ្មោះខ្មែរ",
  },
  {
    key: "en_name",
    title: "ឈ្មោះអង់គ្លេស",
  },
  {
    key: "gender",
    title: "ភេទ",
  },
  {
    key: "dob",
    title: "ថ្ងៃខែឆ្នាំកំណើត",
  },
]);

const props = defineProps({
  classroomInfo: {
    type: Array,
    required: true,
  },
});

// const studentDetail = (id) => {
//   router.push({
//     name: "StudentDetail",
//     params: { id },
//   });
// };

watch(
  () => props.classroomInfo,
  (newVal) => {
    grade.value = newVal[0].grade_name;
  },
  { immediate: true }
);

const years = ref([]);

const get_year = async () => {
  loading.value = true;
  try {
    await api.post("/get_all_year").then((res) => {
      years.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const newClass = ref([]);
watch(
  () => formUpgrade.value.yearId,
  (newVal) => {
    console.log("Selected yearId:", newVal);

    newClass.value = filterClass.value.filter((c) => c.year_id == newVal);

    newClass.value = newClass.value.filter((c) => c.id != route.params.id);
    console.log("Filtered classes:", newClass.value);
  }
);

const getNotInClass = async () => {
  loading.value = true;
  try {
    await api
      .post(`/student_not_in_class/${route.params.id}`, {
        campus_id: campus_id.value,
      })
      .then((res) => {
        // students.value = res.data.students;
        console.log("student", students.value);
        studentNoClass.value = res.data;
      });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const newStudentId = ref(null);
const newStudentName = ref(null);

const addScoreToNewStudent = (item) => {
  console.log("item", item);

  newStudentId.value = item.student_id;
  newStudentName.value = item.kh_name;

  console.log(newStudentName.value);
  if (eduId.value == 3 || eduId.value == "3") {
    dialogHigh.value = true;
  } else if (eduId.value == 2 || eduId.value == "2") {
    dialogSecondary.value = true;
  } else {
    dialogPrimary.value = true;
  }
};

const debouncedgetNotInClass = debounce(getNotInClass, 500);
const debouncedGet_classroom = debounce(get_classroom, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedgetNotInClass();
    debouncedGet_classroom();
  },
  { immediate: true }
);

const rfInputs = ref([]);

const focusNext = async (index) => {
  await nextTick();

  const nextInput = rfInputs.value[index + 1];
  if (nextInput) {
    nextInput.focus();
  }
};

const loadingInputId = ref(false);

const inputRfId = async () => {
  loadingInputId.value = true;
  let transformedData = students.value.map((student) => ({
    id: student.id,
    student_id: student.student_id,
    rf_id: student.rf_id,
  }));
  try {
    await api
      .post(
        `input_rfId/${route.params.id}`,
        {
          data: transformedData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
        dialogRfId.value = false;
      });
  } catch (error) {
    console.log(error),
      Toast.fire({
        title: error.response.data.message,
        icon: "error",
      });
  } finally {
    loadingInputId.value = false;
  }
};

onMounted(() => {
  rfInputs.value[0]?.focus();
  getStudent();
  // get_classroom();
  get_year();
  // students.value = store.studentClass;
  // studentNoClass.value = store.student_no_class;
  console.log(Array.isArray(studentNoClass.value)); // Should return true
  // grade.value = students.value[0]?.grade_name;
  // grade.value = store.classroom[0]?.grade_name;
});
</script>
<template>
  <div>
    <v-row class="align-center mt-2">
      <v-col cols="12" md="3">
        <v-text-field
          class="customFont"
          elevation="3"
          append-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          label="ស្វែងរក"
          hide-details
          single-line
          v-model="search"
        ></v-text-field>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" md="5" class="d-flex justify-end ga-2">
        <v-expand-transition>
          <v-btn
            v-if="selectedStudentToRemove.length != 0"
            prepend-icon="mdi-minus"
            @click="removeStudentFromClass"
            variant="tonal"
            color="red"
            class="customFont"
          >
            ដកសិស្សចេញពីថ្នាក់
          </v-btn>
        </v-expand-transition>

        <v-expand-transition>
          <v-btn
            v-if="selectedStudentToRemove.length != 0"
            prepend-icon="mdi-stairs-up"
            @click="dialogUpgrade = !dialogUpgrade"
            variant="tonal"
            color="green"
            class="customFont"
          >
            តំឡើងថ្នាក់
          </v-btn>
        </v-expand-transition>

        <v-expand-transition>
          <v-btn
            v-if="selectedStudentToRemove.length != 0"
            prepend-icon="mdi-swap-horizontal"
            @click="dialogChangeClass = !dialogChangeClass"
            variant="tonal"
            color="green"
            class="customFont"
          >
            ផ្លាស់ប្ដូរថ្នាក់
          </v-btn>
        </v-expand-transition>

        <v-btn
          prepend-icon="mdi-plus"
          @click="dialog = !dialog"
          variant="tonal"
          color="green"
          class="customFont"
        >
          បញ្ចូលសិស្ស
        </v-btn>

        <v-btn
          prepend-icon="mdi-plus"
          @click="dragdrop = !dragdrop"
          variant="tonal"
          color="green"
          class="customFont"
        >
          changeIndex
        </v-btn>

        <v-btn
          prepend-icon="mdi-pencil"
          @click="dialogRfId = !dialogRfId"
          variant="tonal"
          color="orange"
          class="customFont"
        >
          បញ្ចូល RFID
        </v-btn>

        <!-- <v-btn @click="exportExcel"> excel </v-btn> -->
      </v-col>
    </v-row>
    <!-- {{ students }} -->

    <v-data-table
      v-model="selectedStudentToRemove"
      show-select
      return-object
      :headers="headers"
      :items="students"
      :search="search"
      :loading="loading"
      :loading-text="loading ? 'Loading...' : ''"
      :no-data-text="loading ? '' : 'មិនមានទិន្នន័យទេ'"
      items-per-page="7"
      class="customFont mt-3 my-custom-table"
    >
      <template v-slot:item.gender="{ item }">
        <p>{{ item.gender == 1 || item.gender == "M" ? "ប្រុស" : "ស្រី" }}</p>
      </template>

      <template v-slot:item.action="row">
        <!-- <v-btn
          flat
          size="30"
          class="text-green my-1"
          @click="studentDetail(row.item.id)"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn> -->
        <v-btn
          flat
          size="30"
          class="text-red-darken-2 my-1"
          @click="removeStudentFromId(row.item.id)"
        >
          <v-icon>mdi-account-cancel</v-icon>
          <v-tooltip activator="parent" class="customFont" location="end">
            លុបចេញពីថ្នាក់
          </v-tooltip>
        </v-btn>
        <VBtn
          flat
          size="30"
          class="text-green-darken-2 my-1"
          @click="addScoreToNewStudent(row.item)"
        >
          <v-icon>mdi-table-plus</v-icon>
          <v-tooltip activator="parent" class="customFont" location="end">
            បញ្ចូលពិន្ទុសិស្សចូលថ្មី
          </v-tooltip>
        </VBtn>
      </template>
    </v-data-table>

    <!-- Upgrade class -->
    <VDialog
      v-model="dialogUpgrade"
      max-width="500px"
      transition="dialog-transition"
    >
      <VCard>
        <VCardTitle class="customFont bg-green-darken-4 py-3">
          តំឡើងថ្នាក់រៀន
        </VCardTitle>
        <VCardText class="mt-3">
          <VRow>
            <VCol cols="12" md="6">
              <VSelect
                class="customFont"
                :items="years"
                item-title="name"
                item-value="id"
                density="compact"
                placeholder=" អគារ A"
                label="ឆ្នាំសិក្សា"
                variant="outlined"
                v-model="formUpgrade.yearId"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect
                class="customFont"
                :items="newClass"
                item-title="grade"
                item-value="id"
                density="compact"
                placeholder=" អគារ A"
                label="ថ្នាក់រៀន"
                variant="outlined"
                v-model="formUpgrade.classId"
              />
            </VCol>
            <VCol
              cols="12"
              md="12"
              class="text-end customFont"
              style="margin-top: -20px"
            >
              <VBtn
                :disabled="loadingUpgrade"
                :loading="loadingUpgrade"
                @click="upgradeClass"
                color="green-darken-3"
                >បញ្ចូល</VBtn
              >
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- DragDrop -->
    <VDialog v-model="dragdrop" max-width="400px" max-height="900" opacity="0.8"
      ><VCard>
        <VCardTitle class="position-fixed bg-green-darken-4 color-white w-100"
          >Update Numbering</VCardTitle
        >
        <VCardText class="mt-5">
          <draggable v-model="students" item-key="id" class="pa-3">
            <template #item="{ element }">
              <div
                class="drag pa-1 pl-4 mt-2 bg-green-lighten-5 rounded-lg border border-green cursor-move"
              >
                <!-- <v-icon class="cursor-move" data-drag-handle> mdi-drag </v-icon> -->
                {{ element.sort }} - {{ element.kh_name }} -
                {{ element.en_name }}
              </div>
            </template>
          </draggable>
          <div class="pa-3">
            <VBtn
              @click="changeSort"
              variant="outlined"
              class="w-100 bg-green-darken-4"
            >
              ផ្លាស់ប្ដូរ
            </VBtn>
          </div>
        </VCardText>
      </VCard></VDialog
    >

    <VDialog
      v-model="dialogRfId"
      max-width="550px"
      transition="dialog-transition"
    >
      <VCard>
        <VCardTitle class="customFont text-center bg-green-darken-4 py-3">
          បញ្ចូល RFID
        </VCardTitle>
        <VCardText class="mt-3">
          <VRow v-for="(student, index) in students" :key="student.id">
            <VCol cols="6" md="6" class="py-0">
              <VTextField
                density="compact"
                variant="outlined"
                v-model="student.kh_name"
              />
            </VCol>

            <VCol cols="6" md="6" class="py-0">
              <VTextField
                :ref="(el) => (rfInputs[index] = el)"
                density="compact"
                variant="outlined"
                v-model="student.rf_id"
                @keydown.enter.prevent="focusNext(index)"
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" md="12">
              <VBtn
                @click="inputRfId"
                color="green-darken-3 w-100"
                :loading="loadingInputId"
                :disabled="loadingInputId"
              >
                បញ្ជូន
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Upgrade class -->
    <VDialog
      v-model="dialogChangeClass"
      max-width="500px"
      transition="dialog-transition"
    >
      <VCard>
        <VCardTitle class="customFont bg-green-darken-4 py-3">
          ផ្លាស់ប្ដូរថ្នាក់រៀន
        </VCardTitle>
        <VCardText class="mt-3">
          <VRow>
            <VCol cols="12" md="6">
              <VSelect
                class="customFont"
                :items="years"
                item-title="name"
                item-value="id"
                density="compact"
                placeholder=" អគារ A"
                label="ឆ្នាំសិក្សា"
                variant="outlined"
                v-model="formUpgrade.yearId"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect
                class="customFont"
                :items="newClass"
                item-title="grade"
                item-value="id"
                density="compact"
                placeholder=" អគារ A"
                label="ថ្នាក់រៀន"
                variant="outlined"
                v-model="newClassId"
              />
            </VCol>
            <VCol
              cols="12"
              md="12"
              class="text-end customFont"
              style="margin-top: -20px"
            >
              <VBtn
                :disabled="loadingUpgrade"
                :loading="loadingUpgrade"
                @click="studentChangeClass"
                color="green-darken-3"
                >បញ្ចូល</VBtn
              >
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Add Students Dialog -->
    <VDialog
      max-width="900"
      v-model="dialog"
      scrollable
      transition="dialog-transition"
    >
      <VCard>
        <VCardTitle class="customFont bg-green-darken-4 py-3">
          បន្ថែមសិស្សក្នុងថ្នាក់
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="2">
              <div class="customFont d-flex ga-2 align-center">
                <p><span class="text-red font-weight-bold">*</span>ថ្នាក់ទី</p>
                <v-text-field
                  readonly
                  class="customFont bg-green-lighten-5"
                  elevation="3"
                  density="compact"
                  variant="outlined"
                  hide-details
                  single-line
                  v-model="grade"
                ></v-text-field>
              </div>
            </VCol>
            <v-spacer></v-spacer>
            <V-col cols="12" md="4">
              <v-text-field
                class="customFont"
                elevation="3"
                append-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                label="ស្វែងរកសិស្ស"
                hide-details
                single-line
                v-model="searchSelect"
              ></v-text-field>
              <div class="d-flex justify-end mt-2">
                <v-btn
                  :loading="isloading"
                  prepend-icon="mdi-plus"
                  class="text-end customFont"
                  color="green"
                  variant="tonal"
                  @click="AddStudentClass"
                  >រក្សាទុក</v-btn
                >
              </div>
            </V-col>
            <VCol cols="12" md="12" sm="12">
              <v-data-table
                v-model="selectedStudent"
                :headers="headersSelect"
                :items="studentNoClass"
                :search="searchSelect"
                :loading="loading"
                :loading-text="loading ? 'Loading...' : ''"
                :no-data-text="loading ? '' : 'មិនមានទិន្នន័យទេ'"
                items-per-page="7"
                show-select
                return-object
                class="customFont mt-3 my-custom-table"
              >
                <template v-slot:item.gender="{ item }">
                  <p>
                    {{
                      item.gender == 1 || item.gender == "M" ? "ប្រុស" : "ស្រី"
                    }}
                  </p>
                </template>
              </v-data-table>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- primary -->
    <VDialog
      max-width="900"
      v-model="dialogPrimary"
      scrollable
      transition="dialog-transition"
    >
      <primary
        :eduId="eduId"
        :classId="oldClassId"
        :newStudentId="newStudentId"
        :newStudentName="newStudentName"
      />
    </VDialog>
    <!-- secondary -->
    <VDialog
      max-width="900"
      v-model="dialogSecondary"
      scrollable
      transition="dialog-transition"
    >
      <secondary
        :eduId="eduId"
        :classId="oldClassId"
        :newStudentId="newStudentId"
        :newStudentName="newStudentName"
      />
    </VDialog>
    <!-- upper -->
    <VDialog
      max-width="900"
      v-model="dialogHigh"
      scrollable
      transition="dialog-transition"
    >
      <upper
        :eduId="eduId"
        :classId="oldClassId"
        :newStudentId="newStudentId"
        :newStudentName="newStudentName"
      />
    </VDialog>
  </div>
</template>
<style scoped>
.my-custom-table {
  text-overflow: ellipsis;
  white-space: nowrap;
}
.v-btn__overlay {
  background-color: red;
}

.sticky-header {
  position: sticky;
  left: 0;
  z-index: 10;
  background: white;
}
</style>
