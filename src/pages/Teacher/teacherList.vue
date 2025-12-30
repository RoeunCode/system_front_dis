<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const router = useRouter();

const loading = ref(false);

const teachers = ref([]);

const getTeacher = async () => {
  loading.value = true;
  try {
    await api
      .post("/get_all_teacher", {
        campus_id: campus_id.value, // Pass campus_id
      })
      .then((res) => {
        teachers.value = res.data;
        console.log(teachers.value);
      });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const deleteTeacher = async (id) => {
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
        await api.post(`/delete_teacher/${id}`);

        getTeacher();
      }
    });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  }
};

// const images = (img) => {
//   return "http://127.0.0.1:8000/storage/" + img;
// };

const images = (img) => {
  return "http://127.0.0.1:8000/storage/" + img;
};

const headers = ref([
  {
    key: "id",
    title: "អត្ថលេខ",
  },
  {
    key: "kh_name",
    title: "ឈ្មោះខ្មែរ",
  },
  {
    key: "en_name",
    title: "ឈ្មោះអង់គ្លេស",
  },
  {
    key: "gender",
    title: "ភេទ",
  },
  {
    key: "dob",
    title: "ថ្ងៃខែឆ្នាំកំណើត",
  },
  {
    key: "phone",
    title: "លេខទូរស័ព្ទ",
  },
  {
    key: "status",
    title: "ស្ថានភាព",
  },

  {
    key: "photo_path",
    title: "រូបថត",
  },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

const getId = (id) => {
  router.push({
    name: "CreateTeacher",
    params: { id },
  });
};

const debouncedGetTeacher = debounce(getTeacher, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetTeacher();
  },
  { immediate: true }
);

// onMounted(async () => {
//   await getTeacher();
// });
</script>
<template>
  <v-card elevation="0" class="pa-4 mt-4 border">
    <div>
      <v-row class="align-center">
        <v-col cols="12" md="7">
          <v-card-title class="customKhmerMoul text-green-darken-4">
            <v-icon>mdi-account-school</v-icon> បញ្ជីគ្រូបង្រៀនទាំងអស់
          </v-card-title>
        </v-col>
        <v-col cols="12" md="5" class="d-flex align-center ga-2">
          <v-text-field
            class="customFont"
            elevation="3"
            append-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            label="ស្វែងរក"
            hide-details
            single-line
            v-model="search"
          ></v-text-field>

          <v-btn
            prepend-icon="mdi-home-plus-outline"
            to="/create-teacher"
            elevation="3"
            class="bg-green customFont"
          >
            បង្កើត
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="teachers"
        :search="search"
        :loading="loading"
        :loading-text="loading ? 'Loading...' : ''"
        :no-data-text="loading ? '' : 'មិនមានទិន្នន័យទេ'"
        class="customFont mt-5 my-custom-table"
      >
        <template v-slot:item.gender="{ item }">
          <p>{{ item.gender == 1 ? "ប្រុស" : "ស្រី" }}</p>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status == 0 || item.status == null ? 'red' : 'green'"
            :text="
              item.status == 0 || item.status == null
                ? 'អត់ទាន់បង្រៀន'
                : 'បានបង្រៀន'
            "
            class="text-uppercase"
            size="small"
            label
          ></v-chip>
        </template>

        <template #[`item.photo_path`]="{ item }">
          <div>
            <v-img
              v-if="item.photo_path"
              :src="images(item.photo_path)"
              width="50"
              height="50"
            ></v-img>
            <v-img
              v-else
              src="https://st4.depositphotos.com/9998432/24428/v/450/depositphotos_244284796-stock-illustration-person-gray-photo-placeholder-man.jpg"
              width="50"
              height="50"
            ></v-img>
          </div>
        </template>

        <template v-slot:item.action="row">
          <v-btn flat size="sm">
            <v-icon> mdi-dots-vertical </v-icon>
            <v-menu activator="parent" location="end">
              <v-list location="end">
                <v-list-item>
                  <v-list-item-title>
                    <v-btn
                      flat
                      size="30"
                      class="text-green-lighten-1"
                      @click="tenantDetail(row.item.id)"
                      icon="mdi-eye-lock-open"
                    >
                    </v-btn>
                  </v-list-item-title>
                  <v-list-item-title>
                    <v-btn
                      flat
                      icon="mdi-pen"
                      size="30"
                      class="text-yellow my-1"
                      @click="getId(row.item.id)"
                    ></v-btn>
                  </v-list-item-title>
                  <v-list-item-title>
                    <v-btn
                      flat
                      size="30"
                      class="text-red my-1"
                      icon="mdi-delete"
                      @click="deleteTeacher(row.item.id)"
                    ></v-btn>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>
