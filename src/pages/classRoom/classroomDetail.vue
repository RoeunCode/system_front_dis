<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { api } from "@/utils/axios";

import studentClassList from "../components/studentClassList.vue";
import GeneralInfo from "@/pages/components/generalInfo.vue";
import Toast from "@/helper";
const router = useRouter();

const route = useRoute();

const store = useStore();

const data = ref();

const total_students = ref();

const female_students = ref();

const classroomInfo = ref();

const no = ref([]);

const isAlert = ref(true);

const currentTab = ref("student");

const routeClick = (routeName) => {
  if (routeName) {
    router.push({ name: routeName });
  }
};

// const getStudentClass = async () => {
//   try {
//     await store.get_student_class(route.params.id);
//     data.value = store.studentClass;
//     total_students.value = store.total_students;
//     female_students.value = store.female_students;
//     console.log("datas", data.value);
//   } catch (error) {}
// };

const getStudentClass = async () => {
  isAlert.value = true;
  try {
    await api.post(`/get_one_student_class/${route.params.id}`).then((res) => {
      (data.value = res.data.students),
        (total_students.value = res.data.total_students);
      female_students.value = res.data.female_students;
      classroomInfo.value = res.data.classInfo;
      console.log("classsssss", classroomInfo.value);
    });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
    isAlert.value = false;
  } finally {
    isAlert.value = false;
  }
};

onMounted(() => {
  getStudentClass();
});
</script>
<template>
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
  <div v-else>
    <div v-if="data">
      <v-row>
        <v-col cols="12" md="12" sm="12">
          <div class="d-flex align-center">
            <v-btn
              elevation="0"
              variant="flat"
              class="mb-2 customFont"
              style="font-size: 14px"
              prepend-icon="mdi-arrow-left"
              @click="routeClick('ClassroomList')"
              >ត្រលប់ក្រោយ</v-btn
            >
            <p
              class="customFont"
              style="font-size: 16px; margin-bottom: 10px; font-weight: 500"
            >
              | ថ្នាក់ទី {{ classroomInfo[0].grade_name }}
            </p>
          </div>

          <VCard elevation="0" class="border">
            <VTabs
              v-model="currentTab"
              class="bg-grey-lighten-5 border"
              color="green-darken-4"
            >
              <VTab class="customFont" :active-class="'active-tab'"
                >ព័ត៌មានទូទៅ</VTab
              >
              <VTab class="customFont" :active-class="'active-tab'"
                >សិស្សក្នុងថ្នាក់</VTab
              >
              <!-- <VTab class="customFont" :active-class="'active-tab'"
              >វត្តមានសិស្ស</VTab
            > -->
            </VTabs>

            <VCardText>
              <VWindow v-model="currentTab">
                <VWindowItem value="generalInfo">
                  <GeneralInfo :classroomInfo="classroomInfo" />
                </VWindowItem>

                <!-- Subjects by Grade Tab -->
                <VWindowItem value="student">
                  <studentClassList :classroomInfo="classroomInfo" />
                </VWindowItem>
              </VWindow>
            </VCardText>
          </VCard>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<style scoped>
.active-tab {
  background-color: green !important;
  color: rgb(210, 18, 18) !important;
}
</style>
