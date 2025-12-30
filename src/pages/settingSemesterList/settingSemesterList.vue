<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";
import { useRoute, useRouter } from "vue-router";

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));

const user_role_id = ref(parseInt(user.value.role_id));

const router = useRouter();

const route = useRoute();

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const semesters = ref([]);

const isloading = ref(false);

const getSemester = async () => {
  isloading.value = true;
  try {
    await api
      .post(`getSemesterList/${route.params.id}`, {
        campus_id: campus_id.value,
      })
      .then((res) => {
        console.log("res", res.data);
        semesters.value = res.data;
      });
  } catch (error) {
    console.log(error);
    isloading.value = false;
  } finally {
    isloading.value = false;
  }
};

const debouncedGetSemester = debounce(getSemester, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetSemester();
  },
  { immediate: true }
);

const deleteSemester = async (id) => {
  try {
    await api.post(`deleteSemester/${id}`).then((res) => {
      Toast.fire({
        title: res.data.message,
        icon: "success",
      });
    });
    getSemester();
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  }
};

const headers = ref([
  // {
  //   key: "id",
  //   title: "លេខរៀង",
  // },
  {
    key: "yearName",
    title: "ឆ្នាំសិក្សា",
  },
  {
    key: "edu_name",
    title: "កម្មវិធីសិក្សា",
  },
  {
    key: "level",
    title: "កម្រិតថ្នាក់",
  },
  {
    key: "semester_month1",
    title: "ឆមាសទី១",
  },
  {
    key: "three_months_semester1",
    title: "ខែឆមាសទី១",
  },
  {
    key: "semester_month2",
    title: "ឆមាសទី២",
  },
  {
    key: "three_months_semester2",
    title: "ខែឆមាសទី២",
  },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

const getId = async (id) => {
  router.push({
    name: "SettingSemesterCreate",
    params: { id },
  });
};

const routeToSocial = (id) => {
  router.push({
    name: "Social_detail",
    params: { id },
  });
};

const search = ref("");

onMounted(async () => {
  // await getAllUser();
  // console.log("user", user.value);
});
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="10" class="mt-4">
        <v-card elevation="0" class="pa-4 border">
          <v-row class="align-center">
            <v-col cols="12" md="6">
              <v-card-title
                style="font-size: 18px"
                class="customKhmerMoul text-green-darken-4"
                ><v-icon>mdi-account</v-icon> ការកំណត់ខែឆមាសតាមកម្រិតថ្នាក់
              </v-card-title>
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center ga-1 justify-end"
            >
              <v-text-field
                class="customFont"
                append-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                label="ស្វែងរក"
                hide-details
                single-line
                v-model="search"
              ></v-text-field>

              <!-- <v-btn
                prepend-icon="mdi-plus"
                to="/settingsemestercreate"
                color="green"
                variant="tonal"
                class="customFont"
              >
                បង្កើត
              </v-btn> -->
            </v-col>
          </v-row>

          <!-- <v-btn @click="printFunc"> Print </v-btn> -->

          <v-data-table
            :headers="headers"
            :items="semesters"
            :search="search"
            :loading="isloading"
            :loading-text="isloading ? 'Loading...' : ''"
            :no-data-text="isloading ? '' : 'មិនមានទិន្នន័យទេ'"
            :items-per-page="8"
            class="customFont mt-5"
          >
            <template v-slot:item.action="row">
              <v-btn
                class="text-warning mr-4"
                icon="mdi-pen"
                size="sm"
                flat
                @click="getId(row.item.id_setting_list)"
              ></v-btn>
              <v-btn
                v-if="user_role_id == 1 || user_role_id == 2"
                class="text-error"
                icon="mdi-delete"
                size="sm"
                flat
                @click="deleteSemester(row.item.id_setting_list)"
              >
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
