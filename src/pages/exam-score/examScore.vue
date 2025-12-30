<script setup>
import { onMounted, computed, ref, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { api } from "@/utils/axios";
import Swal from "sweetalert2";

import HighSchoolScore from "@/pages/components/highSchoolScore.vue";
import Secondary from "@/pages/components/secondaryScore.vue";
import PrimaryScore from "../components/primaryScore.vue";
import Toast from "@/helper";

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const user_role_id = ref(parseInt(user.value.role_id));

const teacherId = ref(parseInt(user.value.teacher_id));

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const studentHabitGrade = ref([
  { name: "ល្អប្រសើរ" },
  { name: "ល្អ" },
  { name: "មធ្យម" },
  { name: "ត្រូវការអភិវឌ្ឍន៍បន្ថែម" },
]);

const statusHabit = ref();

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const isSearch = ref(true);
const isBtnSearch = ref(false);

const textApprove = ref("មិនទាន់អនុញ្ញាតិ");
const status = ref("");

const checkLoading = ref(true);

const avg_m = ref("");

const isPrimary = ref(false);
const isSecondary = ref(false);
const isHighschool = ref(false);

const students_scores = ref([]);

const level = ref("");

const isloading = ref(false);

const checkAdd = ref(false);

const isloadingAdd = ref(false);

const isApprove = ref(null);

const formSearch = ref({
  edu_id: "",
  class_id: "",
  year_id: "",
  month_id: "",
  level: "",
});

const classroomFilter = ref([]);

const checkYear = ref(false);

const classInYear = ref([]);

const tabSearch = ref(false);

const teacherRole = ref(null);

// watch(() => formSearch.value.class_id, (newV) => {

// })

watch(
  [() => formSearch.value.edu_id, () => formSearch.value.year_id],
  ([newEduId, newYearId]) => {
    // Filter classes by year if year_id changes
    if (newYearId) {
      classInYear.value = classrooms.value?.filter(
        (c) => c.year_id == newYearId
      );

      console.log("newYearId", classInYear.value);

      checkYear.value = true;
    }

    console.log("classInyear", classInYear.value);

    // Filter classrooms by edu_id and reset class_id
    if (newEduId) {
      classroomFilter.value = classInYear.value?.filter(
        (c) => c.education_id == newEduId
      );

      console.log("classroomfilter", classroomFilter.value);
      formSearch.value.class_id = null;
    }
  }
);

const classrooms = ref([]);

const get_classroom = async () => {
  try {
    await api
      .post("/get_all_classroom", {
        campus_id: campus_id.value,
      })
      .then((res) => {
        classrooms.value = res.data.filter((c) => c.deleted != 1);
        console.log("class", classrooms.value);
      });
  } catch (error) {
    console.log(error);
  }
};

const getClassroomHaveTeacher = async () => {
  try {
    await api
      .post("/getClassHaveTeacher", {
        campus_id: campus_id.value,
        teacherId: teacherId.value,
      })
      .then((res) => {
        classrooms.value = res.data;
      });
  } catch (error) {
    console.log(error);
  }
};

const debouncedGetClassroomHaveTeacher = debounce(getClassroomHaveTeacher, 300);
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
    isSearch.value = true;
    isPrimary.value = false;
    isSecondary.value = false;
    isHighschool.value = false;
    students_scores.value = null;
    isBtnSearch.value = false;
    checkAdd.value = false;
    if (user_role_id.value == 4) {
      debouncedGetClassroomHaveTeacher();
      console.log("hello getClass teacher");
    } else {
      debouncedGetClassroom();
      console.log("hello getClass");
    }
  },
  { immediate: true }
);

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
    checkLoading.value = false;
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

const student_habits = ref([]);

const findStudentHabit = async () => {
  try {
    await api
      .post("showStudentHabbit", formSearch.value, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        student_habits.value = res.data.student_class;
        statusHabit.value = res.data.status;
      });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
    console.log(error);
  }
};

watch(
  () => formSearch.value.class_id,
  (newVal) => {
    const foundClass = classroomFilter?.value?.find((e) => e.id == newVal);
    // console.log("foundclass", foundClass);
    if (foundClass) {
      formSearch.value.level = foundClass.level;
      teacherRole.value = foundClass.teacherRole;

      console.log("teacherRole", teacherRole.value);
      console.log("teacherabc", foundClass);
    } else {
      formSearch.value.level = "";
    }
    console.log("level", formSearch.value.level);
  },
  { immediate: true }
);

const alertMessage = ref();

const addScore = async () => {
  isBtnSearch.value = false;
  isSearch.value = true;
  isloadingAdd.value = true;

  const data = {
    ...students_scores.value,
    edu_id: formSearch.value.edu_id,
    status: status.value,
    class_id: formSearch.value.class_id,
    month_id: formSearch.value.month_id,
    avg_m: avg_m.value,
    approve: isApprove.value,
    role_id: user_role_id.value,
  };

  console.log("Data", data);

  Object.keys(data).forEach((key) => {
    if (isNaN(key)) return; // Skip non-numeric keys like class_id, edu_id, etc.
    data[key] = {
      ...data[key],
      month_id: formSearch.value.month_id, // Assign month_id to each student object
      avg_m: avg_m.value,
    };
  });

  try {
    await api
      .post("/add_student_score", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.isAlert == "avg_m") {
          Toast.fire({
            title: res.data.message,
            icon: "error",
          });
        } else if (res.data.status == 1) {
          Toast.fire({
            title: res.data.message,
            icon: "error",
          });
        } else {
          Toast.fire({
            title: res.data.message,
            icon: "success",
          });
        }
      });

    if (!validateForm()) {
      return; // Stop if invalid
    }
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloadingAdd.value = false;
    if (isloading.value == false) {
      isPrimary.value = false;
      isSecondary.value = false;
      isHighschool.value = false;
      checkAdd.value = false;
    }
  }
};

const isFind = () => {
  isSearch.value = true;
  isBtnSearch.value = false;
};

const validateAvg = ref(null);

// let isReseting = false;

watch(avg_m, (newVal) => {
  if (newVal && validateAvg.value) {
    validateAvg.value = null;
  }
});

const validateForm = () => {
  if (!avg_m.value) {
    validateAvg.value = "សូមបញ្ចូលតួចែក";
    return false;
  }
  return true;
};

const deleteRecordScore = async (id) => {
  let data = {
    id: id,
    edu_id: formSearch.value.edu_id,
  };
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
        await api.post("/deleteRecord", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        findInfo();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const loadingStudentHabit = ref(false);

const addStudentHabit = async () => {
  loadingStudentHabit.value = true;
  const data = {
    ...student_habits.value,
    status: statusHabit.value,
    class_id: formSearch.value.class_id,
    month_id: formSearch.value.month_id,
  };

  Object.keys(data).forEach((key) => {
    if (isNaN(key)) return; // Skip non-numeric keys like class_id, edu_id, etc.
    data[key] = {
      ...data[key],
      month_id: formSearch.value.month_id, // Assign month_id to each student object
    };
  });

  try {
    await api
      .post("/saveStudentHabit", data, {
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
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    loadingStudentHabit.value = false;
    student_habits.value = null;
  }

  console.log(data);
};

const currentTab = ref("score");

const filterSubject = ref({
  teacherId: teacherId.value,
  classId: "",
});

watch(
  () => formSearch.value.class_id,
  (n) => {
    filterSubject.value.classId = n;
  }
);

const subject = ref([]);

const isSubject = ref(false);

const getSubject = async () => {
  console.log("filter", filterSubject.value);
  isSubject.value = true;
  try {
    await api.post("/getSubjectFilter", filterSubject.value).then((res) => {
      subject.value = res.data;
    });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isSubject.value = false;
  }
};

const findInfo = async () => {
  isloading.value = true;
  isHighschool.value = false;
  isPrimary.value = false;
  isSecondary.value = false;
  alertMessage.value = null;

  try {
    await api
      .post("/showstudent", formSearch.value, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        students_scores.value = res.data.student_class;

        isApprove.value = students_scores.value[0].approved;

        if (students_scores.value[0].approved == 1) {
          textApprove.value = "អនុញ្ញាតិ";
        } else {
          textApprove.value = "មិនទាន់អនុញ្ញាតិ";
        }

        // console.log("StudentScoreValue", students_scores.value);

        status.value = res.data.status;
        avg_m.value = res.data.avg_m;
        level.value = res.data.level;
        findStudentHabit();
        getSubject();
      });
  } catch (error) {
    console.log(error);
  } finally {
    isloading.value = false;
    if (students_scores.value.length > 0) {
      if (formSearch.value.edu_id === 1) {
        isPrimary.value = true;
      } else if (formSearch.value.edu_id === 2) {
        isSecondary.value = true;
        isPrimary.value = false;
        isHighschool.value = false;
      } else if (formSearch.value.edu_id === 3) {
        isHighschool.value = true;
        isSecondary.value = false;
      }
      checkAdd.value = true;
      isSearch.value = false;
      isBtnSearch.value = true;
      tabSearch.value = true;
    } else {
      alertMessage.value = "មិនមានសិស្សសម្រាប់ធ្វើការបញ្ចូលពិន្ទុទេ";
      checkAdd.value = false;
      isSearch.value = true;
      isBtnSearch.value = false;
    }
  }
};

const approveScore = async () => {
  isBtnSearch.value = false;
  isSearch.value = true;

  const data = {
    // ...students_scores.value,
    edu_id: formSearch.value.edu_id,
    status: status.value,
    class_id: formSearch.value.class_id,
    month_id: formSearch.value.month_id,
  };

  // Object.keys(data).forEach((key) => {
  //   if (isNaN(key)) return; // Skip non-numeric keys like class_id, edu_id, etc.
  //   data[key] = {
  //     ...data[key],
  //     month_id: formSearch.value.month_id, // Assign month_id to
  //   };
  // });

  try {
    await api
      .post("/approveScore", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.status == 200 || res.data.message == "200") {
          Toast.fire({
            title: res.data.message,
            icon: "success",
          });

          textApprove.value = "អនុញ្ញាតិ";
        }
      });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isPrimary.value = false;
    isHighschool.value = false;
    isSecondary.value = false;
    checkAdd.value = false;
    tabSearch.value = false;
  }
};

const hasPrimarySubject = computed(() => {
  return subject.value.some((item) => item.subject_name.includes("បឋមសិក្សា"));
});

watch(
  () => formSearch.value.month_id,
  (newVal) => {
    if (newVal) {
      findInfo();
    }
  }
);

watch(
  () => formSearch.value.class_id,
  (newVal) => {
    if (formSearch.value.month_id && newVal) {
      findInfo();
    }
  }
);

onMounted(() => {
  get_year();
  getEdu();
  // get_classroom();
  get_month();
});
</script>
<template>
  <div>
    <div
      v-if="checkLoading"
      class="d-flex justify-center flex-column align-center"
      style="margin-top: 300px"
    >
      <v-progress-circular
        color="green-darken-4"
        indeterminate
      ></v-progress-circular>
      <p class="customFont mt-2">សូមរងចាំ</p>
    </div>

    <v-row v-else>
      <v-col cols="12" md="12" sm="12">
        <v-card elevation="0" class="border">
          <v-card-title
            class="customKhmerMoul text-green-darken-4 bg-grey-lighten-4 py-4 text-center"
          >
            បញ្ចូលពិន្ទុសិស្ស
          </v-card-title>

          <VBtn
            prepend-icon="mdi-magnify"
            v-if="isBtnSearch"
            @click="isFind"
            color="success"
            class="customFont mt-3 ml-3"
            variant="tonal"
            >ស្វែងរកថ្នាក់</VBtn
          >

          <VBtn
            prepend-icon="mdi-check-all"
            v-if="isBtnSearch && user_role_id != 4"
            @click="approveScore"
            :color="textApprove == 'អនុញ្ញាតិ' ? 'green' : 'orange'"
            class="customFont mt-3 ml-3"
            variant="tonal"
          >
            {{ textApprove }}
          </VBtn>

          <div class="mt-3" v-if="isSearch">
            <v-col cols="" md="3" sm="6" class="d-flex ga-2">
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

            <v-col cols="12" md="6" v-if="checkYear">
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
                    variant="tonal"
                    color="green"
                    class="customFont"
                    @click="findInfo"
                    :loading="isloading"
                    :disabled="isloading"
                    >ស្វែងរក</v-btn
                  >
                </VCol>
              </VRow>
            </v-col>
          </div>

          <div style="margin-top: 10px; margin-bottom: 20px">
            <VTabs
              grow
              stacked
              v-if="tabSearch"
              v-model="currentTab"
              class="bg-grey-lighten-5 border v-tabs--fixed"
              color="green-darken-4"
            >
              <VTab class="customFont" :active-class="'active-tab'"
                >តារាងបញ្ចូលពិន្ទុ</VTab
              >
              <VTab
                v-if="
                  teacherRole == 'classLoad' ||
                  teacherRole === 'classLoad' ||
                  user_role_id != 4
                "
                class="customFont"
                :active-class="'active-tab'"
                >តារាងទម្លាប់សិក្សា</VTab
              >
            </VTabs>
          </div>

          <div
            class="d-flex justify-center flex-column align-center"
            style="margin-top: 100px"
            v-if="isSubject"
          >
            <v-progress-circular
              color="green-darken-4"
              indeterminate
            ></v-progress-circular>
            <p class="customFont mt-2">សូមរងចាំ</p>
          </div>

          <!-- primary -->
          <VCardText style="margin-top: -10px" v-else>
            <div v-if="alertMessage" class="text-center text-body-2 text-red">
              <p class="customFont">{{ alertMessage }}</p>
            </div>
            <VWindow
              v-model="currentTab"
              class="disable-tab-transition"
              :touch="false"
            >
              <VWindowItem value="score">
                <PrimaryScore
                  v-if="isPrimary"
                  :students_scores="students_scores"
                  :level="level"
                  :subject="subject"
                  @deleteRecord="deleteRecordScore"
                />
                <Secondary
                  v-if="isSecondary"
                  :students_scores="students_scores"
                  :level="level"
                  :subject="subject"
                  @deleteRecord="deleteRecordScore"
                />
                <HighSchoolScore
                  v-if="isHighschool"
                  :students_scores="students_scores"
                  :level="level"
                  :subject="subject"
                  @deleteRecord="deleteRecordScore"
                />

                <div class="d-flex ga-3 justify-end mt-4" v-if="checkAdd">
                  <!-- v-if="isSecondary || isHighschool" -->
                  <div style="width: 200px">
                    <VTextField
                      v-if="hasPrimarySubject || user_role_id != 4"
                      class="customFont"
                      density="compact"
                      label="បញ្ចូលតួចែក"
                      variant="outlined"
                      v-model="avg_m"
                    />
                    <p
                      class="text-red ml-3 customFont"
                      style="margin-top: -20px"
                      v-if="validateAvg"
                    >
                      {{ validateAvg }}
                    </p>
                  </div>
                  <v-btn
                    :loading="isloadingAdd"
                    :disabled="isloadingAdd"
                    variant="tonal"
                    class="customFont"
                    color="green"
                    @click="addScore"
                    >បញ្ចូលពិន្ទុ</v-btn
                  >
                </div>
              </VWindowItem>

              <VWindowItem
                v-if="teacherRole == 'classLoad' || user_role_id != 4"
                value="studentHabit"
              >
                <v-table
                  v-if="student_habits"
                  fixed-header
                  height="460"
                  class="customFont border border-2 border-black table"
                  style="width: 100%; font-size: 12px"
                >
                  <thead class="my-custom-table">
                    <tr>
                      <th
                        style="height: 30px; width: 18%"
                        class="text-center bg-green-lighten-4 px-1 py-3"
                      >
                        ឈ្មោះសិស្ស
                      </th>
                      <th
                        style="height: 0px; width: 3%"
                        class="text-center bg-green-lighten-4 pa-0"
                      >
                        ភេទ
                      </th>
                      <th
                        style="height: 0px"
                        class="text-center bg-green-lighten-4 pa-0"
                      >
                        គោរពវិន័យសាលា និង បុគ្គលិកសាលា
                      </th>
                      <th
                        style="height: 0px"
                        class="text-center bg-green-lighten-4 pa-0"
                      >
                        យកចិត្តទុកដាក់ក្នុងការសិក្សា
                      </th>
                      <th
                        style="height: 0px"
                        class="text-center bg-green-lighten-4 pa-0"
                      >
                        ធ្វើកិច្ចការស្អាតនិងមានសណ្ដាប់ធ្នាប់
                      </th>
                      <th
                        style="height: 0px"
                        class="text-center bg-green-lighten-4 pa-0"
                      >
                        ធ្វើកិច្ចការដោយខ្លួនឯង
                      </th>
                      <th
                        style="height: 0px"
                        class="text-center bg-green-lighten-4 pa-0"
                      >
                        មានភាពសិ្នតស្នាលជាមួយអ្នកដទៃ
                      </th>
                      <th
                        style="height: 0px"
                        class="text-center bg-green-lighten-4 pa-0"
                      >
                        គោរពទ្រព្យសាធារណៈនិង ឯកជន
                      </th>
                    </tr>
                  </thead>

                  <tbody class="customFont">
                    <tr v-for="(item, idx) in student_habits" :key="idx">
                      <td>
                        {{ item.kh_name }}
                      </td>
                      <td class="customFont pa-0 text-center" style="height: 0">
                        <p v-if="item.gender == 1 || item.gender == 'M'">
                          ប្រុស
                        </p>
                        <p v-else-if="item.gender == 2 || item.gender == 'F'">
                          ស្រី
                        </p>
                      </td>
                      <td class="customFont pa-1 text-center" style="height: 0">
                        <VSelect
                          hide-details
                          :items="studentHabitGrade"
                          item-value="name"
                          item-title="name"
                          class="customFont"
                          density="compact"
                          variant="outlined"
                          v-model="item.respects_school"
                        />
                      </td>
                      <td class="customFont pa-1 text-center" style="height: 0">
                        <VSelect
                          hide-details
                          :items="studentHabitGrade"
                          item-value="name"
                          item-title="name"
                          class="customFont"
                          density="compact"
                          variant="outlined"
                          v-model="item.pay_attention"
                        />
                      </td>
                      <td class="customFont pa-1 text-center" style="height: 0">
                        <VSelect
                          hide-details
                          :items="studentHabitGrade"
                          item-value="name"
                          item-title="name"
                          class="customFont"
                          density="compact"
                          variant="outlined"
                          v-model="item.neat_and_tidy"
                        />
                      </td>
                      <td class="customFont pa-1 text-center" style="height: 0">
                        <VSelect
                          hide-details
                          :items="studentHabitGrade"
                          item-value="name"
                          item-title="name"
                          class="customFont"
                          density="compact"
                          variant="outlined"
                          v-model="item.work"
                        />
                      </td>
                      <td class="customFont pa-1 text-center" style="height: 0">
                        <VSelect
                          hide-details
                          :items="studentHabitGrade"
                          item-value="name"
                          item-title="name"
                          class="customFont"
                          density="compact"
                          variant="outlined"
                          v-model="item.get_along_with_other"
                        />
                      </td>
                      <td class="customFont pa-1 text-center" style="height: 0">
                        <VSelect
                          hide-details
                          :items="studentHabitGrade"
                          item-value="name"
                          item-title="name"
                          class="customFont"
                          density="compact"
                          variant="outlined"
                          v-model="item.take_care"
                        />
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                <div class="d-flex justify-end mt-2">
                  <VBtn
                    v-if="student_habits"
                    :loading="loadingStudentHabit"
                    :disabled="loadingStudentHabit"
                    variant="tonal"
                    color="green customFont"
                    @click="addStudentHabit"
                    >បញ្ជូន</VBtn
                  >
                </div>
              </VWindowItem>
            </VWindow>
          </VCardText>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped>
.my-custom-table {
  text-overflow: ellipsis;
  white-space: nowrap;
}

table,
th {
  border: 1px solid grey;
}

table,
td {
  border: 1px solid grey;
  border-collapse: collapse;
}

/* Ensure content area handles scrolling correctly */
.v-window__container {
  max-height: calc(100vh - 150px); /* Adjust based on your layout */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on touch devices */
}

/* Prevent VWindow from intercepting scroll events */
.v-window {
  overflow: hidden !important;
}
</style>
