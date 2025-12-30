<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import Toast from "@/helper";
import { api } from "@/utils/axios";

const router = useRouter();

const isloading = ref(false);

const route = useRoute();

const editMode = ref(false);

const form = ref({
  name: "",
  startDate: "",
  endDate: "",
});

function resetForm() {
  form.value = {
    name: "",
    startDate: "",
    endDate: "",
  };
}

const addYear = async () => {
  try {
    isloading.value = true;
    await api
      .post("/add_year", form.value, {
        headers: {
          "Content-Length": "application/json",
        },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    router.push("year");
    resetForm();
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};

const getOneYear = async () => {
  await api.post(`/getOneYear/${route.params.id}`).then((res) => {
    form.value = res.data;
  });
};

const updateYear = async () => {
  try {
    isloading.value = true;
    await api.post("/updateYear", form.value).then((res) => {
      Toast.fire({
        title: res.data.message,
        icon: "success",
      });
    });
    router.push({ name: "AcademicYearList" });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};

const submit = () => {
  if (editMode.value) {
    updateYear();
  } else {
    addYear();
  }
};

const rules = ref({
  required: (value) => !!value || "Field is required",
});

onMounted(() => {
  if (route.params.id) {
    editMode.value = true;
    getOneYear();
  }
});
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="5" sm="8">
        <v-card class="mt-2 pa-4 border border-1" elevation="0">
          <v-card-title class="customKhmerMoul text-green-darken-4"
            >បង្កើតឆ្នាំសិក្សាថ្មី
          </v-card-title>

          <v-card-text>
            <!-- 👉 Form -->
            <v-form class="mt-6 customFont">
              <v-row>
                <!-- 👉 Room number -->
                <v-col md="12" cols="12" sm="12">
                  <VTextField
                    placeholder="1"
                    density="compact"
                    label="ឈ្មោះឆ្នាំសិក្សា*"
                    variant="outlined"
                    :rules="[rules.required]"
                    v-model="form.name"
                  />
                </v-col>

                <!-- StartDate -->
                <v-col md="6" cols="12" sm="6">
                  <VTextField
                    placeholder="1"
                    density="compact"
                    label="ចាប់ពីថ្ងៃទី*"
                    type="date"
                    variant="outlined"
                    :rules="[rules.required]"
                    v-model="form.startDate"
                  />
                </v-col>

                <!-- EndDate -->
                <v-col md="6" cols="12" sm="6">
                  <VTextField
                    placeholder="1"
                    type="date"
                    density="compact"
                    label="ដល់ថ្ងៃទី*"
                    variant="outlined"
                    :rules="[rules.required]"
                    v-model="form.endDate"
                  />
                </v-col>

                <!-- 👉 Form Actions -->
                <VCol cols="12" class="d-flex flex-wrap ga-4 justify-end">
                  <VBtn
                    color="red"
                    type="reset"
                    elevation="0"
                    @click="resetForm()"
                    variant="tonal"
                    ><v-icon>mdi-refresh</v-icon>សម្អាត</VBtn
                  >
                  <VBtn
                    :loading="isloading"
                    :disabled="isloading"
                    @click="submit"
                    color="green"
                    elevation="0"
                    variant="tonal"
                  >
                    <v-icon>mdi-download</v-icon>រក្សាទុក
                  </VBtn>
                </VCol>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
