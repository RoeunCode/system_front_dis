<script setup>
import { ref, watch } from "vue";
import { useStore } from "@/store";
import Profile from "./Profile.vue";
import Theme from "./Theme.vue";
import { useRouter } from "vue-router";
const router = useRouter();
import Swal from "sweetalert2";
import Toast from "@/helper";
import NavbarCampus from "./navbarCampus.vue";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);
const shortNameCam = ref("hello");

console.log("short", campus_id.value);

watch(
  () => settingStore.campus_id,
  (n) => {
    if (n == 1) {
      shortNameCam.value = "ICONIC";
    } else if (n == 2) {
      shortNameCam.value = "OCHAR";
    } else if (n == 3) {
      shortNameCam.value = "BMC";
    } else {
      shortNameCam.value = "គ្រប់សាខា";
    }
  },
  { immediate: true } // run once on mount
);

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));

const user_role_id = ref(parseInt(user.value.role_id));

const userEmail = ref(user.value.email);

const authStore = useStore();

const handleLogout = async () => {
  Swal.fire({
    title: "តើអ្នកប្រាកដដែរឬទេថាចង់ចាកចេញ?",
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
      await authStore.logout();
      router.push("/");
    }
  });
};

const drawer = ref(true);

const lists = ref([
  // { text: "ផ្ទាំងគ្រប់គ្រង", icon: "mdi-view-dashboard", name: "Dashboard" },
  {
    text: "គ្រូបង្រៀន",
    icon: "mdi-human-male-board",
    name: "TeacherList",
    permission: [1, 2, 3],
  },
  {
    text: "មុខវិជ្ជា",
    icon: "mdi-book",
    name: "SubjectList",
    permission: [1, 2, 3],
  },

  {
    text: "ឆ្នាំសិក្សា",
    icon: "mdi-calendar-clock",
    name: "AcademicYearList",
    permission: [1, 2],
  },
  {
    text: "អាណាព្យាបាល",
    icon: "mdi-account-group",
    name: "ParentList",
    permission: [1, 2, 3],
  },
]);

const routeClick = (route1) => {
  if (!route1.name) {
    console.log(route1);
    router.push({ name: route1 });
  } else {
    router.push({ name: route1.name });
  }
};
console.log(typeof user_role_id.value);
</script>
<template>
  <div>
    <v-navigation-drawer
      class="bg-grey-lighten-4 py-2"
      v-model="drawer"
      :width="225"
    >
      <v-list-item
        class="text-center mt-2 mx-1 rounded-lg cursor-pointer"
        variant="outlined"
      >
        <VMenu location="right" transition="scale-transition">
          <template v-slot:activator="{ props }">
            <VListItemTitle class="text-h6" v-bind="props"> + </VListItemTitle>
          </template>

          <v-card
            elevation="4"
            class="pa-4 border border-5 customFont"
            style="margin-left: 25px; margin-top: -20px; width: 55%"
          >
            <v-row>
              <v-col cols="12" md="6" v-if="[1, 2, 3].includes(user_role_id)">
                <v-btn
                  variant="outlined"
                  @click="routeClick('CreateStudent')"
                  class="w-100"
                  color="green-darken-4"
                  style="font-size: 15px"
                >
                  បង្កើតសិស្ស
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" v-if="[1, 2, 3].includes(user_role_id)">
                <v-btn
                  variant="outlined"
                  @click="routeClick('CreateTeacher')"
                  class="w-100"
                  color="green-darken-4"
                  style="font-size: 15px"
                  >បង្កើតគ្រូបង្រៀន</v-btn
                >
              </v-col>
              <v-col cols="12" md="6" v-if="[1, 2, 3].includes(user_role_id)">
                <v-btn
                  variant="outlined"
                  @click="routeClick('CreateRoom')"
                  class="w-100"
                  color="green-darken-4"
                  style="font-size: 15px"
                  >បង្កើតបន្ទប់</v-btn
                >
              </v-col>
              <v-col cols="12" md="6" v-if="[1, 2, 3].includes(user_role_id)">
                <v-btn
                  variant="outlined"
                  @click="routeClick('CreateGrade')"
                  class="w-100"
                  color="green-darken-4"
                  style="font-size: 15px"
                  >បង្កើតកម្រិតថ្នាក់</v-btn
                >
              </v-col>
              <v-col cols="12" md="6" v-if="[1, 2, 3].includes(user_role_id)">
                <v-btn
                  variant="outlined"
                  @click="routeClick('CreateClassroom')"
                  class="w-100"
                  color="green-darken-4"
                  style="font-size: 15px"
                  >បង្កើតថ្នាក់រៀន</v-btn
                >
              </v-col>
              <v-col cols="12" md="6" v-if="[1, 2].includes(user_role_id)">
                <v-btn
                  variant="outlined"
                  @click="routeClick('CreateAcademicYear')"
                  class="w-100"
                  color="green-darken-4"
                  style="font-size: 15px"
                  >បង្កើតឆ្នាំសិក្សា</v-btn
                >
              </v-col>
              <v-col cols="12" md="6" v-if="[1, 2].includes(user_role_id)">
                <v-btn
                  variant="outlined"
                  @click="routeClick('CreateUser')"
                  class="w-100"
                  color="green-darken-4"
                  style="font-size: 15px"
                  >បង្កើតអ្នកប្រើប្រាស់</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </VMenu>
      </v-list-item>

      <v-list>
        <v-list-item
          v-if="[1, 2, 3].includes(user_role_id)"
          color="green-darken-4"
          value="Dashboard"
          @click="routeClick('Dashboard')"
          prepend-icon="mdi-view-dashboard"
          title="ផ្ទាំងគ្រប់គ្រង"
          class="customFont text-body-4 mt-1 py-1 mx-1 rounded-lg"
        ></v-list-item>
        <!-- Student -->
        <v-list-group fluid v-if="[1, 2, 3].includes(user_role_id)">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-school"
              title="សិស្ស"
              color="green-darken-4"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            ></v-list-item>
          </template>

          <div class="pl-3">
            <v-list-item
              title="បញ្ជីសិស្ស"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
              prepend-icon="mdi-plus"
              color="green-darken-4"
              value="StudentList"
              @click="routeClick('StudentList')"
            >
              <v-tooltip
                activator="parent"
                class="customFont"
                color="green"
                location="end"
                >បញ្ជីសិស្សទាំងអស់</v-tooltip
              >
            </v-list-item>

            <v-list-item
              value="CreateStudent"
              color="green-darken-4"
              @click="routeClick('CreateStudent')"
              prepend-icon="mdi-plus"
              title="បង្កើតសិស្ស"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            ></v-list-item>

            <v-list-item
              color="green-darken-4"
              @click="routeClick('StudentDelete')"
              value="StudentDelete"
              prepend-icon="mdi-plus"
              title="សិស្សលុប"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            ></v-list-item>
          </div>
        </v-list-group>

        <!-- classRoom -->
        <v-list-group fluid v-if="[1, 2, 3].includes(user_role_id)">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-home"
              title="ថ្នាក់រៀន"
              color="green-darken-4"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            ></v-list-item>
          </template>

          <div class="pl-3">
            <v-list-item
              value="ClassroomList"
              title="ថ្នាក់រៀន"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
              prepend-icon="mdi-plus"
              color="green-darken-4"
              @click="routeClick('ClassroomList')"
            ></v-list-item>

            <v-list-item
              color="green-darken-4"
              @click="routeClick('RoomList')"
              value="RoomList"
              prepend-icon="mdi-plus"
              title="បន្ទប់"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            ></v-list-item>

            <v-list-item
              color="green-darken-4"
              @click="routeClick('GradeList')"
              value="GradeList"
              prepend-icon="mdi-plus"
              title="កម្រិតថ្នាក់"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            ></v-list-item>
          </div>
        </v-list-group>

        <v-list-item
          value="ExamScore"
          color="green-darken-4"
          @click="routeClick('ExamScore')"
          prepend-icon="mdi-invoice-text"
          title="ពិន្ទុកម្មវិធីខ្មែរ"
          class="customFont text-body-4 mt-1 mx-1 rounded-lg"
        ></v-list-item>

        <v-list-item
          v-if="[1, 2, 3].includes(user_role_id)"
          color="green-darken-4"
          value="KhmerAttendance"
          @click="routeClick('KhmerAttendance')"
          prepend-icon="mdi-file-edit"
          title="អវត្តមានសិស្ស"
          class="customFont text-body-4 mt-1 mx-1 rounded-lg"
        ></v-list-item>

        <v-list-item
          v-for="(list, idex) in lists.filter(
            (item) =>
              item && item.permission && item.permission.includes(user_role_id)
          )"
          :key="idex"
          :value="list"
          color="green-darken-4"
          @click="routeClick(list)"
          class="customFont text-body-6 mt-1 mx-1 py-1 rounded-lg"
        >
          <template v-slot:prepend>
            <v-icon :icon="list.icon"></v-icon>
          </template>

          <v-list-item-title>
            {{ list.text }}
          </v-list-item-title>
        </v-list-item>

        <!-- របាយការណ៍កម្មវិធីខ្មែរ -->
        <v-list-group fluid v-if="[1, 2, 3].includes(user_role_id)">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-file-chart"
              title="របាយការណ៍កម្មវិធីខ្មែរ"
              color="green-darken-4"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            >
              <v-tooltip
                activator="parent"
                class="customFont"
                color="green"
                location="end"
                >របាយការណ៍កម្មវិធីខ្មែរ</v-tooltip
              >
            </v-list-item>
          </template>

          <div class="pl-3">
            <!-- របាយការណ៍កម្មវិធីខ្មែរ ថ្នាក់បឋម -->
            <v-list-item
              value="ReportPrimary"
              @click="routeClick('ReportPrimary')"
              prepend-icon="mdi-file"
              title="ថ្នាក់បឋម"
              color="green-darken-4"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            >
              <v-tooltip
                activator="parent"
                class="customFont"
                color="green"
                location="end"
                >ថ្នាក់បឋម</v-tooltip
              >
            </v-list-item>

            <!-- របាយការណ៍កម្មវិធីខ្មែរ ថ្នាក់អនុ -->
            <v-list-item
              value="ReportSecondary"
              prepend-icon="mdi-file"
              title="ថ្នាក់អនុវិទ្យាល័យ"
              color="green-darken-4"
              @click="routeClick('ReportSecondary')"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            >
              <v-tooltip
                activator="parent"
                class="customFont"
                color="green"
                location="end"
                >ថ្នាក់អនុវិទ្យាល័យ</v-tooltip
              >
            </v-list-item>
            <!-- របាយការណ៍កម្មវិធីខ្មែរ ថ្នាក់វិទ្យាល័យ -->

            <v-list-item
              value="ReportHighSchool"
              @click="routeClick('ReportHighSchool')"
              prepend-icon="mdi-file"
              title="ថ្នាក់វិទ្យាល័យ"
              color="green-darken-4"
              class="customFont text-body-4 mt-1 mx-1 rounded-lg"
            >
              <v-tooltip
                activator="parent"
                class="customFont"
                color="green"
                location="end"
                >ថ្នាក់វិទ្យាល័យ</v-tooltip
              >
            </v-list-item>
          </div>
        </v-list-group>

        <!-- setting -->
        <v-list-group
          fluid
          class="customFont"
          v-if="[1, 2].includes(user_role_id)"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-cog"
              title="ការកំណត់"
              color="green-darken-4"
              class="text-body-4 mt-1 mx-1 rounded-lg"
            ></v-list-item>
          </template>

          <div class="pl-3">
            <v-list-item
              value="UserList"
              title="អ្នកប្រើប្រាស់"
              class="text-body-4 mt-1 mx-1 rounded-lg"
              prepend-icon="mdi-plus"
              color="green-darken-4"
              @click="routeClick('UserList')"
            ></v-list-item>

            <v-list-item
              v-if="
                userEmail != 'admin_dis_ochar@gmail.com' &&
                userEmail != 'admin_dis_bmc@gmail.com'
              "
              value="Semester List"
              title="ការកំណត់ឆមាស"
              class="text-body-4 mt-1 mx-1 rounded-lg"
              prepend-icon="mdi-plus"
              color="green-darken-4"
              @click="routeClick('SemesterList')"
            >
            </v-list-item>
            <!-- 
            <v-list-item
              value="SettingScoreList"
              title="ការកំណត់តួរចែក"
              class="text-body-4 mt-1 mx-1 rounded-lg"
              prepend-icon="mdi-plus"
              color="green-darken-4"
              @click="routeClick('SettingScoreList')"
            ></v-list-item> -->

            <v-list-item
              value="Social Media"
              title="ប្រព័ន្ធផ្សព្វផ្សាយ"
              class="text-body-4 mt-1 mx-1 rounded-lg"
              prepend-icon="mdi-plus"
              color="green-darken-4"
              @click="routeClick('SocialList')"
            ></v-list-item>

            <!-- <v-list-item
              color="blue"
              @click="routeClick('TableList')"
              prepend-icon="mdi-plus"
              title="Table"
              class="text-body-4 mt-1 mx-1 rounded-lg"
            ></v-list-item> -->

            <!-- <v-list-item
              color="blue"
              @click="routeClick('UserList')"
              prepend-icon="mdi-account-multiple-plus"
              title="អ្នកប្រើប្រាស់"
              class="text-body-4 mt-1 mx-1 rounded-lg"
            ></v-list-item> -->
          </div>
        </v-list-group>
      </v-list>

      <v-divider></v-divider>

      <template v-slot:append>
        <div class="text-body-6 mt-1 mx-1 rounded-lg pa-3">
          <v-btn
            block
            class="bg-red-darken-4 customFont"
            @click="handleLogout()"
          >
            ចាកចេញ
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar elevation="0">
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- <v-app-bar-title class="customKhmerMoul text-size text-green-darken-4"
        >ប្រព័ន្ធគ្រប់គ្រងពិន្ទុសិស្ស</v-app-bar-title
      > -->
      <p class="customKhmerMoul text-size text-green-darken-4">
        ប្រព័ន្ធគ្រប់គ្រងពិន្ទុសិស្ស​ <span>({{ shortNameCam }})</span>
      </p>
      <v-spacer></v-spacer>

      <!-- Theme -->

      <div style="width: 15%" class="mt-5">
        <NavbarCampus />
      </div>
      <Theme />

      <!-- profile -->
      <Profile />
    </v-app-bar>
  </div>
</template>
<style scoped>
.text-size {
  font-size: 18px;
}

@media (max-width: 612px) {
  .text-size {
    font-size: 11px;
  }
}
</style>
