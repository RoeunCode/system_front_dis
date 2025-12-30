<script setup>
import AppDataTable from "../components/AppDataTable.vue";
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { api } from "@/utils/axios";
import Toast from "@/helper";

const router = useRouter();

const loading = ref(false);

const show = ref(false);

const search = ref(null);

const filters = ref({
  search: null,
  yearId: null,
});

const yearId = ref("");

const students = ref([]);

const filterStudents = ref([]);

const student = ref([]);

const totalStudent = ref(0);

const options = ref({
  page: 1,
  itemsPerPage: 10,
});

const getStudent = async () => {
  loading.value = true;
  try {
    const { page, itemsPerPage } = options.value;
    await api
      .post(
        `/get_all_student?page=${page}&per_page=${itemsPerPage}&search=${search.value}&year=${yearId.value}`
      )
      .then((res) => {
        students.value = res.data.data;
        filterStudents.value = students.value;
        totalStudent.value = res.data.total;
      });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const deleteStudent = async (item) => {
  try {
    await api.post(`/delete_student/${item.id}`).then((res) => {
      console.log(res.data);
    });
    router.push("student-delete");
    getStudent();
  } catch (error) {
    console.log(error);
  }
};

const years = ref([{ year: "all" }]);

const get_year = async () => {
  try {
    await api.post("/getyear").then((res) => {
      years.value = [{ year: "All" }, ...res.data];
      console.log(res.data);
    });
  } catch (error) {
    console.log(error);
  }
};

const filterStudent = (type) => {
  if (type === "study") {
    filterStudents.value = students.value.filter((e) => e.deleted === 0);
  } else if (type === "stop") {
    filterStudents.value = students.value.filter((e) => e.deleted === 1);
  }
};

const idStorage = ref(localStorage.getItem("id"));

const getStudentId = (item) => {
  localStorage.setItem("id", item.id);
  const id = item.id;
  idStorage.value = id.toString();

  router.push({
    name: "CreateStudent",
    params: { id },
  });
};

const studentDetail = (item) => {
  const id = item.id;
  router.push({
    name: "StudentDetail",
    params: { id },
  });
};

const rowClass = (item) => {
  console.log("row", row.item);
  return item.id.toString() == idStorage.value ? "highlight-red" : "";
};

watch(options, getStudent, { deep: true });
onMounted(async () => {
  await get_year();
});
const headers = ref([
  {
    key: "student_card_id",
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
    key: "national",
    title: "សញ្ជាតិ",
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
    key: "actions",
    title: "សកម្មភាព",
  },
]);

const images = (img) => {
  return "https://iconic.disreportcard.com/storage/" + img;
};
</script>

<template>
  <v-card elevation="0" class="pa-4 mt-2 border">
    <div>
      <v-row class="align-center">
        <v-col cols="12" md="7">
          <v-card-title class="customKhmerMoul text-size text-green-darken-4">
            <v-icon>mdi-account-school</v-icon> បញ្ជីសិស្សទាំងអស់
          </v-card-title>
        </v-col>

        <v-col cols="12" md="5" class="d-flex align-center justify-end ga-2">
          <VBtn
            prepend-icon="mdi-magnify"
            color="orange"
            class="customFont"
            variant="tonal"
            @click="show = !show"
            >ស្វែងរក</VBtn
          >

          <v-btn
            prepend-icon="mdi-plus"
            class="customFont"
            variant="tonal"
            color="green"
            to="/create-student"
          >
            បង្កើត
          </v-btn>
        </v-col>

        <v-col
          cols="12"
          md="12"
          v-show="show"
          class="my-3 rounded-lg border px-5"
        >
          <VRow>
            <V-col cols="12" md="3" class="d-flex ga-2 mt-4">
              <VSelect
                :items="years"
                item-value="year"
                item-title="year"
                class="customFont"
                elevation="0"
                density="compact"
                variant="outlined"
                label="ជ្រើសរើសឆ្នាំសិក្សា"
                v-model="filters.yearId"
              ></VSelect>
              <VBtn
                class="bg-green-lighten-4 customFont"
                variant="flat"
                @click="getStudent()"
                >ស្វែងរក</VBtn
              >
            </V-col>
            <v-spacer></v-spacer>
            <VCol class="d-flex ga-3 justify-end mt-4" cols="12" md="6">
              <v-text-field
                max-width="350"
                class="customFont"
                elevation="3"
                append-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                label="ស្វែងរក"
                v-model="filters.search"
              ></v-text-field>

              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    prepend-icon="mdi-database-search-outline"
                    color="blue-lighten-3"
                    v-bind="props"
                    class="customFont"
                    elevation="3"
                  >
                    ច្រោះទិន្នន័យ
                  </v-btn>
                </template>
                <div
                  class="bg-blue-lighten-5 pa-2 d-flex flex-column customFont"
                >
                  <VBtn variant="outlined" @click="filterStudent('study')"
                    >នៅរៀន</VBtn
                  >
                  <VBtn
                    variant="outlined"
                    @click="filterStudent('stop')"
                    class="mt-1"
                    >ឈប់រៀន</VBtn
                  >
                  <VBtn variant="outlined" @click="getStudent" class="mt-1"
                    >ទាំងអស់</VBtn
                  >
                </div>
              </v-menu>
            </VCol>
          </VRow>
        </v-col>
      </v-row>

      <AppDataTable
        v-model:filters="filters"
        save-state
        api-url="get_all_student"
        :headers="headers"
        is-edit
        is-view
        is-delete
        @on-edit="getStudentId"
        @on-delete="deleteStudent"
        @on-view="studentDetail"
      >
        <!-- <template #[`item.photo_path`]="{ item }">
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
        </template> -->

        <template #[`item.photo_path`]="{ item }">
          <v-chip
            :color="item.photo_path ? 'green' : 'red'"
            :text="item.photo_path ? 'មានរូប' : 'អត់រូប'"
            class="text-uppercase"
            size="small"
            label
          ></v-chip>
        </template>

        <template v-slot:item.gender="{ item }">
          <p>{{ item.gender == 1 || item.gender == "M" ? "ប្រុស" : "ស្រី" }}</p>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.deleted == 0 || item.status == null ? 'green' : 'red'"
            :text="item.deleted == 0 || item.status == null ? 'រៀន' : 'ឈប់រៀន'"
            class="text-uppercase"
            size="small"
            label
          ></v-chip>
        </template>

        <!-- <template #body.tr="{ item, columns }">
          <tr
            class="v-data-table__tr v-data-table__tr--clickable"
            :class="{
              'highlight-row': item.raw.id === idStorage,
            }"
          >
            <td v-for="column in columns" :key="column.key">
              <slot :name="`item.${column.key}`" :item="item.raw">
                {{
                  column.value
                    ? column.value(item.raw)
                    : getValue(item.raw, column.key)
                }}
              </slot>
            </td>
          </tr>
        </template> -->

        <!-- <template v-slot:item.action="{ item }">
          <v-menu location="end">
            <template #activator="{ props }">
              <v-btn v-bind="props" flat size="sm">
                <v-icon> mdi-dots-vertical </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <v-btn
                    flat
                    icon
                    size="30"
                    class="text-green-lighten-1"
                    @click="tenantDetail(item.id)"
                  >
                    <v-icon>mdi-eye-lock-open</v-icon>
                  </v-btn>
                </v-list-item-title>

                <v-list-item-title>
                  <v-btn
                    flat
                    icon
                    size="30"
                    class="text-orange my-1"
                    @click="getStudentId(item.id)"
                  >
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                </v-list-item-title>

                <v-list-item-title>
                  <v-btn
                    flat
                    icon
                    size="30"
                    class="text-red my-1"
                    @click="deleteStudent(item.id)"
                  >
                    <v-icon>mdi-account-remove</v-icon>
                  </v-btn>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template> -->
      </AppDataTable>
    </div>
  </v-card>
</template>
