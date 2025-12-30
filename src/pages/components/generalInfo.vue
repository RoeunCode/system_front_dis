<script setup>
import { onMounted, ref } from "vue";
import Schedule from "@/pages/components/schedule.vue";
import TeacherInClass from "@/pages/components/teacherInClass.vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import { watch } from "vue";

const subjects = ref([]);
const allSubject = async () => {
  try {
    await api.post("/get_all_subject").then((res) => {
      subjects.value = res.data;
      console.log("dataaaaaaaa", res.data);
    });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  }
};
const classroomInfo = ref([]);
const props = defineProps({
  classroomInfo: {
    type: Array,
    required: true,
  },
});

watch(
  () => props.classroomInfo,
  (newVal) => {
    classroomInfo.value = newVal;
  },
  { immediate: true }
);

onMounted(() => {
  allSubject();
});
</script>
<template>
  <div>
    <schedule :subjects="subjects" />
    <TeacherInClass :subjects="subjects" :classroomInfo="classroomInfo" />
  </div>
</template>
