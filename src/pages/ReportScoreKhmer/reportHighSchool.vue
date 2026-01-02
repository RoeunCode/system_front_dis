<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import dis from "@/assets/img/DIS.png";
import { Printd } from "printd";
import Border from "@/assets/img/border3.jpg";
import Background from "@/assets/img/background.jpg";
import ReportPrimaryWithImage from "../components/reportPrimaryWithImage.vue";
import ReportTopOchar from "../components/reportTopOchar.vue";
import domtoimage from "dom-to-image";
import ResultPrimaryVue from "../components/resultPrimary.vue";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const currentTab = ref("list");

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const khmerDate = ref("");
const date = ref("");
const printing = () => {
  const printd = new Printd();
  const element = document.getElementById("printImg");
  const styles = [
    "https://cdn.jsdelivr.net/npm/vuetify@3.x/dist/vuetify.min.css",
    "https://fonts.googleapis.com/css2?family=Angkor&family=Battambang:wght@100;300;400;700;900&family=Moul&family=Moulpali&family=Siemreap&display=swap",
    `
      * { margin: 0; }

      .moulNumber {
        font-family: "Moul", serif;
        font-size: 20px;
      }

      .moulName {
        font-family: "Moul", serif;
        font-size: 13px;
        background-color: green;
        color: white;
        padding: 1px 30px;
        border-radius: 4px;
      }

      .grade {
        color: green;
        font-family: "Moul", serif;
        font-size: 15px;
        margin-top: -30px;
      }
      .avartar {
        width: 120px;
        height: 190px;
        border: solid green;
        background-color: green !important;
      }

      @media print {
        .main {
          margin-top: 330px;
        }
        #printImg {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
      }

      .sinature {
    position: absolute;
    transform: translate(-6%,40%);
    width:50%;
  }
  .header1{
  margin-top:-20px;
  width: 75%;
  margin:0 auto;
  
  }

  .date{
    position: absolute;
    transform: translate(-10%,60px);
    font-family: "Battambang", system-ui;
    font-weight: 300;
    font-style: normal;
    z-index:1000;
  }

        

        @page, body {
          margin: 0;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  ];

  printd.print(element, styles);
};

const printTopFive = () => {
  const printd = new Printd();
  const element = document.getElementById("printSection");
  const styles = [
    "https://cdn.jsdelivr.net/npm/vuetify@3.x/dist/vuetify.min.css", // Vuetify CSS
    "https://fonts.googleapis.com/css2?family=Angkor&family=Battambang:wght@100;300;400;700;900&family=Moul&family=Moulpali&family=Siemreap&display=swap",

    ` .header {
         font-family: "Battambang", system-ui;
          font-weight: 400;
          font-style: normal;
      }
          .battambang-thin {
             font-family: "Battambang", system-ui;
             font-weight: 300;
             font-style: normal;
             font-size:15px
             }

             .headerFont{
             font-family: "Moul", serif;
                font-style: normal;
                font-size:25px
             }
            .moul {
              font-family: "Moul", serif;
                font-style: normal;
            }
                .angkor {
  font-family: "Angkor", serif;
  font-weight: 400;
  font-style: normal;
}
                .teacher{
                margin-right:40px;}
               

               table {
                  border-collapse: separate;
                  border-spacing: 0;
                  display: none;


                }
th,td {
  border-top: 1px solid black;
  border-left: 1px solid black;
}
  tr td:last-child {
  border-right: 1px solid black;
}

tr th:last-child {
  border-right: 1px solid black;
}

table tr:last-child td {
  border-bottom: 1px solid black;
}

            @media print {
          @page {
            margin: 0;
          }
          body {
            margin: 0;
          }
        }

        .primary{
              display: block !important;
              margin-top: -37px
              }
        .report_score{
display:none;
}
.grade{
display:none;
}

               
      `,
  ];
  // printd.onBeforePrint(() => (dialog.value = true));
  // printd.onAfterPrint(() => (dialog.value = false));

  printd.print(element, styles);
};

const printStudentScore = () => {
  const printd = new Printd();
  const element = document.getElementById("studentScore");

  const styles = [
    // External stylesheets
    "https://cdn.jsdelivr.net/npm/vuetify@3.x/dist/vuetify.min.css",
    "https://fonts.googleapis.com/css2?family=Battambang:wght@100;300;400;700;900&family=Moul&family=Siemreap&display=swap",

    // Custom styles
    `
    /* Fonts */
    .header {
      font-family: "Battambang", system-ui;
      font-weight: 400;
      font-style: normal;
    }

    .battambang-thin {
      font-family: "Battambang", system-ui;
      font-weight: 300;
      font-style: normal;
      font-size: 15px;
    }

    .moul {
      font-family: "Moul", serif;
      font-style: normal;
    }

    /* Layout helpers */
    .teacher {
      margin-left: 20px;
    }

    .primary {
      display: none;
    }

    /* Table styles */
    table {
      border-collapse: separate;
      border-spacing: 0;
    }

    .vertical-header {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      white-space: nowrap;
      padding: 3px 0;
    }

    th, td {
      border-top: 1px solid black;
      border-left: 1px solid black;
      border-bottom: 1px solid black;
      border-right: none;
    }

    /* Right border for last cell in each row */
    tr td:last-child, 
    tr th:last-child {
      border-right: 1px solid black;
    }

    /* Bottom border for last row */
    table tr:last-child td {
      border-bottom: 1px solid black;
    }

    /* Print styles */
    @media print {
      .subjectRank {
        background-color: #ffccbc !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background-clip: padding-box;
        border-collapse: collapse;
        padding: 0;
      }

      .semesterField {
        background-color: #c8e6c9 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background-clip: padding-box;
        border-collapse: collapse;
        padding: 0;
      }

      .semesterFieldHeader {
        background-color: #81c784 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background-clip: padding-box;
        border-collapse: collapse;
        padding: 0;
      }

      .subjectRankHeader {
        background-color: #ffab91 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background-clip: padding-box;
        border-collapse: collapse;
        padding: 0;
      }

      table, th, td {
        border-collapse: collapse;
      }

      @page {
        margin: 0;
        size: landscape;
      }

      body {
        margin: 0;
      }
    }
    `,
  ];

  printd.print(element, styles);
};

const printContent = () => {
  const printd = new Printd();
  const element = document.getElementById("printSection");
  const styles = [
    "https://cdn.jsdelivr.net/npm/vuetify@3.x/dist/vuetify.min.css", // Vuetify CSS
    "https://fonts.googleapis.com/css2?family=Battambang:wght@100;300;400;700;900&family=Moul&family=Siemreap&display=swap",
    ` .header {
         font-family: "Battambang", system-ui;
          font-weight: 400;
          font-style: normal;
      }
          .battambang-thin {
             font-family: "Battambang", system-ui;
             font-weight: 300;
             font-style: normal;
             font-size:15px
             }
            .moul {
              font-family: "Moul", serif;
              // font-weight: 400;
                font-style: normal;
            }
                .teacher{
                margin-right:40px;}

                .primary{
                display:none;
                }
               table {
  border-collapse: separate;
  border-spacing: 0;

}

// th {
//   border: 3px double black;
// }

// th{
// border: 1px solid black;
// }


th,td {
  border-top: 1px solid black;
  border-left: 1px solid black;
}
  tr td:last-child {
  border-right: 1px solid black;
}

tr th:last-child {
  border-right: 1px solid black;
}

table tr:last-child td {
  border-bottom: 1px solid black;
}

            @media print {
          @page {
            margin: 0;
          }
          body {
            margin: 0;
          }
        }

               
      `,
  ];
  printd.print(element, styles);
};

const checkLoading = ref(true);

const openDailog = ref(false);

const typeMessage = ref("");

const classMessage = ref("");

const monthMessage = ref("");

const yearMessage = ref("");

const checkMonth = ref(false);

const isloading = ref(false);

const yearId = ref("");

const allStudents = ref(null);

const student_female = ref(null);

const checkYear = ref(false);

const classroomFilter = ref([]);

const classrooms = ref([]);

const currentYear = new Date().getFullYear();

const isDownload = ref(false);

const form = ref({
  type: "",
  class_id: null,
  month_id: null,
  edu_id: 3,
  year_id: yearId.value,
  level: null,
  campus_id: campus_id.value,
});

const downloadAsImage = async () => {
  isDownload.value = true;
  const element = document.getElementById("printImg");
  if (!element) {
    console.error("Element #printImg not found.");
    return;
  }
  // រង់ចាំ Khmer font loading
  await document.fonts.ready;
  const style = {
    style: {
      fontFamily: "'Battambang', 'Moul', 'Siemreap', 'Angkor', sans-serif",
    },
  };
  const scale = 2;
  domtoimage
    .toPng(element, {
      quality: 0.9,

      width: element.offsetWidth * scale,
      height: element.offsetHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      },
    })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${transformedClass.value}-${typeMessage.value}${
        monthMessage.value ? `${monthMessage.value}` : ""
      }-${yearMessage.value}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((error) => {
      console.error("Error capturing image:", error);
    })
    .finally(() => {
      isDownload.value = false;
    });
};

const get_classroom = async () => {
  try {
    await api
      .post("/get_all_classroom", {
        campus_id: campus_id.value,
      })
      .then((res) => {
        classrooms.value = res.data.filter(
          (c) => c.deleted != 1 && c.education_id == 3
        );
        console.log(classrooms.value);
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

watch(
  () => yearId.value,
  (newVal) => {
    form.value.year_id = newVal;
    classroomFilter.value = classrooms.value.filter((c) => c.year_id == newVal);
    checkYear.value = true;
    console.log(checkYear.value);

    // if (newVal) {
    //   yearMessage.value = years.value.find((y) => y.id == newVal).name;
    // }
    // console.log(yearMessage.value);
  }
);

watch(
  () => form.value.type,
  (newVal) => {
    if (newVal == "month") {
      checkMonth.value = true;
    } else {
      checkMonth.value = false;
      form.value.month_id = null;
    }
  }
);

// watch level
watch(
  () => form.value.class_id,
  (newVal) => {
    const foundClass = classroomFilter?.value?.find((e) => e.id == newVal);
    if (foundClass) {
      form.value.level = foundClass.level;
    } else {
      form.value.level = "";
    }
    console.log("level", form.value.level);
  },
  { immediate: true }
);

const debouncedGetClassroom = debounce(get_classroom, 300);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    yearId.value = null;
    form.value = {
      type: "",
      class_id: null,
      month_id: null,
      edu_id: 3,
      type: "",
      year_id: yearId.value,
      campus_id: campus_id.value,
    };
    debouncedGetClassroom();
  },
  { immediate: true }
);
// classroomFilter

const topFive = ref([]);

const types = ref([
  {
    nameKh: "ប្រចាំខែ",
    nameEn: "month",
  },
  {
    nameKh: "ប្រចាំឆមាសទី I",
    nameEn: "semester1",
  },
  {
    nameKh: "ប្រចាំឆមាសទី II",
    nameEn: "semester2",
  },
  {
    nameKh: "ប្រចាំឆ្នាំ",
    nameEn: "year",
  },
]);

const reportData = ref([]);

const findInfo = async () => {
  try {
    // print_top_five.value = false;
    // dialog.value = true;
    isloading.value = true;
    openDailog.value = false;
    monthMessage.value = "";
    typeMessage.value = "";
    console.log(form.value);
    await api
      .post("/viewUpper", form.value, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.message == "UnSuccesfully") {
          Toast.fire({
            title: "អត់មានពិន្ទុសម្រាប់ធ្វើការទាញជារបាយការណ៍",
            icon: "info",
          });
        }

        //getStudentScore();

        reportData.value = res.data.data;

        topFive.value = reportData.value.filter(
          (e) => e.rank >= 1 && e.rank <= 5
        );

        monthMessage.value =
          res.data.month?.length > 0 ? res.data.month[0].name_kh : null;
        typeMessage.value = res.data.type;
        classMessage.value =
          res.data.info?.length > 0 ? res.data.info[0].grade_name : null;
        yearMessage.value =
          res.data.info?.length > 0 ? res.data.info[0].name : null;
        allStudents.value = res.data.allStudent;
        student_female.value = res.data.student_female;
      });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
    if (reportData.value.length > 0) {
      openDailog.value = true;
    }

    // setTimeout(() => {
    //   dialog.value = false;
    //   print_top_five.value = true;
    // }, 5000);
  }
};

// const finalReport = computed(() => {
//   return [...reportData.value, ...Array(35 - reportData.value.length).fill({})];
// });

const studentScore = ref([]);

const getStudentScore = async () => {
  try {
    await api
      .post("/showstudent", form.value, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        studentScore.value = res.data.student_class;
        console.log("student_score", res.data.student_class);
      });
  } catch (error) {
    // Toast.fire({
    //   title: error.response.data.message,
    //   icon: "error",
    // });
    console.log("error ss", error);
  }
};

const transformedClass = computed(() => {
  const numberPart = classMessage.value.split(" ")[0];
  const rest = classMessage.value.slice(numberPart.length);
  const khmerDigits = {
    0: "០",
    1: "១",
    2: "២",
    3: "៣",
    4: "៤",
    5: "៥",
    6: "៦",
    7: "៧",
    8: "៨",
    9: "៩",
  };

  const khmerNumber = numberPart
    .split("")
    .map((digit) => khmerDigits[digit])
    .join("");

  return khmerNumber + rest;
});

// Khmer year converter function
const toKhmerYear = (inputString) => {
  const str = String(inputString);
  let year;
  if (str.includes(" - ")) {
    year = str.split(" - ")[0];
  } else {
    year = str;
  }

  const khmerDigits = {
    0: "០",
    1: "១",
    2: "២",
    3: "៣",
    4: "៤",
    5: "៥",
    6: "៦",
    7: "៧",
    8: "៨",
    9: "៩",
  };
  return year
    .split("")
    .map((digit) => khmerDigits[digit] || digit)
    .join("");
};

const convertYear = (stringYear) => {
  const str = String(stringYear);
  const khmerDigits = {
    0: "០",
    1: "១",
    2: "២",
    3: "៣",
    4: "៤",
    5: "៥",
    6: "៦",
    7: "៧",
    8: "៨",
    9: "៩",
  };
  return str.replace(/\d/g, (d) => khmerDigits[d]);
};

const subject = ref([
  { name: "ឈ្មោះសិស្ស" },
  { name: "ភាសាខ្មែរ" },
  { name: "សីលធម៌" },
  { name: "ប្រវត្តិវិទ្យា" },
  { name: "ភូមិវិទ្យា" },
  { name: "គណិត" },
  { name: "រូបវិទ្យា" },
  { name: "គីមីវិទ្យា" },
  { name: "ជីវវិទ្យា" },
  { name: "ផែនដី" },
  { name: "កីឡា" },
  { name: "អង់គ្លេស" },
  { name: "កុំព្យូទ័រ" },
  { name: "សកម្មភាព" },
]);

const exportToExcel = async () => {
  try {
    const response = await api.post("viewUpperExportExcel", form.value, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileURL = window.URL.createObjectURL(blob);

    const fileLink = document.createElement("a");
    fileLink.href = fileURL;

    fileLink.setAttribute(
      "download",
      `${transformedClass.value}-${typeMessage.value}${
        monthMessage.value ? `${monthMessage.value}` : ""
      }-${yearMessage.value}.xlsx`
    ); // ✅ fixed xlxs → xlsx

    document.body.appendChild(fileLink);
    fileLink.click();
    document.body.removeChild(fileLink);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  get_month();
  get_year();
  get_classroom();
});
</script>
<template>
  <div>
    <div
      v-if="checkLoading"
      class="d-flex flex-column justify-center align-center"
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
            របាយការណ៍កម្មវិធីខ្មែរ ថ្នាក់វិទ្យាល័យ
          </v-card-title>

          <div class="mt-3">
            <v-col cols="6" md="3" class="d-flex ga-2">
              <VSelect
                :items="years"
                item-value="id"
                item-title="name"
                class="customFont w-33"
                density="compact"
                placeholder="៦"
                label="ឆ្នាំសិក្សា"
                variant="outlined"
                v-model="yearId"
              />
            </v-col>

            <v-col cols="6" md="8" v-if="checkYear">
              <VRow>
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
                    v-model="form.class_id"
                  />
                </VCol>

                <VCol cols="12" sm="6" md="3">
                  <VSelect
                    :items="types"
                    item-value="nameEn"
                    item-title="nameKh"
                    class="customFont"
                    density="compact"
                    label="ប្រភេទរបាយការណ៍"
                    variant="outlined"
                    v-model="form.type"
                  />
                </VCol>

                <VCol cols="12" sm="6" md="3" v-if="checkMonth">
                  <VSelect
                    :items="months"
                    item-value="id"
                    item-title="name_kh"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="ជ្រើសរើសខែ"
                    variant="outlined"
                    v-model="form.month_id"
                  />
                </VCol>
                <VCol cols="6" md="2" class="d-flex ga-2">
                  <v-btn
                    variant="tonal"
                    color="green"
                    class="customFont"
                    prepend-icon="mdi-magnify"
                    @click="findInfo"
                    :loading="isloading"
                    :disabled="isloading"
                    >ស្វែងរក</v-btn
                  >
                  <!-- <VBtn
                    v-if="openDailog"
                    variant="tonal"
                    color="green"
                    @click="printContent"
                    class="customFont"
                    prepend-icon="mdi-printer"
                    >បោះពុម្ភ</VBtn
                  > -->

                  <!-- <VBtn
                    v-if="openDailog"
                    variant="tonal"
                    color="green"
                    href="#about"
                    class="customFont"
                    prepend-icon="mdi-printer"
                    >តារាងកិត្តិយស</VBtn
                  > -->
                </VCol>
              </VRow>
            </v-col>
          </div>

          <div style="margin-top: 10px; margin-bottom: 20px">
            <VTabs
              v-if="openDailog"
              v-model="currentTab"
              class="bg-grey-lighten-5 border"
              color="green-darken-4"
            >
              <VTab class="customFont" :active-class="'active-tab'"
                >ព័ត៌មានទូទៅ</VTab
              >
              <VTab class="customFont" :active-class="'active-tab'"
                >តារាងកិត្តិយស</VTab
              >
              <VTab
                class="customFont"
                :active-class="'active-tab'"
                v-if="form.type != 'year'"
                >តារាងពិន្ទុ</VTab
              >
              <!-- <VTab class="customFont" :active-class="'active-tab'"
              >វត្តមានសិស្ស</VTab
            > -->
            </VTabs>
          </div>

          <VCardText
            class="mx-auto mb-3"
            v-if="openDailog"
            id="printSection"
            style="width: 95%"
          >
            <VRow>
              <VWindow v-model="currentTab" class="w-100">
                <VWindowItem value="list">
                  <VCol md="12" col="12" sm="12" style="margin-top: -5px">
                    <div class="d-flex justify-end">
                      <VBtn
                        v-if="openDailog"
                        variant="tonal"
                        color="green"
                        @click="printContent"
                        class="customFont"
                        prepend-icon="mdi-printer"
                        >បោះពុម្ភ</VBtn
                      >
                    </div>
                    <div
                      class="text-center moul headerFont customKhmerMoul text-green-darken-4"
                      style="font-size: 17px"
                    >
                      <p class="mb-2">ព្រះរាជាណាចក្រកម្ពុជា</p>
                      <p>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                    </div>
                  </VCol>

                  <VCol cols="12" md="12" sm="12" style="margin-top: -58px">
                    <div
                      class="d-flex flex-column text-center pic"
                      style="width: 30%"
                    >
                      <div class="img mx-auto" style="width: 50px">
                        <v-img class="logo" :src="dis"></v-img>
                      </div>
                      <div>
                        <p
                          class="customKhmerMoul moul text-green-darken-4 mt-2"
                        >
                          សាលាចំណេះទូទៅអន្តរជាតិ ឌូវី
                          <span v-if="campus_id == 2">សាខាអូរចារ</span>
                        </p>
                      </div>
                    </div>
                    <div
                      class="moul text-end customKhmerMoul text-green-darken-4 grade"
                      style="margin-top: -25px"
                    >
                      <p>
                        ថ្នាក់ទី៖
                        <span
                          class="text-orange-darken-3 font-weight-bold"
                          v-if="classMessage"
                          >{{ transformedClass }}</span
                        >
                      </p>
                    </div>
                  </VCol>

                  <VCol md="12" col="12" sm="12" style="margin-top: -20px">
                    <div
                      class="text-center report_score customKhmerMoul moul text-green-darken-4"
                    >
                      <p>
                        ចំណាត់ថ្នាក់ប្រចាំ
                        <span
                          class="text-orange-darken-3"
                          v-if="typeMessage != 'ឆ្នាំ'"
                          >{{ typeMessage }}</span
                        >
                        <span
                          class="text-orange-darken-3"
                          v-if="monthMessage"
                          >{{ monthMessage }}</span
                        >
                        <span>
                          ឆ្នាំសិក្សា
                          <span class="text-orange-darken-3 font-weight-bold">{{
                            convertYear(yearMessage)
                          }}</span></span
                        >
                      </p>
                    </div>

                    <!-- តារាងកិត្តិយស -->
                    <div
                      class="text-center mt-0 customKhmerMoul moul text-green-darken-4 primary d-none"
                      style="font-size: 17px"
                    >
                      <p>
                        តារាងកិត្តិយសប្រចាំ
                        <span
                          class="text-orange-darken-3"
                          v-if="typeMessage != 'ឆ្នាំ'"
                          >{{ typeMessage }}</span
                        >
                        <span
                          class="text-orange-darken-3"
                          v-if="monthMessage"
                          >{{ monthMessage }}</span
                        >
                      </p>
                    </div>

                    <div
                      class="text-center mt-2 customKhmerMoul moul text-green-darken-4 primary d-none"
                      style="font-size: 17px"
                    >
                      <p>
                        ថ្នាក់ទី៖
                        <span
                          class="text-orange-darken-3"
                          v-if="classMessage"
                          >{{ transformedClass }}</span
                        >
                        ឆ្នាំសិក្សា
                        <span class="text-orange-darken-3">{{
                          convertYear(yearMessage)
                        }}</span>
                      </p>
                    </div>
                  </VCol>

                  <VCol cols="12" md="12" sm="12" style="margin-top: -23px">
                    <!-- Table Month -->
                    <table
                      v-if="typeMessage == 'ខែ'"
                      class="customFont battambang-thin"
                      style="font-size: 13px; width: 100%; color: black"
                    >
                      <thead>
                        <tr class="customKhmerMoul moul">
                          <th
                            style="height: 0px; width: 6%"
                            class="text-center my-custom-table"
                          >
                            ល.រ
                          </th>
                          <th
                            style="height: 0px; width: 30%"
                            class="py-2 text-center"
                          >
                            គោត្តនាម និងនាម
                          </th>
                          <th
                            style="height: 0px; width: 6%"
                            class="py-2 text-center"
                          >
                            ភេទ
                          </th>
                          <th
                            style="height: 0px; width: 11%"
                            class="py-2 text-center"
                          >
                            ពិន្ទុសរុប
                          </th>
                          <th
                            style="height: 0px; width: 11%"
                            class="py-2 text-center"
                          >
                            មធ្យមភាគ
                          </th>
                          <th
                            style="height: 0px; width: 9%"
                            class="py-2 text-center"
                          >
                            ចំ.ថ្នាក់
                          </th>
                          <th
                            style="height: 0px; width: 9%"
                            class="py-2 text-center"
                          >
                            និទ្ទេសន៍
                          </th>
                          <th
                            style="height: 0px; width: 18%"
                            class="py-2 text-center"
                          >
                            ផ្សេងៗ
                          </th>
                        </tr>
                      </thead>

                      <tbody class="my-custom-table customFont">
                        <tr v-for="(item, idx) in reportData" :key="idx">
                          <td style="height: 0; text-align: center">
                            {{ idx + 1 }}
                          </td>
                          <td style="height: 0; padding-left: 4px">
                            {{ item.kh_name }}
                          </td>
                          <!-- <td class="border" style="height: 0">
                        {{ item.en_name }}
                      </td> -->
                          <td
                            class="customFont"
                            style="height: 0; text-align: center"
                          >
                            <p v-if="item.gender == 1 || item.gender == 'M'">
                              ប្រុស
                            </p>
                            <p
                              v-else-if="item.gender == 2 || item.gender == 'F'"
                            >
                              ស្រី
                            </p>
                          </td>
                          <td style="height: 0; text-align: center">
                            {{ item.total_score }}
                          </td>
                          <td style="height: 0; text-align: center">
                            {{ item.avg }}
                          </td>
                          <td class="text-center" style="height: 0">
                            <p
                              :class="
                                item.rank == 1 ||
                                item.rank == 2 ||
                                item.rank == 3
                                  ? 'text-red font-weight-bold'
                                  : ''
                              "
                            >
                              {{ item.rank }}
                            </p>
                          </td>
                          <td
                            style="height: 0; text-align: center"
                            :class="
                              item.grade == 'ធ្លាក់' || item.rank == 'ខ្សោយ'
                                ? 'text-red font-weight-bold'
                                : ''
                            "
                          >
                            {{ item.grade }}
                          </td>
                          <td style="height: 0"></td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Semester1 and Semester2 -->
                    <table
                      v-else-if="
                        typeMessage == 'ឆមាសទី១' || typeMessage == 'ឆមាសទី២'
                      "
                      class="customFont battambang-thin"
                      style="font-size: 13px; width: 100%; color: black"
                    >
                      <thead
                        class="my-custom-table customKhmerMoul moul text-black text-center"
                        style="font-size: 12px"
                      >
                        <tr class="my-custom-table">
                          <th
                            rowspan="2"
                            style="height: 0px; width: 6%"
                            class="text-center"
                          >
                            ល.រ
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 30%"
                            class="text-center"
                          >
                            គោត្តនាម និងនាម
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 6%"
                            class="text-center"
                          >
                            ភេទ
                          </th>
                          <th
                            colspan="3"
                            style="height: 0px"
                            class="text-center"
                          >
                            មធ្យមភាគ
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px"
                            class="text-center"
                          >
                            ចំ.ថ្នាក់
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px"
                            class="text-center"
                          >
                            ផ្សេងៗ
                          </th>
                        </tr>
                        <tr class="my-custom-table">
                          <th style="height: 0px" class="text-center">
                            ប្រលងឆមាស
                          </th>
                          <th style="height: 0px" class="text-center">
                            ប្រចាំខែ
                          </th>
                          <th style="height: 0px" class="text-center">
                            ប្រចាំឆមាស
                          </th>
                        </tr>
                      </thead>
                      <tbody class="my-custom-table customFont">
                        <tr v-for="(item, idx) in reportData" :key="idx">
                          <td style="height: 0; text-align: center">
                            {{ idx + 1 }}
                          </td>
                          <td style="height: 0; padding-left: 4px">
                            {{ item.kh_name }}
                          </td>

                          <td
                            class="customFont"
                            style="height: 0; text-align: center"
                          >
                            <p v-if="item.gender == 1 || item.gender == 'M'">
                              ប្រុស
                            </p>
                            <p
                              v-else-if="item.gender == 2 || item.gender == 'F'"
                            >
                              ស្រី
                            </p>
                          </td>
                          <td style="height: 0; text-align: center; width: 12%">
                            {{ item.average_month_semester }}
                          </td>
                          <td style="height: 0; text-align: center; width: 9%">
                            {{ item.average_3_month }}
                          </td>
                          <td
                            v-if="typeMessage == 'ឆមាសទី២'"
                            style="height: 0; text-align: center; width: 10%"
                          >
                            {{ item.average_semester2 }}
                          </td>
                          <td
                            v-if="typeMessage == 'ឆមាសទី១'"
                            style="height: 0; text-align: center; width: 10%"
                          >
                            {{ item.average_semester1 }}
                          </td>
                          <!-- <td v-if="typeMessage == 'ឆមាសទី1'" style="height: 0">
                        {{ item.average_semester1 }}
                      </td> -->
                          <td
                            class="text-center"
                            style="height: 0; text-align: center; width: 9%"
                          >
                            <p
                              :class="
                                item.rank == 1 ||
                                item.rank == 2 ||
                                item.rank == 3
                                  ? 'text-red font-weight-bold'
                                  : ''
                              "
                            >
                              {{ item.rank }}
                            </p>
                          </td>
                          <td style="height: 0; width: 18%"></td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Year -->
                    <table
                      v-else
                      class="customFont battambang-thin"
                      style="font-size: 13px; width: 100%; color: black"
                    >
                      <thead
                        class="my-custom-table customKhmerMoul moul text-black text-center"
                        style="font-size: 12px"
                      >
                        <tr class="my-custom-table">
                          <th rowspan="2" style="height: 0px; width: 6%">
                            ល.រ
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 30%"
                            class="text-center"
                          >
                            គោត្តនាម និងនាម
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 6%"
                            class="text-center"
                          >
                            ភេទ
                          </th>
                          <th
                            colspan="3"
                            style="height: 0px"
                            class="text-center"
                          >
                            មធ្យមភាគ
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 7%"
                            class="text-center"
                          >
                            ចំ.ថ្នាក់
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 8%"
                            class="text-center"
                          >
                            និទ្ទេសន៏
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 18%"
                            class="text-center"
                          >
                            ផ្សេងៗ
                          </th>
                        </tr>
                        <tr class="my-custom-table">
                          <th
                            style="height: 0px; width: 9%"
                            class="text-center"
                          >
                            ឆមាសទី១
                          </th>
                          <th
                            style="height: 0px; width: 9%"
                            class="text-center"
                          >
                            ឆមាសទី២
                          </th>
                          <th
                            style="height: 0px; width: 7%"
                            class="text-center"
                          >
                            ប្រចាំឆ្នាំ
                          </th>
                        </tr>
                      </thead>

                      <tbody class="my-custom-table customFont">
                        <tr v-for="(item, idx) in reportData" :key="idx">
                          <td style="height: 0; text-align: center">
                            {{ idx + 1 }}
                          </td>
                          <td style="height: 0; padding-left: 4px">
                            {{ item.kh_name }}
                          </td>

                          <td
                            class="customFont"
                            style="height: 0; text-align: center"
                          >
                            <p v-if="item.gender == 1 || item.gender == 'M'">
                              ប្រុស
                            </p>
                            <p
                              v-else-if="item.gender == 2 || item.gender == 'F'"
                            >
                              ស្រី
                            </p>
                          </td>
                          <td style="height: 0; text-align: center">
                            {{ item.average_semester1 }}
                          </td>
                          <td style="height: 0; text-align: center">
                            {{ item.average_semester2 }}
                          </td>
                          <td style="height: 0; text-align: center">
                            {{ item.average_year }}
                          </td>
                          <td class="text-center" style="height: 0">
                            <p
                              :class="
                                item.rank == 1 ||
                                item.rank == 2 ||
                                item.rank == 3
                                  ? 'text-red font-weight-bold'
                                  : ''
                              "
                            >
                              {{ item.rank }}
                            </p>
                          </td>
                          <td
                            style="height: 0; text-align: center"
                            :class="
                              item.grade == 'ធ្លាក់' || item.rank == 'ខ្សោយ'
                                ? 'text-red font-weight-bold'
                                : ''
                            "
                          >
                            {{ item.grade }}
                          </td>
                          <td style="height: 0"></td>
                        </tr>
                      </tbody>
                    </table>
                  </VCol>

                  <VCol
                    cols="12"
                    md="12"
                    sm="12"
                    class="customFont battambang-thin pl-16"
                    style="margin-top: -10px"
                  >
                    <p>
                      សិស្សសរុបមាន ៖&ensp;<span class="font-weight-bold">{{
                        allStudents
                      }}</span
                      >&ensp;នាក់
                    </p>
                    <p>
                      សិស្សស្រីមាន&ensp;&ensp;៖&ensp;<span
                        class="font-weight-bold"
                        >{{ student_female }}</span
                      >&ensp;នាក់
                    </p>
                    <p class="mr-6 text-end" style="margin-top: -25px">
                      បាត់ដំបង, ថ្ងៃទី.......ខែ...........ឆ្នាំ<span>{{
                        toKhmerYear(currentYear)
                      }}</span>
                    </p>
                    <div class="d-flex justify-end mt-2">
                      <p
                        class="w-25 text-center teacher moul customKhmerMoul text-black font-weight-bold"
                      >
                        គ្រូបន្ទុកថ្នាក់
                      </p>
                    </div>
                  </VCol>

                  <VCol
                    style="margin-top: -45px"
                    cols="12"
                    md="12"
                    sm="12"
                    class="customFont battambang-thin pl-10 text-start"
                  >
                    <p class="w-100 pl-6 mt-2">បានឃើញ និងឯកភាព</p>
                    <p
                      class="w-100 pl-10 font-weight-bold text-black moul customKhmerMoul"
                    >
                      នាយកសាលា
                    </p>
                    <!-- </div> -->
                  </VCol>
                </VWindowItem>

                <VWindowItem value="student">
                  <VCol
                    cols="12"
                    md="12"
                    sm="12"
                    class="primary customFont d-flex ga-3 align-center text-end"
                  >
                    <VTextField
                      class="primary"
                      label="ថ្ងៃខែឆ្នាំ (ចន្ទគតិ)"
                      placeholder="ថ្ងៃសុក្រ ៦កើត ខែពិសាខ ឆ្នាំម្សាញ់ សប្ដស័ក ព.ស.២៥៦៨"
                      variant="outlined"
                      density="compact"
                      v-model="khmerDate"
                    />

                    <VTextField
                      class="primary"
                      label="ថ្ងៃខែឆ្នាំ (សុរិយគតិ)"
                      v-model="date"
                      variant="outlined"
                      density="compact"
                      placeholder="បាត់ដំបង, ថ្ងៃទី២ ខែឧសភា ឆ្នាំ២០២៥"
                    />

                    <VBtn
                      :loading="isDownload"
                      :disabled="isDownload"
                      id="about"
                      v-if="openDailog"
                      variant="tonal"
                      color="green"
                      class="customFont"
                      @click="downloadAsImage"
                      style="margin-top: -20px"
                      prepend-icon="mdi-printer"
                      >បោះពុម្ភតារាងកិត្តិយស</VBtn
                    >
                  </VCol>

                  <!-- <VCol cols="12" md="12" sm="12" class="primary mt-1">
                <ResultPrimaryVue
                  :yearMessage="toKhmerYear(yearMessage)"
                  :topFive="topFive"
                  :Border="Border"
                />
              </VCol> -->

                  <VCol
                    cols="12"
                    md="12"
                    sm="12"
                    class="primary"
                    style="position: relative"
                  >
                    <ReportTopOchar
                      id="printImg"
                      v-if="campus_id == 2"
                      ref="printImg"
                      :khmerDate="khmerDate"
                      :date="date"
                      :yearMessage="convertYear(yearMessage)"
                      :topFive="topFive"
                      :monthMessage="monthMessage"
                      :typeMessage="typeMessage"
                      :transformedClass="transformedClass"
                    >
                    </ReportTopOchar>
                    <ReportPrimaryWithImage
                      v-else
                      id="printImg"
                      ref="printImg"
                      :khmerDate="khmerDate"
                      :date="date"
                      :yearMessage="convertYear(yearMessage)"
                      :topFive="topFive"
                      :monthMessage="monthMessage"
                      :typeMessage="typeMessage"
                      :transformedClass="transformedClass"
                    />
                  </VCol>
                </VWindowItem>

                <VWindowItem value="studentScore" id="studentScore">
                  <div class="d-flex justify-end ga-2">
                    <VBtn
                      :loading="isDownload"
                      :disabled="isDownload"
                      id="about"
                      v-if="openDailog"
                      variant="tonal"
                      color="green"
                      class="customFont"
                      @click="printStudentScore"
                      prepend-icon="mdi-printer"
                      >បោះពុម្ភតារាងពិន្ទុ</VBtn
                    >

                    <VBtn
                      variant="tonal"
                      color="orange"
                      :loading="isDownloadExcel"
                      :disabled="isDownloadExcel"
                      @click="exportToExcel"
                    >
                      Excel
                    </VBtn>
                  </div>
                  <VCol md="12" col="12" sm="12" style="margin-top: -50px">
                    <div
                      class="text-center moul headerFont customKhmerMoul text-green-darken-4"
                      style="font-size: 17px"
                    >
                      <p class="mb-2">ព្រះរាជាណាចក្រកម្ពុជា</p>
                      <p>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                    </div>
                  </VCol>

                  <VCol cols="12" md="12" sm="12" style="margin-top: -73px">
                    <div
                      class="d-flex flex-column text-center pic"
                      style="width: 30%"
                    >
                      <div class="img mx-auto" style="width: 50px">
                        <v-img class="logo" :src="dis"></v-img>
                      </div>
                      <div>
                        <p
                          class="customKhmerMoul moul text-green-darken-4 mt-2"
                        >
                          សាលាចំណេះទូទៅអន្តរជាតិ ឌូវី​
                          <span v-if="campus_id == 2">សាខាអូរចារ</span>
                        </p>
                      </div>
                    </div>
                    <div
                      class="moul text-end customKhmerMoul text-green-darken-4 grade"
                      style="margin-top: -25px"
                    >
                      <p>
                        ថ្នាក់ទី៖
                        <span
                          class="text-orange-darken-3 font-weight-bold"
                          v-if="classMessage"
                          >{{ transformedClass }}</span
                        >
                      </p>
                    </div>
                  </VCol>

                  <VCol md="12" col="12" sm="12" style="margin-top: -40px">
                    <div
                      class="text-center report_score customKhmerMoul moul text-green-darken-4"
                    >
                      <p>
                        តារាងពិន្ទុប្រចាំ
                        <span
                          class="text-orange-darken-3"
                          v-if="typeMessage != 'ឆ្នាំ'"
                          >{{ typeMessage }}</span
                        >
                        <span
                          class="text-orange-darken-3"
                          v-if="monthMessage"
                          >{{ monthMessage }}</span
                        >
                        <span>
                          ឆ្នាំសិក្សា
                          <span class="text-orange-darken-3 font-weight-bold">{{
                            convertYear(yearMessage)
                          }}</span></span
                        >
                      </p>
                    </div>

                    <!-- តារាងកិត្តិយស -->
                    <div
                      class="text-center mt-0 customKhmerMoul moul text-green-darken-4 primary d-none"
                      style="font-size: 17px"
                    >
                      <p>
                        តារាងកិត្តិយសប្រចាំ
                        <span
                          class="text-orange-darken-3"
                          v-if="typeMessage != 'ឆ្នាំ'"
                          >{{ typeMessage }}</span
                        >
                        <span
                          class="text-orange-darken-3"
                          v-if="monthMessage"
                          >{{ monthMessage }}</span
                        >
                      </p>
                    </div>

                    <div
                      class="text-center mt-2 customKhmerMoul moul text-green-darken-4 primary d-none"
                      style="font-size: 17px"
                    >
                      <p>
                        ថ្នាក់ទី៖
                        <span
                          class="text-orange-darken-3"
                          v-if="classMessage"
                          >{{ transformedClass }}</span
                        >
                        ឆ្នាំសិក្សា
                        <span class="text-orange-darken-3">{{
                          convertYear(yearMessage)
                        }}</span>
                      </p>
                    </div>

                    <div>
                      <v-table
                        class="customFont battambang-thin table"
                        style="font-size: 11px; color: black; width: 100%"
                      >
                        <tr>
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold"
                          >
                            ល.រ
                          </th>
                          <th
                            style="height: 59px; width: 10%"
                            class="text-center pa-0 font-weight-bold"
                          >
                            ឈ្មោះសិស្ស
                          </th>
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold"
                          >
                            ភេទ
                          </th>

                          <!-- khmer -->
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            ខ្មែរ
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            សីលធម៌
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>
                          <!-- history -->
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            ប្រវត្តិ
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>

                          <!-- geology -->

                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            ភូមិ
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>

                          <!-- Math -->
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            គណិត
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>

                          <!-- physic -->
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            រូប
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>

                          <!-- chemistry -->
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            គីមី
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>

                          <!-- biology -->
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            ជីវ
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>

                          <!-- earth -->
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            ផែនដី
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>

                          <!-- pe -->
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                            v-if="form.level != 11 && form.level != 12"
                          >
                            កីឡា
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="
                              form.level != 11 &&
                              form.level != 12 &&
                              form.type != 'month'
                            "
                          >
                            ចំ.ថ្នាក់
                          </th>

                          <!-- english -->
                          <th
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            អង់គ្លេស
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>

                          <!-- computer -->
                          <th
                            v-if="form.level != 12"
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold vertical-header"
                          >
                            កុំព្យូទ័រ
                          </th>
                          <th
                            style="height: 0%; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            v-if="form.level != 12 && form.type != 'month'"
                          >
                            ចំ.ថ្នាក់
                          </th>
                          <th
                            v-if="form.type == 'month'"
                            style="height: 0px; width: 2%"
                            class="text-center semesterFieldHeader pa-0 font-weight-bold vertical-header"
                          >
                            ពិន្ទុសរុប
                          </th>
                          <th
                            v-if="
                              form.type == 'semester1' ||
                              form.type == 'semester2'
                            "
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 font-weight-bold semesterFieldHeader vertical-header"
                          >
                            ពិន្ទុ.ឆ.ស
                          </th>
                          <th
                            v-if="
                              form.type == 'semester1' ||
                              form.type == 'semester2'
                            "
                            style="height: 0px; width: 2%"
                            class="text-center semesterFieldHeader pa-0 font-weight-bold vertical-header"
                          >
                            ម.ឆមាស
                          </th>
                          <th
                            v-if="form.type == 'month'"
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 semesterFieldHeader font-weight-bold vertical-header"
                          >
                            មធ្យមភាគ
                          </th>
                          <th
                            v-if="form.type == 'month'"
                            style="height: 0px; width: 2%"
                            class="text-center subjectRankHeader font-weight-bold vertical-header"
                          >
                            ចំ.ថ្នាក់
                          </th>
                          <th
                            v-if="
                              form.type == 'semester1' ||
                              form.type == 'semester2'
                            "
                            style="height: 0px; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                          >
                            ចំ.ឆមាស
                          </th>

                          <!-- មធ្យមខែឆមាស(៣ខែ) -->
                          <th
                            v-if="
                              form.type == 'semester1' ||
                              form.type == 'semester2'
                            "
                            style="height: 0px; width: 2%"
                            class="text-center semesterFieldHeader pa-0 font-weight-bold vertical-header"
                          >
                            ម.ខែឆមាស
                          </th>
                          <!-- ចំណាត់ថ្នាក់ខែឆមាស(៣ខែ) -->
                          <th
                            v-if="
                              form.type == 'semester1' ||
                              form.type == 'semester2'
                            "
                            style="height: 0px; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                          >
                            ចំ.ខែឆមាស
                          </th>

                          <!-- មធ្យមភាគប្រចាំឆមាសទី១ -->
                          <th
                            v-if="
                              form.type == 'semester1' ||
                              form.type == 'semester2'
                            "
                            style="height: 0px; width: 2%"
                            class="text-center pa-0 semesterFieldHeader font-weight-bold vertical-header"
                          >
                            ម.ពិន្ទុឆមាស
                          </th>

                          <!-- ចំណាត់ថ្នាក់ប្រចាំឆមាស -->
                          <th
                            v-if="
                              form.type == 'semester1' ||
                              form.type == 'semester2'
                            "
                            style="height: 0px; width: 2%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                          >
                            ចំ.ប្រចាំឆមាស
                          </th>
                          <th
                            style="height: 0px; width: 7%"
                            class="text-center semesterFieldHeader font-weight-bold"
                          >
                            និទ្ទេសន៍
                          </th>
                        </tr>

                        <tbody class="customFont text-center">
                          <tr v-for="(item, idx) in reportData" :key="idx">
                            <td style="height: 0; padding: 1px">
                              {{ idx + 1 }}
                            </td>
                            <td style="height: 0; text-align: left">
                              {{ item.kh_name }}
                            </td>
                            <td class="customFont pa-0" style="height: 0">
                              <p v-if="item.gender == 1 || item.gender == 'M'">
                                ប្រុស
                              </p>
                              <p
                                v-else-if="
                                  item.gender == 2 || item.gender == 'F'
                                "
                              >
                                ស្រី
                              </p>
                            </td>

                            <!-- khmer -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.khmer }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
                              :class="
                                item.rankKhmer == 1 ||
                                item.rankKhmer == 2 ||
                                item.rankKhmer == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankKhmer }}
                            </td>

                            <!-- Morality -->
                            <td style="height: 0; padding: 0">
                              {{ item.morality }}
                            </td>
                            <td
                              v-if="form.type != 'month'"
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              :class="
                                item.rankMorality == 1 ||
                                item.rankMorality == 2 ||
                                item.rankMorality == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankMorality }}
                            </td>

                            <!-- history -->
                            <td style="height: 0; padding: 0">
                              {{ item.history }}
                            </td>
                            <td
                              v-if="form.type != 'month'"
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              :class="
                                item.rankHistory == 1 ||
                                item.rankHistory == 2 ||
                                item.rankHistory == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankHistory }}
                            </td>

                            <!-- geography -->
                            <td style="height: 0; padding: 0">
                              {{ item.geography }}
                            </td>
                            <td
                              v-if="form.type != 'month'"
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              :class="
                                item.rankGeography == 1 ||
                                item.rankGeography == 2 ||
                                item.rankGeography == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankGeography }}
                            </td>

                            <!-- Math -->
                            <td style="height: 0; padding: 0">
                              {{ item.math }}
                            </td>
                            <td
                              v-if="form.type != 'month'"
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              :class="
                                item.rankMath == 1 ||
                                item.rankMath == 2 ||
                                item.rankMath == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankMath }}
                            </td>

                            <!-- physic -->
                            <td style="height: 0; padding: 0">
                              {{ item.physical }}
                            </td>
                            <td
                              v-if="form.type != 'month'"
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              :class="
                                item.rankPhysic == 1 ||
                                item.rankPhysic == 2 ||
                                item.rankPhysic == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankPhysic }}
                            </td>

                            <!-- chemistry -->
                            <td style="height: 0; padding: 0">
                              {{ item.chemistry }}
                            </td>
                            <td
                              v-if="form.type != 'month'"
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              :class="
                                item.rankChemistry == 1 ||
                                item.rankChemistry == 2 ||
                                item.rankChemistry == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankChemistry }}
                            </td>

                            <!-- biology -->
                            <td style="height: 0; padding: 0">
                              {{ item.biology }}
                            </td>
                            <td
                              v-if="form.type != 'month'"
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              :class="
                                item.rankBiology == 1 ||
                                item.rankBiology == 2 ||
                                item.rankBiology == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankBiology }}
                            </td>

                            <!-- earth_scirent -->
                            <td style="height: 0; padding: 0">
                              {{ item.earth_science }}
                            </td>
                            <td
                              v-if="form.type != 'month'"
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              :class="
                                item.rankEarth == 1 ||
                                item.rankEarth == 2 ||
                                item.rankEarth == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankEarth }}
                            </td>

                            <!-- pe -->
                            <td
                              style="height: 0; padding: 0"
                              v-if="form.level != 11 && form.level != 12"
                            >
                              {{ item.pe }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="
                                form.level != 11 &&
                                form.level != 12 &&
                                form.type != 'month'
                              "
                              :class="
                                item.rankPe == 1 ||
                                item.rankPe == 2 ||
                                item.rankPe == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankPe }}
                            </td>

                            <!-- english -->
                            <td style="height: 0; padding: 0">
                              {{ item.english }}
                            </td>
                            <td
                              v-if="form.type != 'month'"
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              :class="
                                item.rankEnglish == 1 ||
                                item.rankEnglish == 2 ||
                                item.rankEnglish == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankEnglish }}
                            </td>

                            <!-- computer -->
                            <td
                              style="height: 0; padding: 0"
                              v-if="form.level != 12"
                            >
                              {{ item.computer }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.level != 12 && form.type != 'month'"
                              :class="
                                item.rankComputer == 1 ||
                                item.rankComputer == 2 ||
                                item.rankComputer == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankComputer }}
                            </td>

                            <!-- ពិន្ទុសរុបខែ -->
                            <td
                              class="text-center semesterField"
                              style="height: 0; padding: 0"
                              v-if="form.type == 'month'"
                            >
                              {{ item.total_score }}
                            </td>

                            <!-- ពិន្ទុសរុបខែឆមាស -->
                            <td
                              class="semesterField"
                              style="height: 0; padding: 0"
                              v-if="
                                form.type == 'semester1' ||
                                form.type == 'semester2'
                              "
                            >
                              {{ item.total_score }}
                            </td>

                            <!-- មធ្យមភាគខែឆមាស -->
                            <td
                              class="semesterField"
                              style="height: 0; padding: 0"
                              v-if="
                                form.type == 'semester1' ||
                                form.type == 'semester2'
                              "
                            >
                              {{ item.average_month_semester }}
                            </td>

                            <!-- មធ្យមភាគខែ -->
                            <td
                              class="semesterField"
                              style="height: 0; padding: 0"
                              v-if="form.type == 'month'"
                            >
                              {{ item.avg }}
                            </td>

                            <!-- ចំណាត់ថ្នាក់ខែ -->
                            <td
                              class="subjectRank"
                              v-if="form.type == 'month'"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rank == 1 ||
                                item.rank == 2 ||
                                item.rank == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rank }}
                            </td>

                            <!-- ចំណាត់ថ្នាក់ខែឆមាស -->
                            <td
                              class="subjectRank"
                              v-if="
                                form.type == 'semester1' ||
                                form.type == 'semester2'
                              "
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rank_month_semester == 1 ||
                                item.rank_month_semester == 2 ||
                                item.rank_month_semester == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rank_month_semester }}
                            </td>

                            <!-- មធ្យមខែឆមាស(ភាគ៣ខែ) -->
                            <td
                              class="semesterField"
                              style="height: 0; padding: 0"
                              v-if="
                                form.type == 'semester1' ||
                                form.type == 'semester2'
                              "
                            >
                              {{ item.average_3_month }}
                            </td>

                            <!-- ចំណាត់ថ្នាក់ខែឆមាស(៣ខែ) -->
                            <td
                              class="subjectRank"
                              v-if="
                                form.type == 'semester1' ||
                                form.type == 'semester2'
                              "
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rank_3_month == 1 ||
                                item.rank_3_month == 2 ||
                                item.rank_3_month == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rank_3_month }}
                            </td>

                            <!-- មធ្យមភាគពិន្ទុប្រចាំឆមាសទី១ -->
                            <td
                              class="semesterField"
                              v-if="form.type == 'semester1'"
                              style="height: 0; text-align: center; padding: 0"
                            >
                              {{ item.average_semester1 }}
                            </td>
                            <td
                              class="semesterField"
                              v-if="form.type == 'semester2'"
                              style="height: 0; text-align: center; padding: 0"
                            >
                              {{ item.average_semester2 }}
                            </td>

                            <!-- ចំណាត់ថ្នាក់ប្រចាំឆមាស -->
                            <td
                              class="subjectRank"
                              v-if="
                                form.type == 'semester1' ||
                                form.type == 'semester2'
                              "
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rank == 1 ||
                                item.rank == 2 ||
                                item.rank == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rank }}
                            </td>

                            <td
                              class="semesterField"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.grade == 'ធ្លាក់' || item.rank == 'ខ្សោយ'
                                  ? 'text-red font-weight-bold'
                                  : ''
                              "
                            >
                              {{ item.grade }}
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </VCol>
                  <VCol
                    cols="12"
                    md="12"
                    sm="12"
                    class="customFont battambang-thin pl-16"
                    style="margin-top: -20px; font-size: 12px"
                  >
                    <div class="d-flex">
                      <p>
                        សិស្សសរុបមាន ៖&ensp;<span class="font-weight-bold">{{
                          allStudents
                        }}</span
                        >&ensp;នាក់
                      </p>
                      <p>
                        សិស្សស្រីមាន&ensp;&ensp;៖&ensp;<span
                          class="font-weight-bold"
                          >{{ student_female }}</span
                        >&ensp;នាក់
                      </p>
                    </div>
                    <p class="mr-6 text-end" style="margin-top: -20px">
                      បាត់ដំបង, ថ្ងៃទី.......ខែ............ឆ្នាំ<span>{{
                        toKhmerYear(currentYear)
                      }}</span>
                    </p>
                    <div class="d-flex justify-end mt-2">
                      <p
                        style="margin-left: 60px"
                        class="w-25 text-center teacher moul customKhmerMoul text-black font-weight-bold"
                      >
                        គ្រូបន្ទុកថ្នាក់
                      </p>
                    </div>
                  </VCol>

                  <VCol
                    style="margin-top: -50px; font-size: 12px"
                    cols="12"
                    md="12"
                    sm="12"
                    class="customFont battambang-thin pl-10 text-start"
                  >
                    <p class="w-100 pl-6 mt-2">បានឃើញ និងឯកភាព</p>
                    <p
                      class="w-100 pl-10 font-weight-bold text-black moul customKhmerMoul"
                    >
                      នាយកសាលា
                    </p>
                    <!-- </div> -->
                  </VCol>
                </VWindowItem>
              </VWindow>
            </VRow>
          </VCardText>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Battambang:wght@100;300;400;700;900&display=swap");
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

.vertical-header {
  writing-mode: vertical-rl; /* vertical text */
  transform: rotate(180deg); /* upright text */
  white-space: nowrap; /* no wrapping */
}
.subjectRank {
  background-color: #ffccbc !important;
}
.semesterField {
  background-color: #c8e6c9;
}
.subjectRankHeader {
  background-color: #ffab91 !important;
}
.semesterFieldHeader {
  background-color: #81c784;
}
/* .primary {
  visibility: hidden;
  position: absolute;
  left: -9999px;
  top: -9999px;
}

@media print {
  .primary {
    visibility: visible;
    position: static;
  }
} */

/* Optional: Style the span within the div for further control */
</style>
