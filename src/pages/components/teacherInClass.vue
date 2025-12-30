<script setup>
import { onMounted, ref } from "vue";

import { watch } from "vue";

import Toast from "@/helper";

import { api } from "@/utils/axios";

import Swal from "sweetalert2";

import { useRoute } from "vue-router";

import { useStore } from "@/store/index";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const teachersClass = ref([]);

const store = useStore();

const isAddLoading = ref(false);

const isDialogVisible = ref(false);

const route = useRoute();

const dataClass = ref([]);

const images = (img) => {
  return "https://iconic.disreportcard.com/storage/" + img;
};

const props = defineProps({
  subjects: {
    type: Array,
    required: true,
  },
  classroomInfo: {
    type: Array,
    required: true,
  },
});

watch(
  () => props.classroomInfo,
  (newVal) => {
    dataClass.value = newVal;
  },
  { immediate: true }
);

const form = ref({
  id: null,
  classId: dataClass.value[0].classId,
  teacherId: "",
  subjectId: "",
  role: "notClassLoad",
  campus_id: null,
});

const resetForm = () => {
  form.value = {
    classId: dataClass.value[0].classId,
    teacherId: "",
    subjectId: "",
    role: "notClassLoad",
    campus_id: null,
  };
};

watch(
  () => form.value.teacherId,
  (newVal) => {
    const findTeacher = teachers.value.find((t) => t.id == newVal);

    if (findTeacher) {
      form.value.campus_id = findTeacher.campus_id;
    }
  }
);

const teachers = ref([]);

const getTeacher = async () => {
  try {
    await api
      .post("/get_all_teacher", {
        campus_id: campus_id.value, // Pass campus_id
      })
      .then((res) => {
        teachers.value = res.data;
        console.log(teachers.value);
      });
  } catch (error) {
    console.log(error);
  }
};

const editTeacherClass = async (id) => {
  try {
    await api.post(`/getOneTeacherClass/${id}`).then((res) => {
      form.value = res.data;
      isDialogVisible.value = true;
    });
  } catch (error) {
    console.log(error);
  }
};

const subjects = ref([]);
const getSubject = async () => {
  watch(
    () => props.subjects,
    (newVal) => {
      subjects.value = newVal;
      console.log("teacher", newVal);
    },
    { immediate: true }
  );
};

const handleAdd = async () => {
  isAddLoading.value = true;
  try {
    await api
      .post("/addTeacherToClass", form.value, {
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
    console.log(error);
  } finally {
    isAddLoading.value = false;
    resetForm();
    isDialogVisible.value = false;
    getTeacherInClass();
  }
};

const handleUpdate = async () => {
  isAddLoading.value = true;
  try {
    await api
      .post("/updateTeacherClass", form.value, {
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
  } finally {
    isAddLoading.value = false;
    resetForm();
    isDialogVisible.value = false;
    getTeacherInClass();
  }
};

const submit = () => {
  if (form.value.id) {
    handleUpdate();
  } else {
    handleAdd();
  }
};

const getTeacherInClass = async () => {
  try {
    await api.post(`/getTeacherInClass/${route.params.id}`).then((res) => {
      teachersClass.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteTeacherFromClass = async (id) => {
  try {
    Swal.fire({
      title: "តើអ្នកប្រាកដដែរឬទេថាចង់លុប?",
      text: "បើលុបហើយមិនអាចត្រលប់មកវិញទេ",
      showCancelButton: true,
      confirmButtonColor: "#ED5E68",
      cancelButtonColor: "#8388A4",
      confirmButtonText: "បាទ/ចា៎",
      cancelButtonText: "បោះបង់",
      customClass: {
        popup: "colored-toast custom-delete-swal-title",
        cancelButton: "custom-swal-cancel-button",
        confirmButton: "custom-swal-confirm-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post(`/deleteTeacherFromClass/${id}`);
        } catch (error) {
          Toast.fire({
            title: error.response.data.message,
            icon: "error",
          });
        } finally {
          getTeacherInClass();
        }
      }
    });
  } catch (error) {}
};

const debouncedGetTeacher = debounce(getTeacher, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetTeacher();
  },
  { immediate: true }
);

onMounted(() => {
  getTeacherInClass();
  getSubject();
  // getTeacher();
});
</script>
<template>
  <div class="customFont mt-5">
    <div class="d-flex align-center">
      <p style="font-size: 16px">គ្រូ និងមុខវិជ្ជា</p>
      <v-spacer></v-spacer>
      <VBtn
        prepend-icon="mdi-plus"
        class="py-0"
        variant="tonal"
        color="green"
        @click="isDialogVisible = !isDialogVisible"
      >
        បន្ថែមគ្រូ និងមុខវិជ្ជា
      </VBtn>
    </div>
    <VRow class="mt-2">
      <VCol
        cols="12"
        md="4"
        sm="6"
        v-for="item in teachersClass"
        :key="item.id"
      >
        <v-card class="d-flex align-center pa-2 border" elevation="0">
          <div class="d-flex ga-2 align-center">
            <div>
              <v-img
                v-if="item.photo_path"
                :src="images(item.photo_path)"
                width="50"
                height="60"
              ></v-img>
              <v-img
                v-else
                src="https://st4.depositphotos.com/9998432/24428/v/450/depositphotos_244284796-stock-illustration-person-gray-photo-placeholder-man.jpg"
                width="50"
                height="60"
              ></v-img>
            </div>
            <div style="font-size: 12px">
              <p>
                ឈ្មោះ ៈ <span class="font-weight-bold">{{ item.kh_name }}</span>
              </p>
              <p>
                មុខវិជ្ជា ៈ
                <span class="font-weight-bold">{{ item.subject_name }}</span>
              </p>
              <p>
                លេខទូរស័ព្ទ ៈ
                <span class="font-weight-bold">{{ item.phone }}</span>
              </p>
            </div>
          </div>
          <v-spacer></v-spacer>
          <div v-if="item.role === 'classLoad'" class="pa-1 border text-green">
            គ្រូបន្ទុកថ្នាក់
          </div>
          <v-spacer></v-spacer>
          <div class="d-flex">
            <v-btn
              class="text-warning mr-1"
              icon="mdi-pen"
              size="sm"
              flat
              @click="editTeacherClass(item.id)"
            ></v-btn>
            <v-btn
              class="text-error"
              icon="mdi-delete"
              size="sm"
              flat
              @click="deleteTeacherFromClass(item.id)"
            ></v-btn>
          </div>
        </v-card>
      </VCol>
    </VRow>

    <div>
      <VDialog v-model="isDialogVisible" max-width="400" class="customFont">
        <!-- Dialog Content -->
        <VCard>
          <VCardTitle class="text-center bg-green-darken-4"
            >ព័ត៌មានគ្រូបង្រៀន</VCardTitle
          >
          <VCardText class="mt-5">
            <VTextField
              :v-model:search="search"
              label="ថ្នាក់ទី"
              variant="outlined"
              density="compact"
              readonly
              v-model="dataClass[0].grade_name"
            />
            <VAutocomplete
              v-model="form.teacherId"
              :items="teachers"
              item-title="kh_name"
              item-value="id"
              label="ឈ្មោះគ្រូបង្រៀន"
              variant="outlined"
              density="compact"
              clearable
            />
            <VSelect
              label="មុខវិជ្ជា"
              :items="subjects"
              item-title="subject_name"
              item-value="id"
              variant="outlined"
              density="compact"
              v-model="form.subjectId"
            />

            <v-radio-group inline label="តួនាទី" v-model="form.role">
              <v-radio
                color="green-darken-4"
                label="បន្ទុកថ្នាក់"
                value="classLoad"
                :class="form.role === 'classLoad' ? 'text-green' : ''"
              ></v-radio>
              <v-radio
                color="green-darken-4"
                :class="form.role === 'notClassLoad' ? 'text-green' : ''"
                label="មិនមែនបន្ទុកថ្នាក់"
                value="notClassLoad"
              ></v-radio>
            </v-radio-group>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap ga-3">
            <VBtn variant="tonal" color="red" @click="isDialogVisible = false">
              បិទ
            </VBtn>
            <VBtn
              :loading="isAddLoading"
              variant="tonal"
              color="green"
              @click="submit"
            >
              រក្សាទុក
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </div>
  </div>
</template>
