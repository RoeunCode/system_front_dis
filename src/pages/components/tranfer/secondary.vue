<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";

const isAdd = ref(false);

const props = defineProps({
  newStudentName: {
    type: String,
  },
  newStudentId: {
    type: String,
  },
  classId: {
    type: String,
  },
  eduId: {
    type: String,
  },
});

const isSearch = ref(false);

const isFind = ref(false);

const form = ref({
  student_id: props.newStudentId,
  month_id: null,
  class_id: props.classId,
  avg_m: null,
  writing: null,
  essay: null,
  khmer: null,
  morality: null,
  history: null,
  geography: null,
  math: null,
  physical: null,
  chemistry: null,
  biology: null,
  geology: null,
  house_education: null,
  english: null,
  pe: null,
  computer: null,
});

const formFind = ref({
  eduId: props.eduId,
  studentId: props.newStudentId,
  classId: props.classId,
  monthId: form.value.month_id,
});

watch(
  () => form.value.month_id,
  (n) => {
    formFind.value.monthId = n;
  }
);

const findStudentTransfer = async () => {
  isSearch.value = true;
  isFind.value = true;
  try {
    await api
      .post("findStudentTransferSecondary", formFind.value, {
        headers: {
          "Content-Type": "Application/json",
        },
      })
      .then((res) => {
        if (res.data.status == 1 || res.data.status == "1") {
          form.value = res.data.data[0];
        } else {
          form.value = {
            student_id: props.newStudentId,
            class_id: props.classId,
            month_id: form.value.month_id,
            avg_m: null,
            writing: null,
            essay: null,
            khmer: null,
            morality: null,
            history: null,
            geography: null,
            math: null,
            physical: null,
            chemistry: null,
            biology: null,
            geology: null,
            house_education: null,
            english: null,
            pe: null,
            computer: null,
          };
        }

        console.log("return", res.data.data);
      });
  } catch (error) {
    console.log(error);
  } finally {
    isFind.value = false;
  }
};

console.log(props);

const months = ref([]);

const getMonth = async () => {
  try {
    await api.post("get_all_month").then((res) => {
      months.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const addNewstudentScore = async () => {
  console.log("form", form.value);
  try {
    isAdd.value = true;
    await api
      .post("addScoreStudentTransferSecondary", form.value, {
        headers: {
          "Content-Type": "Application/json",
        },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
  } catch (error) {
    console.log(error);
    Toast.fire({
      title: error.response.data.message,
    });
  } finally {
    isAdd.value = false;
  }
};

onMounted(() => {
  getMonth();
  // findStudentTransfer();
});
</script>
<template>
  <div>
    <VCard>
      <VCardTitle class="customKhmerMoul text-white bg-green-darken-4 py-3"
        >បញ្ចូលពិន្ទុសិស្សថ្មី</VCardTitle
      >
      <VCardText class="mt-4">
        <VRow>
          <VCol cols="12" md="12">
            <h2 class="text-center customFont font-weight-bold">
              {{ props.newStudentName }}
            </h2>
          </VCol>
          <VCol cols="12" sm="6" md="6" class="d-flex ga-2">
            <VSelect
              :items="months"
              item-value="id"
              item-title="name_kh"
              class="customFont"
              density="compact"
              placeholder="៦"
              label="ប្រចាំខែ"
              variant="outlined"
              v-model="form.month_id"
            />
            <VBtn
              variant="tonal"
              color="green"
              class="customFont"
              @click="findStudentTransfer"
              :loading="isFind"
              :disabled="isFind"
            >
              ស្វែងរក</VBtn
            >
          </VCol>
        </VRow>
      </VCardText>
      <VCardText style="margin-top: -20px; margin-bottom: 10px" v-if="isSearch">
        <VTable fixed-header class="border customFont">
          <thead class="my-custom-table">
            <tr>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                តែងសេចក្ដី
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                ស.សអាន
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                ភាសាខ្មែរ
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                សីលធម៌
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                ប្រវត្តិវិទ្យា
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                ភូមិវិទ្យា
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                គណិតវិទ្យា
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                រូបវិទ្យា
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                គីមីវិទ្យា
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                ជីវវិទ្យា
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                ផែនដី
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                គេហវិទ្យា
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                កីឡា
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                អង់គ្លេស
              </th>
              <th style="height: 0px" class="text-left py-2 px-8 border">
                កុំព្យូទ័រ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border">
                <VTextField
                  v-model="form.writing"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.essay"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.khmer"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.morality"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.history"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.geography"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.math"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.physical"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.chemistry"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.biology"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.geology"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.house_education"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.pe"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.english"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
              <td class="border">
                <VTextField
                  v-model="form.computer"
                  hide-details
                  density="compact"
                  variant="outlined"
                />
              </td>
            </tr>
          </tbody>
        </VTable>
        <div class="d-flex ga-3 justify-end mt-4">
          <!-- v-if="isSecondary || isHighschool" -->
          <div style="width: 200px">
            <VTextField
              class="customFont"
              density="compact"
              label="បញ្ចូលតួចែក"
              variant="outlined"
              v-model="form.avg_m"
            />
          </div>
          <v-btn
            variant="tonal"
            class="customFont"
            color="green"
            :loading="isAdd"
            :disabled="isAdd"
            @click="addNewstudentScore"
            >បញ្ចូលពិន្ទុ</v-btn
          >
        </div>
      </VCardText>
    </VCard>
  </div>
</template>
