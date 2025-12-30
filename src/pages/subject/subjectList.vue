<script setup>
import { ref } from "vue";
import Subject from "../components/subject.vue";
import SubjectGrade from "../components/subjectGrade.vue";

const currentTab = ref("subject");
</script>

<template>
  <VCard elevation="0" class="pa-4 mt-4 border">
    <VTabs v-model="currentTab" color="green-darken-4">
      <VTab class="customFont">មុខវិជ្ជាទូទៅ</VTab>
      <VTab class="customFont">មុខវិជ្ជាតាមកម្រិតថ្នាក់</VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="currentTab">
        <VWindowItem value="subject">
          <Subject />
        </VWindowItem>

        <!-- Subjects by Grade Tab -->
        <VWindowItem value="subject-grade">
          <SubjectGrade />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
