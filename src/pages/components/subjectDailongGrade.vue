<script setup>
import { ref, defineEmits, defineProps, watch, onMounted } from "vue";
import axios from "axios";
import { api } from "@/utils/axios";

const isEditing = ref(false);

const grades = ref([]);

const classtypes = ref([]);

const subjects = ref([]);

const emit = defineEmits(["add-subject", "update-subject", "update:isOpen"]);

const props = defineProps({
  isOpen: Boolean,
  subjectToEdit: Object, // Subject data to edit (or null for adding)
});

const form = ref({
  subject_id: null,
  class_type_id: null,
  grade_level_id: null,
  full_score: null,
  average_score: null,
});

const resetForm = () => {
  form.value = {
    subject_id: null,
    class_type_id: null,
    grade_level_id: null,
    full_score: null,
    average_score: null,
  };
};

// Watch for subjectToEdit changes from parent
watch(
  () => props.subjectToEdit,
  (newValue) => {
    if (newValue) {
      console.log("id", newValue.id);
      isEditing.value = true;
      form.value = {
        id: newValue.id,
        subject_id: newValue.subject_id,
        class_type_id: newValue.class_type_id,
        grade_level_id: newValue.grade_level_id,
        full_score: newValue.full_score,
        average_score: newValue.average_score,
      };
    } else {
      isEditing.value = false;
      resetForm();
    }
  },
  { immediate: true }
);

watch(
  () => form.value.full_score,
  (newVal) => {
    form.value.average_score = newVal / 2;
  }
);

const closeDialog = () => {
  resetForm();
  emit("update:isOpen", false);
};

const getSubject = async () => {
  try {
    const res = await api.post("/get_all_subject");
    subjects.value = res.data;
    console.log("sub", subjects.value);
  } catch (error) {
    console.log("Error getting subjects:", error);
  }
};

const get_grade = async () => {
  try {
    await api.post("/get_grade_level").then((res) => {
      grades.value = res.data;
      console.log(grades.value);
    });
  } catch (error) {
    console.log(error);
  }
};

const getClasstype = async () => {
  try {
    await api.post("/get_all_classtype").then((res) => {
      classtypes.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const saveSubject = () => {
  if (isEditing.value) {
    emit("update-subject", { ...form.value });
  } else {
    emit("add-subject", { ...form.value });
  }
  closeDialog();
};

onMounted(() => {
  getClasstype();
  get_grade();
  getSubject();
  console.log(isEditing.value);
});
</script>

<!-- subjectDailog.vue -->
<template>
  <VCard>
    <VCardTitle
      class="customKhmerMoul bg-green-darken-4 py-4"
      style="font-size: 18px"
    >
      {{ isEditing ? "កែប្រែមុខវិជ្ជាតាមកម្រិត" : "បង្កើតមុខវិជ្ជាតាមកម្រិត" }}
    </VCardTitle>
    <VCardText class="mt-3">
      <VRow class="customFont text-grey-darken-4">
        <VCol cols="12">
          <VSelect
            :items="subjects"
            item-value="id"
            item-title="subject_name"
            label="ឈ្មោះមុខវិជ្ជា(ខ្មែរ)"
            variant="outlined"
            density="compact"
            v-model="form.subject_id"
          />
        </VCol>

        <VCol cols="12">
          <VSelect
            :items="classtypes"
            item-title="type"
            item-value="id"
            label="ប្រភេទថ្នាក់"
            variant="outlined"
            density="compact"
            v-model="form.class_type_id"
          />
        </VCol>

        <VCol cols="12">
          <VSelect
            :items="grades"
            item-title="id"
            item-value="id"
            label="កម្រិតថ្នាក់"
            variant="outlined"
            density="compact"
            v-model="form.grade_level_id"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            type="number"
            label="ពិន្ទុពេញ"
            variant="outlined"
            density="compact"
            v-model="form.full_score"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            readonly
            label="ពិន្ទុមធ្យម"
            variant="outlined"
            density="compact"
            v-model="form.average_score"
          />
        </VCol>
      </VRow>
      <div class="d-flex justify-end flex-wrap ga-2 mt-2">
        <VBtn
          variant="tonal"
          color="red"
          class="customFont"
          @click="closeDialog"
        >
          បិទ
        </VBtn>
        <VBtn
          variant="tonal"
          color="green"
          class="customFont"
          @click="saveSubject"
        >
          រក្សាទុក
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>
