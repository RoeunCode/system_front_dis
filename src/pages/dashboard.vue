<script setup>
import axios, { all } from "axios";
import { ref, onMounted, watch } from "vue";
import { computed } from "vue";
import { api } from "@/utils/axios";
import { useRoute, useRouter } from "vue-router";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Toast from "@/helper";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const user_role_id = ref(parseInt(user.value.role_id));
const teacherId = ref(parseInt(user.value.teacher_id));

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const router = useRouter();

const pdfPrint = () => {
  let dd = {
    pageSize: { width: 600, height: 600 },
    content: [
      // Content is required
      "Your PDF content goes here",
    ],
  };
  // Create and open the PDF inside the function
  pdfMake.createPdf(dd).open();
};

const allStu = ref("");
const studentStop = ref("");
const classroom = ref("");
const teacher = ref("");

const isloading = ref(false);

const getData = async () => {
  isloading.value = true;
  try {
    await api
      .post("/dashboard", {
        campus_id: campus_id.value, // Pass campus_id
      })
      .then((res) => {
        teacher.value = res.data.teacher;
        classroom.value = res.data.classroom;
        studentStop.value = res.data.studentStop;
        allStu.value = res.data.allStudent;
      });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: error,
    });
  } finally {
    isloading.value = false;
  }
};

const debouncedGetData = debounce(getData, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetData();
  },
  { immediate: true }
);

const detail = computed(() => [
  {
    name: "សិស្សទាំងអស់",
    amount: allStu.value,
    icon: "mdi-account-school",
    link: "StudentList",
  },
  {
    name: "សិស្សឈប់រៀន",
    amount: studentStop.value,
    icon: "mdi-account-school",
    link: "StudentDelete",
  },
  {
    name: "គ្រូទាំងអស់",
    amount: teacher.value,
    icon: "mdi-human-male-board",
    link: "TeacherList",
  },
  {
    name: "ថ្នាក់រៀន",
    icon: "mdi-home",
    amount: classroom.value,
    link: "ClassroomList",
  },
]);

const routeClick = (route) => {
  router.push({ name: route });
};

onMounted(() => {
  if (teacherId.value) {
    router.push("score");
  }
});
</script>
<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="3"
        sm="6"
        class="mt-5"
        v-for="d in detail"
        :key="d.name"
      >
        <v-card elevation="0" class="border" @click="routeClick(d.link)">
          <v-row>
            <v-col>
              <v-card-title class="customKhmerMoul text-green-darken-4">
                {{ d.name }}
              </v-card-title>
              <v-card-text>
                <v-progress-circular
                  v-if="isloading"
                  color="green-darken-4"
                  indeterminate
                ></v-progress-circular>
                <div v-else class="text-h5 d-flex align-center">
                  {{ d.amount }}
                </div>
              </v-card-text>
            </v-col>
            <v-col class="d-flex justify-center align-center">
              <v-icon size="40" color="green-darken-4">{{ d.icon }}</v-icon>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <VCardText> </VCardText>
  </div>
</template>
