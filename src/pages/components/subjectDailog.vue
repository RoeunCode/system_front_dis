<!-- subjectDailog.vue -->
<template>
  <VCard>
    <VCardTitle
      class="customKhmerMoul bg-green-darken-4 py-4"
      style="font-size: 18px"
    >
      {{ isEditing ? "កែប្រែមុខវិជ្ជា" : "បង្កើតមុខវិជ្ជាទូទៅ" }}
    </VCardTitle>
    <VCardText class="mt-3">
      <VRow class="customFont text-grey-darken-4">
        <VCol cols="12">
          <v-text-field
            label="មុខវិជ្ជា"
            variant="outlined"
            density="compact"
            v-model="form.subject_name"
          />
        </VCol>
        <VCol cols="12">
          <v-text-field
            label="មុខវិជ្ជា(English)"
            variant="outlined"
            density="compact"
            v-model="form.subject_eng"
          />
        </VCol>
        <VCol cols="12">
          <v-text-field
            label="មុខវិជ្ជា(អក្សរកាត់)"
            variant="outlined"
            density="compact"
            v-model="form.subject_short"
          />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText class="d-flex justify-end flex-wrap ga-2">
      <VBtn variant="tonal" color="red" class="customFont" @click="closeDialog">
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
    </VCardText>
  </VCard>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from "vue";

// Tell Vue what messages we’ll send to the parent
const emit = defineEmits(["add-subject", "update-subject", "update:isOpen"]);

// Get data from the parent
const props = defineProps({
  isOpen: Boolean, // True = show dialog, False = hide dialog
  subjectToEdit: Object, // Subject data to edit (or null for adding)
});

// The form data the user types
const form = ref({
  id: null,
  subject_name: null,
  subject_eng: null,
  subject_short: null,
});

// Track if we’re editing or adding
const isEditing = ref(false);

// Watch for subjectToEdit changes from parent
watch(
  () => props.subjectToEdit,
  (newValue) => {
    if (newValue) {
      isEditing.value = true; // We’re editing
      form.value = { ...newValue }; // Fill form with subject data
    } else {
      isEditing.value = false;
    }
  },
  { immediate: true }
);

// Save button clicked
const saveSubject = () => {
  if (isEditing.value) {
    emit("update-subject", { ...form.value }); // Send edited data to parent
  } else {
    emit("add-subject", { ...form.value }); // Send new data to parent
  }
  closeDialog();
};

// Close button clicked or after save
const closeDialog = () => {
  resetForm();
  emit("update:isOpen", false); // Tell parent to hide dialog
};

const resetForm = () => {
  form.value = {
    id: null,
    subject_name: null,
    subject_eng: null,
    subject_short: null,
  };
};
</script>
