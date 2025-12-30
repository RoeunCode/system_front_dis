<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";
import { useRouter } from "vue-router";

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const user_role_id = ref(parseInt(user.value.role_id));

const router = useRouter();

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const semesters = ref([]);

const isloading = ref(false);

const getSemester = async () => {
  isloading.value = true;
  try {
    await api
      .post("getSemester", { campus_id: campus_id.value })
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

const images = (img) => {
  return "http://127.0.0.1:8000/storage/" + img;
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
  // {
  //   key: "semester_month1",
  //   title: "ឆមាសទី១",
  // },
  // {
  //   key: "three_months_semester1",
  //   title: "ខែឆមាសទី១",
  // },
  // {
  //   key: "semester_month2",
  //   title: "ឆមាសទី២",
  // },
  // {
  //   key: "three_months_semester2",
  //   title: "ខែឆមាសទី២",
  // },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

const getId = async (id) => {
  router.push({
    name: "SemesterCreate",
    params: { id },
  });
};

const detail = async (id) => {
  router.push({
    name: "SettingSemesterList",
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
      <v-col cols="12" md="6" class="mt-4">
        <v-card elevation="0" class="pa-4 border">
          <v-row class="align-center">
            <v-col cols="12" md="6">
              <v-card-title class="customKhmerMoul text-green-darken-4"
                ><v-icon>mdi-account</v-icon> ការកំណត់ឆមាស
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

              <v-btn
                prepend-icon="mdi-plus"
                to="/create-semester"
                color="green"
                variant="tonal"
                class="customFont"
              >
                បង្កើត
              </v-btn>
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
            :items-per-page="5"
            class="customFont mt-5"
          >
            <template v-slot:item.action="row">
              <v-btn
                class="text-success mr-4"
                icon="mdi-eye"
                size="sm"
                flat
                @click="detail(row.item.id)"
              ></v-btn>

              <v-btn
                v-if="user_role_id == 1"
                class="text-warning mr-4"
                icon="mdi-pen"
                size="sm"
                flat
                @click="getId(row.item.id)"
              ></v-btn>
              <v-btn
                v-if="user_role_id == 1"
                class="text-error"
                icon="mdi-delete"
                size="sm"
                flat
                @click="deleteSemester(row.item.id)"
              >
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
