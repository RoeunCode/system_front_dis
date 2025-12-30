<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { api } from "@/utils/axios";

const loading = ref(false);

const students = ref([]);

const getStudent = async () => {
  loading.value = true;
  try {
    const res = await api.post("/get_student_delete");
    students.value = res.data;
  } catch (error) {
    console.error("Error fetching students:", error);
  } finally {
    loading.value = false;
  }
};

const finalDeleteStudent = async (id) => {
  try {
    await api.post(`/final_delete_student/${id}`).then((res) => {
      console.log(res.data);
    });
    getStudent();
  } catch (error) {
    console.log(error);
  }
};

const backToStudy = async (id) => {
  console.log(id);

  await api.post(`/backToStudy/${id}`);
  getStudent();
};

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

onMounted(async () => {
  await getStudent();
});
</script>
<template>
  <v-card elevation="0" class="pa-4 mt-4 border border-1">
    <div>
      <v-row class="align-center">
        <v-col cols="12" md="7">
          <v-card-title class="customKhmerMoul text-green-darken-4">
            <v-icon>mdi-account-school</v-icon> បញ្ជីសិស្សឈប់រៀន
          </v-card-title>
        </v-col>
        <v-col cols="12" md="5" class="d-flex align-center ga-2">
          <v-spacer></v-spacer>
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
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="students"
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
            :color="item.deleted == 0 || item.deleted == null ? 'green' : 'red'"
            :text="
              item.deleted == 0 || item.deleted == null ? 'នៅរៀន' : 'ឈប់រៀន'
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
                      size="30"
                      class="text-orange my-1"
                      @click="backToStudy(row.item.id)"
                    >
                      <v-icon>mdi-account-sync</v-icon>
                      <v-tooltip
                        activator="parent"
                        class="customFont"
                        location="end"
                      >
                        ត្រលប់
                      </v-tooltip>
                    </v-btn>
                  </v-list-item-title>
                  <v-list-item-title>
                    <v-btn
                      flat
                      size="30"
                      class="text-red my-1"
                      @click="finalDeleteStudent(row.item.id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                      <v-tooltip
                        activator="parent"
                        class="customFont"
                        location="end"
                      >
                        លុបអចិន្រ្តៃយ៍
                      </v-tooltip>
                    </v-btn>
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
