<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import subjectDailog from "./subjectDailog.vue";
import { api } from "@/utils/axios";
import Swal from "sweetalert2";

import Toast from "@/helper";

const isDialogVisible = ref(false);

const loading = ref(false);

const search = ref("");

const subjects = ref([]);

const selectedSubject = ref(null);

const headers = ref([
  { key: "subject_name", title: "មុខវិជ្ជា" },
  { key: "subject_eng", title: "មុខវិជ្ជា(អង់គ្លេស)" },
  { key: "subject_short", title: "មុខវិជ្ជា(អក្សរកាត់)" },
  { key: "action", title: "សកម្មភាព" },
]);

// Add a new subject
const handleAddSubject = async (subjectData) => {
  try {
    await api
      .post("/addSubject", subjectData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    isDialogVisible.value = false; // Close dialog
    getSubject();
  } catch (error) {
    console.log("Error adding subject:", error);
  }
};

const handleUpdateSubject = async (subjectData) => {
  console.log("subjectUp", subjectData);
  try {
    await api
      .post(`/update_subject/${subjectData.id}`, subjectData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    isDialogVisible.value = false;
    getSubject();
  } catch (error) {
    console.log("Error updating subject:", error);
  }
};

const getSubject = async () => {
  loading.value = true;
  try {
    const res = await api.post("/get_all_subject");
    subjects.value = res.data;
  } catch (error) {
    console.log("Error getting subjects:", error);
  } finally {
    loading.value = false;
  }
};

const deleteSubject = async (id) => {
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
        await api.post(`/delete_subject/${id}`);
        getSubject();
      }
    });
  } catch (error) {
    console.log("Error deleting subject:", error);
  }
};

// Open dialog for adding
const openAddDialog = () => {
  selectedSubject.value = null; // Clear selected subject
  isDialogVisible.value = true;
};

// Open dialog for editing
const editSubject = (id) => {
  selectedSubject.value = subjects.value.find((subject) => subject.id === id); // Pick subject to edit
  isDialogVisible.value = true; // Show dialog
};

onMounted(() => {
  getSubject();
});
</script>

<!-- ParentComponent.vue -->
<template>
  <div>
    <v-row>
      <v-col cols="12" md="8" class="mt-4">
        <v-card elevation="0" class="pa-4 border border-1">
          <v-row class="align-center">
            <v-col cols="12" md="4" class="d-flex align-center ga-2">
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
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end ga-2">
              <!-- <v-btn
                prepend-icon="mdi-file"
                class="customFont"
                variant="tonal"
                color="grey"
              >
                ទាញ Excel
              </v-btn>
              <v-btn
                prepend-icon="mdi-file"
                class="customFont"
                variant="tonal"
                color="orange"
              >
                ទាញ PDF
              </v-btn> -->
              <v-btn
                prepend-icon="mdi-plus"
                @click="openAddDialog"
                variant="tonal"
                color="green"
                class="customFont"
              >
                បង្កើត
              </v-btn>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="subjects"
            :search="search"
            :loading="loading"
            :loading-text="loading ? 'Loading...' : ''"
            :no-data-text="loading ? '' : 'មិនមានទិន្នន័យទេ'"
            :items-per-page="5"
            class="customFont mt-5 my-custom-table"
          >
            <template v-slot:item.action="row">
              <v-btn
                class="text-warning mr-4"
                icon="mdi-pen"
                size="sm"
                flat
                @click="editSubject(row.item.id)"
              ></v-btn>
              <v-btn
                class="text-error"
                icon="mdi-delete"
                size="sm"
                flat
                @click="deleteSubject(row.item.id)"
              ></v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <VDialog v-model="isDialogVisible" max-width="400">
      <subjectDailog
        v-model:is-open="isDialogVisible"
        :subject-to-edit="selectedSubject"
        @add-subject="handleAddSubject"
        @update-subject="handleUpdateSubject"
      />
    </VDialog>
  </div>
</template>
