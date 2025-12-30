<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import Toast from "@/helper";
import { api } from "@/utils/axios";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const router = useRouter();

const isloading = ref(false);

const route = useRoute();

const editMode = ref(false);

const form = ref({
  edu_id: null,
  id_academic: null,
  campus_id: campus_id.value,
});

watch(
  () => settingStore.campus_id,
  (newVal) => {
    campus_id.value = newVal;
    form.value.campus_id = campus_id.value;
  }
);

function resetForm() {
  form.value = {
    edu_id: null,
    id_academic: null,
    campus_id: campus_id.value,
  };
}

const addSettingScoreconfig = async () => {
  try {
    isloading.value = true;
    await api
      .post("/add_room", form.value, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    router.push("room");
    resetForm();
  } catch (error) {
    console.log(error);
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};

const getOneRoom = async () => {
  try {
    await api.post(`/getOneRoom/${route.params.id}`).then((res) => {
      form.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const updateRoom = async () => {
  try {
    isloading.value = true;
    await api.post("/updateRoom", form.value).then((res) => {
      Toast.fire({
        title: res.data.message,
        icon: "success",
      });
    });
    router.push({
      name: "RoomList",
    });
    resetForm();
  } catch (error) {
    console.log(error);
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};

const years = ref([]);

const get_year = async () => {
  try {
    await api.post("/get_all_year").then((res) => {
      years.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const educationLevels = ref([]);

const getEdu = async () => {
  try {
    await api.post("/get_all_edu").then((res) => {
      educationLevels.value = res.data;
      console.log(educationLevels.value);
    });
  } catch (error) {
    console.log(error);
  }
};

const submit = () => {
  if (editMode.value) {
    updateRoom();
  } else {
    addSettingScoreconfig();
  }
};

onMounted(() => {
  if (route.params.id) {
    editMode.value = true;
    getOneRoom();
  }
  get_year();
  getEdu();
});
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="4" sm="10">
        <v-card class="mt-2 pa-4 border border-1" elevation="0">
          <v-card-title class="customKhmerMoul text-green-darken-4"
            >បង្កើតការកំណត់តួរចែក
          </v-card-title>

          <v-card-text>
            <!-- 👉 Form -->
            <v-form class="mt-6 customFont">
              <v-row>
                <!-- 👉 year -->
                <VCol cols="12" md="6">
                  <VSelect
                    :items="years"
                    item-value="id"
                    item-title="name"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="ឆ្នាំសិក្សា"
                    variant="outlined"
                    v-model="form.id_academic"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VSelect
                    :items="educationLevels"
                    item-value="id"
                    item-title="edu_name"
                    class="customFont"
                    density="compact"
                    placeholder="៦"
                    label="កម្រិតអប់រំ"
                    variant="outlined"
                    v-model="form.edu_id"
                  />
                </VCol>

                <!-- 👉 Form Actions -->
                <VCol cols="12" class="d-flex flex-wrap ga-4 justify-end">
                  <VBtn
                    color="red"
                    variant="tonal"
                    type="reset"
                    elevation="0"
                    @click="resetForm()"
                    ><v-icon>mdi-refresh</v-icon>សម្អាត</VBtn
                  >
                  <VBtn
                    :loading="isloading"
                    :disabled="isloading"
                    @click="submit"
                    color="green"
                    variant="tonal"
                    elevation="0"
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
