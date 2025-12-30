<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Toast from "@/helper";
import Swal from "sweetalert2";
import { api } from "@/utils/axios";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

// Watch for changes in settingStore.campus_id

const router = useRouter();

const model = ref(false);
const loading = ref(false);
const classrooms = ref([]);
const filterClass = ref([]);
const search = ref();
const show = ref(false);
const year_id = ref("");

const getId = (id) => {
  router.push({
    name: "CreateClassroom",
    params: { id },
  });
};

const getClassroomByYear = async (id) => {
  console.log(id);
  try {
    const response = await api.post(`/getClassroomByYear/${id}`, {
      campus_id: campus_id.value, // Pass campus_id
    });
    classrooms.value = response.data.data;
    filterClass.value = classrooms.value.filter((c) => c.deleted != 1);
    Toast.fire({
      title: response.data.message,
      icon: "success",
    });
  } catch (error) {
    console.error("Error:", error.response?.data);
    Toast.fire({
      title: error.response?.data?.message || "An error occurred",
      icon: "error",
    });
  }
};

const get_classroom = async () => {
  loading.value = true;
  try {
    const response = await api.post("/get_all_classroom", {
      campus_id: campus_id.value, // Pass campus_id in the request
    });
    classrooms.value = response.data;
    filterClass.value = classrooms.value.filter((c) => c.deleted != 1);
  } catch (error) {
    console.error("Error:", error);
    Toast.fire({
      title: error.response?.data?.message || "An error occurred",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const delete_classroom = async (id) => {
  try {
    const result = await Swal.fire({
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
    });

    if (result.isConfirmed) {
      await api.post(`/delete_classroom/${id}`);
      Swal.fire({
        title: "លុប!",
        text: "ទិន្នន័យរបស់អ្នកត្រូវបានលុប។",
        confirmButtonText: "បាទ/ចា៎",
        confirmButtonColor: "#ED5E68",
        customClass: {
          popup: "colored-toast custom-delete-swal-title",
          confirmButton: "custom-swal-confirm-button",
        },
      });
      get_classroom();
    }
  } catch (error) {
    console.error("Error:", error);
    Toast.fire({
      title: error.response?.data?.message || "An error occurred",
      icon: "error",
    });
  }
};

const backClass = async (id) => {
  try {
    const response = await api.post(`/backClass/${id}`);
    Toast.fire({
      title: response.data.message,
      icon: "success",
    });
    isActive.value = true;
    get_classroom();
  } catch (error) {
    Toast.fire({
      title: error.response?.data?.message || "An error occurred",
      icon: "error",
    });
  }
};

const classDetail = (id) => {
  router.push({
    name: "ClassroomDetail",
    params: { id },
  });
};

const headers = ref([
  {
    key: "room_number",
    title: "បន្ទប់លេខ",
  },
  {
    key: "grade",
    title: "ឈ្មោះថ្នាក់",
  },
  {
    key: "cur_name",
    title: "កម្មវិធីសិក្សា",
  },
  {
    key: "level",
    title: "កម្រិតថ្នាក់",
  },
  {
    key: "classtype",
    title: "ប្រភេទថ្នាក់",
  },
  {
    key: "edu_name",
    title: "កម្រិតអប់រំ",
  },
  {
    key: "session_name",
    title: "វេនសិក្សា",
  },
  {
    key: "year",
    title: "ឆ្នាំសិក្សា",
  },
  {
    key: "deleted",
    title: "ស្ថានភាព",
  },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

const years = ref([]);

const get_year = async () => {
  try {
    const response = await api.post("/get_all_year");
    years.value = response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const message = ref("Active");
const isActive = ref(true);
const inInactive = ref(false);

const handleSwitchChange = (newValue) => {
  if (newValue) {
    // Show deleted classes
    filterClass.value = classrooms.value.filter((c) => c.deleted != 0);
    message.value = "Inactive";
    isActive.value = false;
  } else {
    // Show active classes
    filterClass.value = classrooms.value.filter((c) => c.deleted != 1);
    message.value = "Active";
    isActive.value = true;
  }
  console.log("updated filter", filterClass.value);
};

const debouncedGetClassroom = debounce(get_classroom, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetClassroom();
  },
  { immediate: true }
);

onMounted(() => {
  get_year();
  // get_classroom();
});
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="12" class="mt-4">
        <v-card elevation="0" class="pa-4 border border-1">
          <v-row class="align-center">
            <v-col cols="12" md="6">
              <v-card-title class="customKhmerMoul text-green-darken-4">
                ថ្នាក់រៀន
              </v-card-title>
            </v-col>

            <v-col
              cols="12"
              md="6"
              class="d-flex align-center justify-end ga-2"
            >
              <v-btn
                prepend-icon="mdi-magnify"
                color="orange"
                class="customFont"
                variant="tonal"
                @click="show = !show"
              >
                ស្វែងរក
              </v-btn>

              <v-btn
                prepend-icon="mdi-home-plus-outline"
                to="/create-classroom"
                variant="tonal"
                color="green"
                class="customFont"
              >
                បង្កើត
              </v-btn>
            </v-col>

            <v-col
              cols="12"
              md="12"
              v-show="show"
              class="my-3 rounded-lg border border-1 px-5"
            >
              <v-row>
                <v-col class="d-flex ga-3 justify-start mt-4" cols="12" md="6">
                  <v-text-field
                    hide-details
                    max-width="350"
                    class="customFont"
                    elevation="3"
                    append-inner-icon="mdi-magnify"
                    density="compact"
                    variant="outlined"
                    label="ស្វែងរក"
                    v-model="search"
                  ></v-text-field>

                  <v-switch
                    v-model="model"
                    :color="model ? 'green' : 'blue'"
                    hide-details
                    :label="message"
                    inset
                    @update:modelValue="handleSwitchChange"
                  ></v-switch>
                </v-col>

                <v-spacer></v-spacer>

                <v-col cols="12" md="3" sm="6" class="d-flex ga-2 mt-4">
                  <v-select
                    :items="years"
                    item-title="name"
                    item-value="id"
                    class="customFont"
                    elevation="0"
                    density="compact"
                    variant="outlined"
                    label="ជ្រើសរើសឆ្នាំសិក្សា"
                    v-model="year_id"
                  ></v-select>
                  <v-btn
                    class="bg-green-lighten-4 customFont"
                    variant="flat"
                    @click="getClassroomByYear(year_id)"
                  >
                    ស្វែងរក
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="filterClass"
            :search="search"
            :loading="loading"
            :loading-text="loading ? 'Loading...' : ''"
            :no-data-text="loading ? '' : 'មិនមានទិន្នន័យទេ'"
            :items-per-page="8"
            class="customFont mt-5 my-custom-table"
            id="printArea"
          >
            <template v-slot:item.deleted="{ item }">
              <v-chip
                :color="
                  item.deleted == 0 || item.deleted == null ? 'green' : 'red'
                "
                :text="
                  item.deleted == 0 || item.deleted == null
                    ? 'Active'
                    : 'Inactive'
                "
                class="text-uppercase"
                size="small"
                label
              ></v-chip>
            </template>

            <template v-slot:item.action="row">
              <v-btn
                v-if="isActive"
                flat
                size="30"
                class="text-green-lighten-1"
                icon="mdi-eye-lock-open"
                @click="classDetail(row.item.id)"
              ></v-btn>

              <v-btn
                v-if="!isActive"
                flat
                size="30"
                class="text-orange my-1"
                @click="backClass(row.item.id)"
              >
                <v-icon size="25px">mdi-sync</v-icon>
                <v-tooltip activator="parent" class="customFont" location="end">
                  ត្រលប់
                </v-tooltip>
              </v-btn>

              <v-btn flat size="sm" v-if="isActive">
                <v-icon>mdi-dots-vertical</v-icon>
                <v-menu activator="parent" location="end">
                  <v-list location="end">
                    <v-list-item>
                      <v-list-item-title>
                        <v-btn
                          flat
                          size="30"
                          class="text-green-lighten-1"
                          icon="mdi-eye-lock-open"
                          @click="classDetail(row.item.id)"
                        ></v-btn>
                      </v-list-item-title>
                      <v-list-item-title>
                        <v-btn
                          flat
                          icon="mdi-pen"
                          size="30"
                          class="text-orange my-1"
                          @click="getId(row.item.id)"
                        ></v-btn>
                      </v-list-item-title>
                      <v-list-item-title>
                        <v-btn
                          flat
                          size="30"
                          class="text-red my-1"
                          icon="mdi-delete"
                          @click="delete_classroom(row.item.id)"
                        ></v-btn>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
