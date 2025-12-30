<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import dis from "@/assets/img/DIS.png";
import Background from "@/assets/img/background.jpg";
import { Printd } from "printd";
import Border from "@/assets/img/border3.jpg";
import ResultPrimaryVue from "../components/resultPrimary.vue";
import ReportPrimaryWithImage from "../components/reportPrimaryWithImage.vue";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const currentTab = ref("list");

import domtoimage from "dom-to-image";
import { size } from "lodash";

const isDownload = ref(false);

const printImg = ref(null);

const downloadAsImage = async () => {
  isDownload.value = true;
  const element = document.getElementById("printImg");
  // រង់ចាំ Khmer font loading
  await document.fonts.ready;

  if (!element) {
    console.error("Element #printImg not found.");
    return;
  }

  const style = {
    style: {
      size: 10,
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
        fontFamily: "'Battambang', 'Moul', 'Siemreap', 'Angkor', sans-serif",
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

// const dialog  = ref(true);

// const print_top_five = ref(false);

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

      .field {
        background-color:  #ffffb1 !important;
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

const printSemesterDetail = () => {
  const printd = new Printd();
  const element = document.getElementById("semesterDetail");

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

      .field {
        background-color:  #ffffb1 !important;
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

const printYearDetail = () => {
  const printd = new Printd();
  const element = document.getElementById("yearDetail");

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

      .field {
        background-color:  #ffffb1 !important;
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

const form = ref({
  type: "",
  class_id: null,
  month_id: null,
  year_id: yearId.value,
  level: null,
  campus_id: campus_id.value,
});

const get_classroom = async () => {
  try {
    await api
      .post("/get_all_classroom", {
        campus_id: campus_id.value,
      })
      .then((res) => {
        classrooms.value = res.data.filter(
          (c) => c.deleted != 1 && c.education_id == 1
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
    classroomFilter.value = classrooms.value.filter((c) => c.year_id == newVal);
    checkYear.value = true;
    form.value.year_id = newVal;
    console.log(checkYear.value);
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
    // form.value.campus_id = campus_id.value;
    yearId.value = null;
    form.value = {
      type: "",
      class_id: null,
      month_id: null,
      year_id: yearId.value,
      campus_id: campus_id.value,
    };
    debouncedGetClassroom();
  },
  { immediate: true }
);

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
const three_months = ref([]);

const findInfo = async () => {
  try {
    // print_top_five.value = false;
    // dialog.value = true;
    isloading.value = true;
    openDailog.value = false;
    monthMessage.value = "";
    typeMessage.value = "";

    console.log("form", form.value);
    await api
      .post("/viewPrimary", form.value, {
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
        reportData.value = res.data.data;

        console.log(reportData.value);

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
  }
};

// const finalReport = computed(() => {
//   return [...reportData.value, ...Array(35 - reportData.value.length).fill({})];
// });

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

// {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }

const exportToExcel = async () => {
  try {
    const response = await api.post("/viewPrimaryExportExcel", form.value, {
      responseType: "blob", // ✅ must go here
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
    console.error(error);
  }
};

onMounted(async () => {
  get_month();
  get_year();
  get_classroom();

  // await useAutoRefreshClassrooms(1);

  // classrooms.value = await useAutoRefreshClassrooms(1);
  // classrooms.value.filter((c) => c.deleted != 1 && c.education_id == 1);
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
            របាយការណ៍កម្មវិធីខ្មែរ ថ្នាក់បឋម
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
                v-if="form.type != 'year'"
                class="customFont"
                :active-class="'active-tab'"
                >តារាងពិន្ទុ</VTab
              >
              <VTab
                v-if="
                  form.type != 'month' && form.type != 'year' && form.level == 6
                "
                class="customFont"
                :active-class="'active-tab'"
                >តារាងពិន្ទុឆមាស</VTab
              >
              <VTab
                v-if="form.type == 'year'"
                class="customFont"
                :active-class="'active-tab'"
                >តារាងពិន្ទុប្រចាំឆ្នាំ</VTab
              >
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
                      class="text-center mt-2 customKhmerMoul moul text-green-darken-4 primary d-none"
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
                          <td
                            style="height: 0; text-align: center; width: 12%"
                            v-if="form.level == 6"
                          >
                            {{ item.average_kcms }}
                          </td>
                          <td
                            style="height: 0; text-align: center; width: 12%"
                            v-if="form.level != 6"
                          >
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
                          <td
                            class="text-center"
                            style="height: 0; text-align: center; width: 18%"
                          ></td>
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
                            v-if="form.level == 6"
                            rowspan="2"
                            style="height: 0px; width: 7%"
                            class="text-center"
                          >
                            ប្រចាំឆ្នាំ
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
                            v-if="form.level == 6"
                            style="height: 0px; width: 7%"
                            class="text-center"
                          >
                            មធ្យមខែក្នុង១ឆ្នាំ
                          </th>
                          <th
                            v-else
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
                          <td
                            v-if="form.level == 6"
                            style="height: 0; text-align: center"
                          >
                            {{ item.allMonthAvg }}
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
                      បាត់ដំបង, ថ្ងៃទី.......ខែ..........ឆ្នាំ<span>{{
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

                <!-- Subjects by Grade Tab -->
                <VWindowItem value="student">
                  <VCol
                    cols="12"
                    md="12"
                    sm="12"
                    class="primary d-flex ga-3 align-center text-end"
                  >
                    <VTextField
                      class="primary customFont"
                      label="ថ្ងៃខែឆ្នាំ (ចន្ទគតិ)"
                      placeholder="ថ្ងៃសុក្រ ៦កើត ខែពិសាខ ឆ្នាំម្សាញ់ សប្ដស័ក ព.ស.២៥៦៨"
                      variant="outlined"
                      density="compact"
                      v-model="khmerDate"
                    />

                    <VTextField
                      class="primary customFont"
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

                  <!-- <VCol cols="12" md="12" sm="12" class="primary mt-0" :style="{ 'background-image': `url(${background})` }">
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
                    <ReportPrimaryWithImage
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

                <VWindowItem
                  value="studentScore"
                  id="studentScore"
                  v-if="form.type != 'year'"
                >
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
                      excel
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
                          សាលាចំណេះទូទៅអន្តរជាតិ ឌូវី
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
                        style="font-size: 8px; color: black; width: 100%"
                      >
                        <template
                          v-if="form.level == 6 && form.type != 'month'"
                        >
                          <tr>
                            <th
                              rowspan="2"
                              style="height: 0px; width: 1%"
                              class="text-center pa-0 font-weight-bold"
                            >
                              ល.រ
                            </th>
                            <th
                              rowspan="2"
                              :style="
                                form.type == 'month' ? 'width:20%' : 'width:5%'
                              "
                              style="height: 50px; width: 8%"
                              class="text-center pa-0 font-weight-bold"
                            >
                              ឈ្មោះសិស្ស
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0px; width: 1%"
                              class="text-center pa-0 font-weight-bold"
                            >
                              ភេទ
                            </th>

                            <!-- listen -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              ស្ដាប់
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- speaking -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              និយាយ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- reading -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              អំណាន
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- writing -->
                            <th
                              rowspan="2"
                              v-if="form.level != 1 && form.level != 2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              សរសេរ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="
                                form.type != 'month' &&
                                form.level != 1 &&
                                form.level != 2
                              "
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- essay -->
                            <th
                              rowspan="2"
                              v-if="form.level != 1 && form.level != 2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              តែងសេចក្ដី
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="
                                form.type != 'month' &&
                                form.level != 1 &&
                                form.level != 2
                              "
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- grammar -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              វេយ្យាករណ៍
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- math -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center field pa-0 font-weight-bold vertical-header"
                            >
                              គណិត
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- chemistry -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold field vertical-header"
                            >
                              វិទ្យាសាស្រ្ត
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- physical -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              ភូមិ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- history -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              ប្រវត្តិ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- morality -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              សីលធម៍
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- art -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              គំនូរ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- word -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              អក្សរផ្ចង់
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- pe -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              អប់រំកាយ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4 &&
                                form.type != 'month'
                              "
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- homework -->
                            <th
                              rowspan="2"
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4
                              "
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              កិច្ចការផ្ទះ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4 &&
                                form.type != 'month'
                              "
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- healthy -->
                            <th
                              rowspan="2"
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4
                              "
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              អនាម័យ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- steam -->
                            <th
                              rowspan="2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              STEAM
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- Khmer -->
                            <th
                              rowspan="2"
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold field vertical-header"
                            >
                              ភាសារខ្មែរ
                            </th>
                            <th
                              rowspan="2"
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header field"
                            >
                              មធ្យមខ្មែរ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- សិក្សាសង្គម -->
                            <th
                              rowspan="2"
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold field vertical-header"
                            >
                              សិក្សាសង្គម
                            </th>
                            <th
                              rowspan="2"
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header field"
                            >
                              មធ្យមសង្គម
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0%; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- total_score -->
                            <th
                              rowspan="2"
                              v-if="form.type == 'month'"
                              style="height: 0px; width: 2%"
                              class="text-center semesterFieldHeader pa-0 font-weight-bold vertical-header"
                            >
                              ពិន្ទុសរុប
                            </th>

                            <!-- ពិន្ទុឆមាសសរុប -->
                            <th
                              rowspan="2"
                              v-if="
                                form.type == 'semester1' ||
                                form.type == 'semester2'
                              "
                              style="height: 0px; width: 2%"
                              class="text-center pa-0 font-weight-bold semesterFieldHeader vertical-header"
                            >
                              ពិន្ទុ.ឆ.ស
                            </th>

                            <!-- មធ្យមភាគឆមាស -->
                            <th
                              rowspan="2"
                              v-if="
                                form.type == 'semester1' ||
                                form.type == 'semester2'
                              "
                              style="height: 0px; width: 2%"
                              class="text-center semesterFieldHeader pa-0 font-weight-bold vertical-header"
                            >
                              ម.ឆមាស
                            </th>

                            <!-- មធ្យមភាគប្រចាំខែ -->
                            <th
                              rowspan="2"
                              v-if="form.type == 'month'"
                              style="height: 0px; width: 2%"
                              class="text-center pa-0 semesterFieldHeader font-weight-bold vertical-header"
                            >
                              មធ្យមភាគ
                            </th>

                            <!-- ចំណាត់ថ្នាក់ប្រចាំខែ -->
                            <th
                              rowspan="2"
                              v-if="form.type == 'month'"
                              style="height: 0px; width: 2%"
                              class="text-center subjectRankHeader font-weight-bold vertical-header"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- ចំណាត់ខែប្រចាំឆមាស -->
                            <th
                              rowspan="2"
                              v-if="
                                form.type == 'semester1' ||
                                form.type == 'semester2'
                              "
                              style="height: 0px; width: 1%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            >
                              ចំ.ឆមាស
                            </th>

                            <!-- មធ្យមខែឆមាស(៣ខែ) -->
                            <th
                              rowspan="2"
                              v-if="
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
                              "
                              style="height: 0px; width: 2%"
                              class="text-center semesterFieldHeader pa-0 font-weight-bold vertical-header"
                            >
                              ម.ខែឆមាស
                            </th>

                            <!-- ចំណាត់ថ្នាក់ខែឆមាស(៣ខែ) -->
                            <th
                              rowspan="2"
                              v-if="
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
                              "
                              style="height: 0px; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            >
                              ចំ.ខែឆមាស
                            </th>

                            <!-- មធ្យមភាគប្រចាំឆមាសទី១ -->
                            <th
                              rowspan="2"
                              v-if="
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
                              "
                              style="height: 0px; width: 2%"
                              class="text-center pa-0 semesterFieldHeader font-weight-bold vertical-header"
                            >
                              ម.ពិន្ទុឆមាស
                            </th>

                            <!-- ចំណាត់ថ្នាក់ប្រចាំឆមាស -->
                            <th
                              rowspan="2"
                              v-if="
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
                              "
                              style="height: 0px; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            >
                              ចំ.ប្រចាំឆមាស
                            </th>
                            <!-- <th colspan="3" class="text-center">
                            លទ្ធផលប្រឡងតាមមុខវិជ្ជា
                          </th> -->
                            <th
                              colspan="3"
                              style="height: 0px; width: 8%"
                              class="text-center semesterFieldHeader font-weight-bold"
                            >
                              លទ្ធផលឆមាសទី១
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0px; width: 2%"
                              class="text-center semesterFieldHeader vertical-header font-weight-bold"
                            >
                              ខែមធ្យមភាគ
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0px; width: 1%"
                              class="text-center subjectRankHeader vertical-header font-weight-bold"
                            >
                              ចំ.ខែឆមាស
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0px; width: 2%"
                              class="text-center semesterFieldHeader vertical-header font-weight-bold"
                            >
                              មធ្យមឆមាស
                            </th>
                            <th
                              rowspan="2"
                              style="height: 0px; width: 1%"
                              class="text-center subjectRankHeader vertical-header font-weight-bold"
                            >
                              ចំ.ឆមាស
                            </th>
                            <th
                              rowspan="2"
                              :style="
                                form.type == 'month' ? 'width:7%' : 'width:8%'
                              "
                              style="height: 0px"
                              class="text-center semesterFieldHeader font-weight-bold"
                            >
                              និទ្ទេសន៍
                            </th>
                          </tr>
                          <tr>
                            <th
                              style="height: 0px; width: 3%"
                              class="text-center semesterFieldHeader font-weight-bold"
                            >
                              ពិន្ទុសរុប
                            </th>
                            <th
                              style="height: 0px; width: 2%"
                              class="text-center semesterFieldHeader font-weight-bold"
                            >
                              មធ្យម
                            </th>
                            <th
                              style="height: 0px; width: 1%"
                              class="text-center subjectRankHeader px-1 font-weight-bold"
                            >
                              ចំ
                            </th>
                          </tr>
                        </template>

                        <template v-else>
                          <tr style="font-size: 10px">
                            <th
                              style="height: 0px; width: 1%"
                              class="text-center pa-0 font-weight-bold"
                            >
                              ល.រ
                            </th>
                            <th
                              :style="
                                form.type == 'month' ? 'width:7%' : 'width:10%'
                              "
                              style="height: 59px"
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

                            <!-- listen -->
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              ស្ដាប់
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- speaking -->
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              និយាយ
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- reading -->
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              អំណាន
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- writing -->
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              សរសេរ
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="
                                form.type != 'month' &&
                                form.level != 1 &&
                                form.level != 2
                              "
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- essay -->
                            <th
                              v-if="form.level != 1 && form.level != 2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              តែងសេចក្ដី
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="
                                form.type != 'month' &&
                                form.level != 1 &&
                                form.level != 2
                              "
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- grammar -->
                            <th
                              v-if="form.level != 1 && form.level != 2"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              វេយ្យាករណ៍
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- math -->
                            <th
                              style="height: 0%; width: 2%"
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

                            <!-- chemistry -->
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              វិទ្យាសាស្រ្ត
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- physical -->
                            <th
                              style="height: 0%; width: 2%"
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

                            <!-- history -->
                            <th
                              style="height: 0%; width: 2%"
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

                            <!-- morality -->
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              សីលធម៍
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- art -->
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              គំនូរ
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- word -->
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              អក្សរផ្ចង់
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
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              អប់រំកាយ
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4 &&
                                form.type != 'month'
                              "
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- homework -->
                            <th
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4
                              "
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              កិច្ចការផ្ទះ
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4 &&
                                form.type != 'month'
                              "
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- healthy -->
                            <th
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4
                              "
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              អនាម័យ
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- steam -->
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              STEAM
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month'"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- Khmer -->
                            <th
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              ភាសារខ្មែរ
                            </th>
                            <th
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              មធ្យមខ្មែរ
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- សិក្សាសង្គម -->
                            <th
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              សិក្សាសង្គម
                            </th>
                            <th
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0%; width: 2%"
                              class="text-center pa-0 font-weight-bold vertical-header"
                            >
                              មធ្យមសង្គម
                            </th>
                            <th
                              style="height: 0%; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- total_score -->
                            <th
                              v-if="form.type == 'month'"
                              style="height: 0px; width: 2%"
                              class="text-center semesterFieldHeader pa-0 font-weight-bold vertical-header"
                            >
                              ពិន្ទុសរុប
                            </th>

                            <!-- ពិន្ទុឆមាសសរុប -->
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

                            <!-- មធ្យមភាគឆមាស -->
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

                            <!-- មធ្យមភាគប្រចាំខែ -->
                            <th
                              v-if="form.type == 'month'"
                              style="height: 0px; width: 2%"
                              class="text-center pa-0 semesterFieldHeader font-weight-bold vertical-header"
                            >
                              មធ្យមភាគ
                            </th>

                            <!-- ចំណាត់ថ្នាក់ប្រចាំខែ -->
                            <th
                              v-if="form.type == 'month'"
                              style="height: 0px; width: 2%"
                              class="text-center subjectRankHeader font-weight-bold vertical-header"
                            >
                              ចំ.ថ្នាក់
                            </th>

                            <!-- ចំណាត់ខែប្រចាំឆមាស -->
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
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
                              "
                              style="height: 0px; width: 2%"
                              class="text-center semesterFieldHeader pa-0 font-weight-bold vertical-header"
                            >
                              ម.ខែឆមាស
                            </th>

                            <!-- ចំណាត់ថ្នាក់ខែឆមាស(៣ខែ) -->
                            <th
                              v-if="
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
                              "
                              style="height: 0px; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            >
                              ចំ.ខែឆមាស
                            </th>

                            <!-- មធ្យមភាគប្រចាំឆមាសទី១ -->
                            <th
                              v-if="
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
                              "
                              style="height: 0px; width: 2%"
                              class="text-center pa-0 semesterFieldHeader font-weight-bold vertical-header"
                            >
                              ម.ពិន្ទុឆមាស
                            </th>

                            <!-- ចំណាត់ថ្នាក់ប្រចាំឆមាស -->
                            <th
                              v-if="
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
                              "
                              style="height: 0px; width: 2%"
                              class="text-center subjectRankHeader pa-0 font-weight-bold vertical-header"
                            >
                              ចំ.ប្រចាំឆមាស
                            </th>
                            <!-- <th colspan="3" class="text-center">
                            លទ្ធផលប្រឡងតាមមុខវិជ្ជា
                          </th> -->
                            <th
                              :style="
                                form.type == 'month' ? 'width:5%' : 'width:5%'
                              "
                              style="height: 0px"
                              class="text-center semesterFieldHeader font-weight-bold"
                            >
                              និទ្ទេសន៍
                            </th>
                          </tr>
                        </template>

                        <tbody
                          class="customFont text-center"
                          style="font-size: 11px"
                        >
                          <tr v-for="(item, idx) in reportData" :key="idx">
                            <td style="height: 0; padding: 1px">
                              {{ idx + 1 }}
                            </td>
                            <td style="height: 0; text-align: left">
                              {{ item.kh_name }}
                            </td>
                            <td class="customFont pa-0" style="height: 0">
                              <p v-if="item.gender == 1 || item.gender == 'M'">
                                ប
                              </p>
                              <p
                                v-else-if="
                                  item.gender == 2 || item.gender == 'F'
                                "
                              >
                                ស
                              </p>
                            </td>

                            <!-- listent -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.listent }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
                              :class="
                                item.rankListent == 1 ||
                                item.rankListent == 2 ||
                                item.rankListent == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankListent }}
                            </td>

                            <!-- speaking -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.speaking }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
                              :class="
                                item.rankSpeaking == 1 ||
                                item.rankSpeaking == 2 ||
                                item.rankSpeaking == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankSpeaking }}
                            </td>

                            <!-- reading -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.reading }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
                              :class="
                                item.rankReading == 1 ||
                                item.rankReading == 2 ||
                                item.rankReading == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankReading }}
                            </td>

                            <!-- writing -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.writing }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
                              :class="
                                item.rankWriting == 1 ||
                                item.rankWriting == 2 ||
                                item.rankWriting == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankWriting }}
                            </td>

                            <!-- essah -->
                            <td
                              v-if="form.level != 1 && form.level != 2"
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.essay }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="
                                form.type != 'month' &&
                                form.level != 1 &&
                                form.level != 2
                              "
                              :class="
                                item.rankEssay == 1 ||
                                item.rankEssay == 2 ||
                                item.rankEssay == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankEssay }}
                            </td>

                            <!-- grammar -->
                            <td
                              v-if="form.level != 1 && form.level != 2"
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.grammar }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="
                                form.type != 'month' &&
                                form.level != 1 &&
                                form.level != 2
                              "
                              :class="
                                item.rankGrammar == 1 ||
                                item.rankGrammar == 2 ||
                                item.rankGrammar == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankGrammar }}
                            </td>

                            <!-- math -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                              :class="
                                form.type != 'month' && form.level == 6
                                  ? 'field'
                                  : ''
                              "
                            >
                              {{ item.math }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
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

                            <!-- chemistry -->
                            <td
                              :class="
                                form.type != 'month' && form.level == 6
                                  ? 'field'
                                  : ''
                              "
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.chemistry }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
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

                            <!-- physical -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.physical }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
                              :class="
                                item.rankPhysical == 1 ||
                                item.rankPhysical == 2 ||
                                item.rankPhysical == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankPhysical }}
                            </td>

                            <!-- history -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.history }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
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

                            <!-- morality -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.morality }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
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

                            <!-- art -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.art }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
                              :class="
                                item.rankArt == 1 ||
                                item.rankArt == 2 ||
                                item.rankArt == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankArt }}
                            </td>

                            <!-- word -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.word }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
                              :class="
                                item.rankWord == 1 ||
                                item.rankWord == 2 ||
                                item.rankWord == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankWord }}
                            </td>

                            <!-- pe -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.pe }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
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

                            <!-- homework -->
                            <td
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4
                              "
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.homework }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="
                                form.type != 'month' &&
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4
                              "
                              :class="
                                item.rankHomework == 1 ||
                                item.rankHomework == 2 ||
                                item.rankHomework == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankHomework }}
                            </td>

                            <!-- healthy -->
                            <td
                              v-if="
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4
                              "
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.healthy }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="
                                form.type != 'month' &&
                                form.level != 1 &&
                                form.level != 2 &&
                                form.level != 3 &&
                                form.level != 4
                              "
                              :class="
                                item.rankHealthy == 1 ||
                                item.rankHealthy == 2 ||
                                item.rankHealthy == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankHealthy }}
                            </td>

                            <!-- steam -->
                            <td
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.steam }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month'"
                              :class="
                                item.rankSteam == 1 ||
                                item.rankSteam == 2 ||
                                item.rankSteam == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankSteam }}
                            </td>

                            <!-- khmer -->
                            <td
                              :class="form.type != 'month' ? 'field' : ''"
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.khmer }}
                            </td>
                            <td
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0; padding: 0"
                              class="text-center field"
                            >
                              {{ item.averageKhmer }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month' && form.level == 6"
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

                            <!-- សិក្សាសង្គម -->
                            <td
                              :class="form.type != 'month' ? 'field' : ''"
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0; padding: 0"
                              class="text-center"
                            >
                              {{ item.social_scient }}
                            </td>
                            <td
                              v-if="form.type != 'month' && form.level == 6"
                              style="height: 0; padding: 0"
                              class="text-center field"
                            >
                              {{ item.averageSocial }}
                            </td>
                            <td
                              style="height: 0; padding: 0"
                              class="text-center subjectRank bg-deep-orange-lighten-4"
                              v-if="form.type != 'month' && form.level == 6"
                              :class="
                                item.rankSocial == 1 ||
                                item.rankSocial == 2 ||
                                item.rankSocial == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankSocial }}
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
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
                              "
                            >
                              {{ item.average_3_month }}
                            </td>

                            <!-- ចំណាត់ថ្នាក់ខែឆមាស(៣ខែ) -->
                            <td
                              class="subjectRank"
                              v-if="
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
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
                              v-if="form.type == 'semester1' && form.level != 6"
                              style="height: 0; text-align: center; padding: 0"
                            >
                              {{ item.average_semester1 }}
                            </td>
                            <td
                              class="semesterField"
                              v-if="form.type == 'semester2' && form.level != 6"
                              style="height: 0; text-align: center; padding: 0"
                            >
                              {{ item.average_semester2 }}
                            </td>

                            <!-- ចំណាត់ថ្នាក់ប្រចាំឆមាស -->
                            <td
                              class="subjectRank"
                              v-if="
                                (form.type == 'semester1' ||
                                  form.type == 'semester2') &&
                                form.level != 6
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
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              <!-- khmer +chemistry+math+social -->
                              {{ item.total_score_kcms }}
                            </td>
                            <td
                              class="semesterField"
                              style="height: 0; text-align: center; padding: 0"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              {{ item.average_kcms }}
                            </td>
                            <td
                              :class="
                                item.rankKcms == 1 ||
                                item.rankKcms == 2 ||
                                item.rankKcms == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              {{ item.rankKcms }}
                            </td>
                            <td
                              class="semesterField"
                              style="height: 0; text-align: center; padding: 0"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              {{ item.average_3_month }}
                            </td>
                            <td
                              :class="
                                item.rank_3_month == 1 ||
                                item.rank_3_month == 2 ||
                                item.rank_3_month == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              {{ item.rank_3_month }}
                            </td>
                            <td
                              class="semesterField"
                              style="height: 0; text-align: center; padding: 0"
                              v-if="
                                form.type != 'month' &&
                                form.level == 6 &&
                                form.type == 'semester1'
                              "
                            >
                              {{ item.average_semester1 }}
                            </td>
                            <td
                              class="semesterField"
                              style="height: 0; text-align: center; padding: 0"
                              v-if="
                                form.type != 'month' &&
                                form.level == 6 &&
                                form.type == 'semester2'
                              "
                            >
                              {{ item.average_semester2 }}
                            </td>
                            <td
                              :class="
                                item.rank == 1 ||
                                item.rank == 2 ||
                                item.rank == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              v-if="form.type != 'month' && form.level == 6"
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
                      បាត់ដំបង, ថ្ងៃទី.......ខែ.............ឆ្នាំ<span>{{
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

                <VWindowItem
                  v-if="
                    form.level == '6' &&
                    form.type != 'month' &&
                    form.type != 'year'
                  "
                  value="semesterDetail"
                  id="semesterDetail"
                >
                  <div class="d-flex justify-end">
                    <VBtn
                      :loading="isDownload"
                      :disabled="isDownload"
                      id="about"
                      v-if="openDailog"
                      variant="tonal"
                      color="green"
                      class="customFont"
                      @click="printSemesterDetail"
                      prepend-icon="mdi-printer"
                      >បោះពុម្ភតារាងពិន្ទុ</VBtn
                    >
                  </div>

                  <VCol md="12" col="12" sm="12" style="margin-top: -50px">
                    <div
                      class="text-center moul headerFont customKhmerMoul text-green-darken-4"
                      style="font-size: 15px"
                    >
                      <p class="mb-2">ព្រះរាជាណាចក្រកម្ពុជា</p>
                      <p>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                    </div>
                  </VCol>

                  <VCol cols="12" md="12" sm="12" style="margin-top: -70px">
                    <div
                      class="d-flex flex-column text-center pic"
                      style="width: 30%"
                    >
                      <div class="img mx-auto" style="width: 40px">
                        <v-img class="logo" :src="dis"></v-img>
                      </div>
                      <div>
                        <p
                          style="font-size: 12px"
                          class="customKhmerMoul moul text-green-darken-4 mt-2"
                        >
                          សាលាចំណេះទូទៅអន្តរជាតិ ឌូវី
                        </p>
                      </div>
                    </div>
                    <div
                      class="moul text-end customKhmerMoul text-green-darken-4 grade"
                      style="margin-top: -30px"
                    >
                      <p style="font-size: 12px">
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
                      style="font-size: 12px"
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

                    <div style="margin-top: 2px">
                      <v-table
                        class="customFont battambang-thin table"
                        style="font-size: 11px; color: black; width: 100%"
                      >
                        <tr>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 3%"
                            class="text-center pa-0 font-weight-bold"
                          >
                            ល.រ
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 20%"
                            class="text-center pa-0 font-weight-bold"
                          >
                            គោត្តនាម និងនាម
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 3%"
                            class="text-center pa-0 font-weight-bold"
                          >
                            ភេទ
                          </th>
                          <th
                            style="height: 0px; width: 20%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold"
                            colspan="6"
                          >
                            មធ្យមភាគទាំងបីខែ
                          </th>

                          <th
                            rowspan="2"
                            style="height: 0px; width: 10%"
                            class="text-center pa-0 font-weight-bold"
                          >
                            មធ្យមភាគប្រឡងឆមាស
                          </th>

                          <th
                            rowspan="2"
                            style="height: 0px; width: 5%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold"
                          >
                            ចំណាត់ថ្នាក់
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 10%"
                            class="text-center pa-0 font-weight-bold"
                          >
                            មធ្យមភាគប្រចាំខែទាំង៣
                          </th>
                          <th
                            rowspan="2"
                            style="height: 0px; width: 5%"
                            class="text-center pa-0 font-weight-bold subjectRankHeader"
                          >
                            ចំណាត់ថ្នាក់
                          </th>

                          <th
                            rowspan="2"
                            style="height: 0px; width: 9%"
                            class="text-center pa-0 font-weight-bold"
                          >
                            មធ្យមភាគប្រចាំឆមាស
                          </th>

                          <th
                            rowspan="2"
                            style="height: 0px; width: 5%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold"
                          >
                            ចំណាត់ថ្នាក់
                          </th>
                        </tr>
                        <tr v-if="form.type == 'semester1'">
                          <template
                            v-for="m in reportData[0].months_config1.monthName"
                            :key="m"
                          >
                            <th
                              class="font-weight-bold pt-1 semesterFieldHeader"
                            >
                              {{ m }}
                            </th>
                            <th class="font-weight-bold subjectRankHeader">
                              ចំ
                            </th>
                          </template>
                        </tr>
                        <tr v-if="form.type == 'semester2'">
                          <template
                            v-for="m in reportData[0].months_config2.monthName"
                            :key="m"
                          >
                            <th
                              class="font-weight-bold pt-1 semesterFieldHeader"
                            >
                              {{ m }}
                            </th>
                            <th class="font-weight-bold subjectRankHeader">
                              ចំ
                            </th>
                          </template>
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
                            <template
                              v-if="form.type == 'semester1'"
                              v-for="m in item.months_config1.monthName"
                              :key="m"
                            >
                              <td
                                style="height: 0; padding: 1px"
                                class="semesterField"
                              >
                                {{ item.months1[m].average }}
                              </td>
                              <td
                                class="subjectRank"
                                style="height: 0; padding: 1px"
                                :class="
                                  item.months1[m].rank == 1 ||
                                  item.months1[m].rank == 2 ||
                                  item.months1[m].rank == 3
                                    ? 'text-red font-weight-bold'
                                    : 'text-black'
                                "
                              >
                                {{ item.months1[m].rank }}
                              </td>
                            </template>

                            <template
                              v-if="form.type == 'semester2'"
                              v-for="m in item.months_config2.monthName"
                              :key="m"
                            >
                              <td
                                style="height: 0; padding: 1px"
                                class="semesterField"
                              >
                                {{ item.months2[m].average }}
                              </td>
                              <td
                                class="subjectRank"
                                style="height: 0; padding: 1px"
                                :class="
                                  item.months2[m].rank == 1 ||
                                  item.months2[m].rank == 2 ||
                                  item.months2[m].rank == 3
                                    ? 'text-red font-weight-bold'
                                    : 'text-black'
                                "
                              >
                                {{ item.months2[m].rank }}
                              </td>
                            </template>
                            <td
                              style="height: 0; text-align: center; padding: 0"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              {{ item.average_kcms }}
                            </td>
                            <td
                              :class="
                                item.rankKcms == 1 ||
                                item.rankKcms == 2 ||
                                item.rankKcms == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              v-if="form.type != 'month' && form.level == 6"
                            >
                              {{ item.rankKcms }}
                            </td>
                            <td style="height: 0; padding: 0">
                              {{ item.average_3_month }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rank_month_semester == 1 ||
                                item.rank_month_semester == 2 ||
                                item.rank_month_semester == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rank_3_month }}
                            </td>
                            <td
                              style="height: 0; text-align: center; padding: 0"
                              v-if="form.type == 'semester1'"
                            >
                              {{ item.average_semester1 }}
                            </td>
                            <td
                              style="height: 0; text-align: center; padding: 0"
                              v-if="form.type == 'semester2'"
                            >
                              {{ item.average_semester2 }}
                            </td>
                            <td
                              class="subjectRank"
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
                      បាត់ដំបង, ថ្ងៃទី.......ខែ.............ឆ្នាំ<span>{{
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

                <VWindowItem
                  v-if="form.type == 'year'"
                  value="yearDetail"
                  id="yearDetail"
                >
                  <div class="d-flex justify-end">
                    <VBtn
                      :loading="isDownload"
                      :disabled="isDownload"
                      id="about"
                      v-if="openDailog"
                      variant="tonal"
                      color="green"
                      class="customFont"
                      @click="printYearDetail"
                      prepend-icon="mdi-printer"
                      >បោះពុម្ភតារាងពិន្ទុ</VBtn
                    >
                  </div>

                  <VCol md="12" col="12" sm="12" style="margin-top: -50px">
                    <div
                      class="text-center moul headerFont customKhmerMoul text-green-darken-4"
                      style="font-size: 15px"
                    >
                      <p class="mb-2">ព្រះរាជាណាចក្រកម្ពុជា</p>
                      <p>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                    </div>
                  </VCol>

                  <VCol cols="12" md="12" sm="12" style="margin-top: -70px">
                    <div
                      class="d-flex flex-column text-center pic"
                      style="width: 30%"
                    >
                      <div class="img mx-auto" style="width: 40px">
                        <v-img class="logo" :src="dis"></v-img>
                      </div>
                      <div>
                        <p
                          style="font-size: 12px"
                          class="customKhmerMoul moul text-green-darken-4 mt-2"
                        >
                          សាលាចំណេះទូទៅអន្តរជាតិ ឌូវី
                        </p>
                      </div>
                    </div>
                    <div
                      class="moul text-end customKhmerMoul text-green-darken-4 grade"
                      style="margin-top: -30px"
                    >
                      <p style="font-size: 12px">
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
                      style="font-size: 12px"
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

                    <div style="margin-top: 2px">
                      <Vtable
                        class="customFont battambang-thin table"
                        style="font-size: 12px; color: black; width: 100%"
                      >
                        <tr>
                          <th
                            rowspan="2"
                            style="
                              height: 0px;
                              width: 2%;
                              vertical-align: middle;
                            "
                            class="text-center pa-0 font-weight-bold"
                          >
                            ល.រ
                          </th>
                          <th
                            rowspan="2"
                            style="
                              height: 0px;
                              width: 15%;
                              vertical-align: middle;
                            "
                            class="text-center text-align-center pa-0 font-weight-bold"
                          >
                            គោត្តនាម និងនាម
                          </th>
                          <th
                            rowspan="2"
                            style="
                              height: 0px;
                              width: 2%;
                              vertical-align: middle;
                            "
                            class="text-center pa-0 font-weight-bold"
                          >
                            ភេទ
                          </th>
                          <th
                            style="height: 0px; width: 24%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold"
                            colspan="10"
                          >
                            ឆមាសទី១
                          </th>
                          <th
                            style="height: 0px; width: 24%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold"
                            colspan="10"
                          >
                            ឆមាសទី២
                          </th>
                          <th
                            style="height: 0px; width: 40%"
                            class="text-center subjectRankHeader pa-0 font-weight-bold"
                            colspan="8"
                          >
                            ប្រចាំឆ្នាំ
                          </th>
                        </tr>
                        <tr>
                          <th class="font-weight-bold py-1 semesterFieldHeader">
                            គណិត
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>
                          <th class="font-weight-bold semesterFieldHeader">
                            វិទ្យាសាស្រ្ត
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>
                          <th class="font-weight-bold semesterFieldHeader">
                            សង្គម
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>
                          <th class="font-weight-bold semesterFieldHeader">
                            ខ្មែរ
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>

                          <th class="font-weight-bold semesterFieldHeader">
                            ពិន្ទុសរុប
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>

                          <th class="font-weight-bold semesterFieldHeader">
                            គណិត
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>
                          <th class="font-weight-bold semesterFieldHeader">
                            វិទ្យាសាស្រ្ត
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>
                          <th class="font-weight-bold semesterFieldHeader">
                            សង្គម
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>
                          <th class="font-weight-bold semesterFieldHeader">
                            ខ្មែរ
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>

                          <th class="font-weight-bold semesterFieldHeader">
                            ពិន្ទុសរុប
                          </th>
                          <th class="font-weight-bold subjectRankHeader px-1">
                            ចំ
                          </th>

                          <th class="font-weight-bold" style="width: 7%">
                            មធ្យមឆមាស១
                          </th>
                          <th
                            style="width: 2%"
                            class="font-weight-bold subjectRankHeader"
                          >
                            ចំ
                          </th>
                          <th class="font-weight-bold" style="width: 7%">
                            មធ្យមឆមាស២
                          </th>
                          <th
                            style="width: 2%"
                            class="font-weight-bold subjectRankHeader"
                          >
                            ចំ
                          </th>
                          <th class="font-weight-bold" style="width: 7%">
                            មធ្យមខែក្នុង១ឆ្នាំ
                          </th>
                          <th
                            style="width: 2%"
                            class="font-weight-bold subjectRankHeader"
                          >
                            ចំ
                          </th>
                          <th class="font-weight-bold" style="width: 9%">
                            មធ្យមប្រចាំឆ្នាំ
                          </th>
                          <th
                            style="width: 4%"
                            class="subjectRankHeader font-weight-bold px-2"
                          >
                            ចំ
                          </th>
                        </tr>
                        <tbody class="customFont text-center">
                          <tr v-for="(item, idx) in reportData" :key="idx">
                            <td style="height: 0; padding: 1px">
                              {{ idx + 1 }}
                            </td>
                            <td
                              style="
                                height: 0;
                                text-align: left;
                                padding-left: 6px;
                              "
                            >
                              {{ item.kh_name }}
                            </td>
                            <td class="customFont pa-0" style="height: 0">
                              <p v-if="item.gender == 1 || item.gender == 'M'">
                                ប
                              </p>
                              <p
                                v-else-if="
                                  item.gender == 2 || item.gender == 'F'
                                "
                              >
                                ស
                              </p>
                            </td>
                            <td class="semesterField">
                              {{ item.math1 }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankMath1 == 1 ||
                                item.rankMath1 == 2 ||
                                item.rankMath1 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankMath1 }}
                            </td>

                            <td class="semesterField">
                              {{ item.chemistry1 }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankChemistry1 == 1 ||
                                item.rankChemistry1 == 2 ||
                                item.rankChemistry1 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankChemistry1 }}
                            </td>

                            <td class="semesterField">
                              {{ item.social1 }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankSocial1 == 1 ||
                                item.rankSocial1 == 2 ||
                                item.rankSocial1 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankSocial1 }}
                            </td>

                            <td class="semesterField">
                              {{ item.khmer1 }}
                            </td>
                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankKhmer1 == 1 ||
                                item.rankKhmer1 == 2 ||
                                item.rankKhmer1 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankKhmer1 }}
                            </td>

                            <td class="semesterField">
                              {{ item.total_score_kcms1 }}
                            </td>
                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankKcms1 == 1 ||
                                item.rankKcms1 == 2 ||
                                item.rankKcms1 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankKcms1 }}
                            </td>

                            <td class="semesterField">
                              {{ item.math2 }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankMath2 == 1 ||
                                item.rankMath2 == 2 ||
                                item.rankMath2 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankMath2 }}
                            </td>

                            <td class="semesterField">
                              {{ item.chemistry2 }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankChemistry2 == 1 ||
                                item.rankChemistry2 == 2 ||
                                item.rankChemistry2 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankChemistry2 }}
                            </td>

                            <td class="semesterField">
                              {{ item.social2 }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankSocial2 == 1 ||
                                item.rankSocial2 == 2 ||
                                item.rankSocial2 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankSocial2 }}
                            </td>

                            <td class="semesterField">
                              {{ item.khmer2 }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankKhmer2 == 1 ||
                                item.rankKhmer2 == 2 ||
                                item.rankKhmer2 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankKhmer2 }}
                            </td>

                            <td class="semesterField">
                              {{ item.total_score_kcms2 }}
                            </td>
                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankKcms2 == 1 ||
                                item.rankKcms2 == 2 ||
                                item.rankKcms2 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankKcms2 }}
                            </td>

                            <td>
                              {{ item.average_kcms1 }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankKcms1 == 1 ||
                                item.rankKcms1 == 2 ||
                                item.rankKcms1 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankKcms1 }}
                            </td>

                            <td>
                              {{ item.average_kcms2 }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankKcms2 == 1 ||
                                item.rankKcms2 == 2 ||
                                item.rankKcms2 == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankKcms2 }}
                            </td>

                            <td>
                              {{ item.allMonthAvg }}
                            </td>

                            <td
                              class="subjectRank"
                              style="height: 0; text-align: center; padding: 0"
                              :class="
                                item.rankAllMonth == 1 ||
                                item.rankAllMonth == 2 ||
                                item.rankAllMonth == 3
                                  ? 'text-red font-weight-bold'
                                  : 'text-black'
                              "
                            >
                              {{ item.rankAllMonth }}
                            </td>

                            <td>
                              {{ item.average_year }}
                            </td>

                            <td
                              class="subjectRank"
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
                          </tr>
                        </tbody>
                      </Vtable>
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
                      បាត់ដំបង, ថ្ងៃទី.......ខែ.............ឆ្នាំ<span>{{
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
  border: 1px solid black;
}

table,
td {
  border: 1px solid grey;
  border-collapse: collapse;
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

.vertical-header {
  writing-mode: vertical-rl; /* vertical text */
  transform: rotate(180deg); /* upright text */
  white-space: nowrap; /* no wrapping */
}
.subjectRank {
  background-color: #f8e0d8 !important;
}
.semesterField {
  background-color: #c8e6c9;
}
.subjectRankHeader {
  background-color: #ffbda9 !important;
}
.semesterFieldHeader {
  background-color: #81c784;
}

.field {
  background-color: #ffffb1;
}
</style>
