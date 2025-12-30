<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import subjectDailongGrade from "./subjectDailongGrade.vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";

const isDialogVisible = ref(false);

const loading = ref(false);

const search = ref("");

const subject_grades = ref([]);

const selectedSubject = ref(null);

const headers = ref([
  { key: "subject_name", title: "មុខវិជ្ជា" },
  { key: "edu_name", title: "កម្រិតអប់រំ" },
  { key: "type", title: "ប្រភេទថ្នាក់" },
  { key: "level", title: "កម្រិតថ្នាក់" },
  { key: "full_score", title: "ពិន្ទុពេញ" },
  { key: "average_score", title: "ពិន្ទុមធ្យម" },
  { key: "action", title: "សកម្មភាព" },
]);

// Add a new subject
const handleAddSubject = async (subjectData) => {
  console.log(subjectData);
  try {
    await api
      .post("/add_subject_grade", subjectData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    isDialogVisible.value = false;
    getSubjectGrade();
  } catch (error) {
    console.log("Error adding subject:", error);
  }
};

const handleUpdateSubject = async (subjectData) => {
  console.log("up", subjectData);
  try {
    await api
      .post(`/update_subject_grade/${subjectData.id}`, subjectData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    getSubjectGrade();
    isDialogVisible.value = false;
  } catch (error) {
    console.log("Error updating subject:", error);
  }
};

// Open dialog for editing
const editSubject = (id) => {
  console.log(id);
  selectedSubject.value = subject_grades.value.find(
    (subject) => subject.id === id
  );
  console.log(selectedSubject.value);
  isDialogVisible.value = true; // Show dialog
};

const getSubjectGrade = async () => {
  loading.value = true;
  try {
    const res = await api.post("/get_subject_grade");
    subject_grades.value = res.data;
  } catch (error) {
    console.log("Error getting subjects:", error);
  } finally {
    loading.value = false;
  }
};

// Open dialog for adding
const openAddDialog = () => {
  selectedSubject.value = null; // Clear selected subject
  isDialogVisible.value = true;
};

onMounted(() => {
  getSubjectGrade();
});
</script>

<!-- ParentComponent.vue -->
<template>
  <div>
    <v-row>
      <v-col cols="12" md="12" class="mt-4">
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
            :items="subject_grades"
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
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <VDialog v-model="isDialogVisible" max-width="400">
      <subjectDailongGrade
        v-model:is-open="isDialogVisible"
        :subject-to-edit="selectedSubject"
        @add-subject="handleAddSubject"
        @update-subject="handleUpdateSubject"
      />
    </VDialog>
  </div>
</template>
