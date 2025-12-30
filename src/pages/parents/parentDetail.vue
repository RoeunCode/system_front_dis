<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { api } from "@/utils/axios";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import Toast from "@/helper";
import Swal from "sweetalert2";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const images = (img) => {
  return "https://iconic.disreportcard.com/storage/" + img;
};

const selectedStudent = ref([]);

const searchSelect = ref("");

const store = useStore();

const dialog = ref(false);

const route = useRoute();

const parents = ref([]);

const children = ref([]);

const loading = ref(false);

const loadingAdd = ref(false);

const headers = ref([
  {
    key: "kh_name",
    title: "ឈ្មោះខ្មែរ",
  },
  {
    key: "en_name",
    title: "ឈ្មោះអង់គ្លេស",
  },
  {
    key: "photo_path",
    title: "រូបភាព",
  },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

const headersSelect = ref([
  {
    key: "id",
    title: "អត្តលេខ",
  },
  {
    key: "kh_name",
    title: "ឈ្មោះខ្មែរ",
  },
]);

const students = ref([]);

const filterStudents = ref([]);

const getParent = async () => {
  loading.value = true;
  const id = route.params.id;
  try {
    await api.get(`/viewporfile/${id}`).then((res) => {
      parents.value = res.data.data;
      children.value = res.data.student;
      console.log(children.value);
    });
  } catch (error) {
    console.log(
      Toast.fire({
        title: error.response.data.message,
        icon: error,
      })
    );
  } finally {
    loading.value = false;
  }
};

const getStudents = async () => {
  try {
    const findStudent = "all_student_name";
    const res = await api.post(`/get_all_student?year=${findStudent}`, {
      selectedCampusId: campus_id.value,
    });
    students.value = res.data;
    const childIds = new Set(children.value.map((child) => child.id));

    // Filter out students that are already children
    filterStudents.value = students.value.filter(
      (student) => !childIds.has(student.id)
    );

    console.log("filter", filterStudents.value);
  } catch (error) {
    console.log(error);
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  }
};

const addStudentToParent = async () => {
  loadingAdd.value = true;
  // Convert array of student objects to comma-separated IDs
  const student_ids = selectedStudent.value
    .map((student) => student.id)
    .join(",");

  // Prepare data to send
  const data = {
    studentId: student_ids,
    parentId: route.params.id,
  };

  try {
    const res = await api.post("/addChild", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    getParent();
    Toast.fire({
      title: res.data.message,
      icon: "success",
    });
  } catch (error) {
    console.error("Error adding students to parent:", error);
  } finally {
    loadingAdd.value = false;
    dialog.value = false;
  }
};

const deleteChildren = async (id) => {
  let data = {
    idToRemove: id,
    parentId: route.params.id,
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
        await api
          .post("/deletechild", data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            Toast.fire({
              title: res.data.message,
              icon: "success",
            });
            getParent();
          });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const debouncedGetStudents = debounce(getStudents, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetStudents();
  },
  { immediate: true }
);

onMounted(() => {
  getParent();
  // getStudents();
});
</script>
<template>
  <div>
    <VCard class="border" elevation="0">
      <VImg
        src="https://img.freepik.com/premium-vector/simple-elegant-plain-green-gradient-background_768131-640.jpg?semt=ais_hybrid&w=740"
        min-height="125"
        max-height="250"
        cover
      />

      <VCardText
        class="d-flex align-bottom flex-sm-row flex-column justify-center ga-x-6"
      >
        <div class="d-flex">
          <VAvatar
            v-if="parents.photo_path"
            rounded
            size="130"
            :image="images(parents.photo_path)"
            class="user-profile-avatar mx-auto"
          />
          <VAvatar
            v-else
            rounded
            size="130"
            image="https://i.pinimg.com/736x/eb/09/31/eb0931b489d885d739fb750df5539120.jpg"
            class="user-profile-avatar mx-auto"
          />
        </div>

        <div class="user-profile-info w-100 mt-16 ml-2 pt-6 pt-sm-0 mt-sm-0">
          <h4
            class="text-h5 text-center font-weight-bold text-sm-start font-weight-medium mb-2"
          >
            {{ parents.username }}
          </h4>

          <div
            class="d-flex align-center mb-5 justify-center justify-sm-space-between flex-wrap gap-5"
          >
            <p class="customAnkor ml-1">{{ parents.email }}</p>
          </div>
        </div>
      </VCardText>
    </VCard>
    <div class="my-1 d-flex justify-end">
      <VBtn
        variant="tonal"
        @click="dialog = !dialog"
        color="green-darken-3 customFont"
        >បន្ថែមសិស្ស</VBtn
      >
    </div>
    <VCard class="mt-2 border" elevation="0">
      <v-data-table
        :headers="headers"
        :items="children"
        :search="search"
        :loading="loading"
        :loading-text="loading ? 'Loading...' : ''"
        :no-data-text="loading ? '' : 'មិនមានទិន្នន័យទេ'"
        :items-per-page="5"
        class="customFont mt-5"
      >
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
          <v-btn
            class="text-error"
            icon="mdi-delete"
            size="sm"
            flat
            @click="deleteChildren(row.item.id)"
          >
          </v-btn>
        </template>
      </v-data-table>
    </VCard>

    <VDialog
      max-width="600"
      v-model="dialog"
      scrollable
      transition="dialog-transition"
    >
      <VCard>
        <VCardTitle class="customFont bg-green-darken-4 py-3">
          បន្ថែមសិស្សចូលអាណាព្យាបាល
        </VCardTitle>
        <VCardText>
          <VRow>
            <V-col cols="12" md="12" class="d-flex justify-between">
              <v-text-field
                class="customFont"
                elevation="3"
                append-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                label="ស្វែងរកសិស្ស"
                hide-details
                single-line
                v-model="searchSelect"
              ></v-text-field>

              <v-spacer></v-spacer>

              <v-btn
                :loading="isloading"
                prepend-icon="mdi-plus"
                class="text-end customFont"
                color="green"
                variant="tonal"
                @click="addStudentToParent"
                >រក្សាទុក</v-btn
              >
            </V-col>
            <VCol cols="12" md="12" sm="12">
              <v-data-table
                v-model="selectedStudent"
                :headers="headersSelect"
                :items="filterStudents"
                :search="searchSelect"
                :loading="loading"
                :loading-text="loading ? 'Loading...' : ''"
                :no-data-text="loading ? '' : 'មិនមានទិន្នន័យទេ'"
                items-per-page="7"
                show-select
                return-object
                class="customFont mt-3 my-custom-table"
              >
                <template v-slot:item.gender="{ item }">
                  <p>
                    {{
                      item.gender == 1 || item.gender == "M" ? "ប្រុស" : "ស្រី"
                    }}
                  </p>
                </template>
              </v-data-table>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.user-profile-avatar {
  border: 2px solid rgb(var(--v-theme-surface));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  /* .v-img__img {
    border-radius: 0.125rem;
  } */
}
</style>
