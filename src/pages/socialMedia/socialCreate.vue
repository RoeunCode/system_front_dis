<script setup>
import Toast from "@/helper";
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api } from "@/utils/axios";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);
const route = useRoute();

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const user_id = ref(user.value.id);

const router = useRouter();

const editMode = ref(false);

const isloading = ref(false);

const form = ref({
  id: "",
  name: "",
  link: "",
  user_id: user_id.value,
  photo_path: "",
  new_photo_path: "",
  campus_id: campus_id.value,
});

const resetForm = () => {
  form.value = {
    id: "",
    name: "",
    link: "",
    user_id: user_id.value,
    photo_path: "",
    new_photo_path: "",
    campus_id: campus_id.value,
  };
};

watch(
  () => settingStore.campus_id,
  (newVal) => {
    campus_id.value = newVal;
    form.value.campus_id = campus_id.value;
  }
);

// const nation = ref([
//   {
//     name: "ខ្មែរ",
//   },
//   {
//     name: "ជនជាតិ",
//   },
// ]);

// const gender = ref([
//   {
//     name: "ប្រុស",
//     id: 1,
//   },
//   {
//     name: "ស្រី",
//     id: 2,
//   },
// ]);

const rules = ref({
  required: (value) => !!value || "Field is required",
});

// Filter rooms where status = 0

const refInputEl = ref("");

const handleFileUpload = (e) => {
  let file = e.target.files[0];
  if (form.value.id) {
    form.value.new_photo_path = file;
  } else {
    form.value.photo_path = file;
  }
};

const getPhoto = () => {
  const isBlobOrFile = (value) =>
    value instanceof Blob || value instanceof File;
  if (form.value.id) {
    if (form.value.new_photo_path && form.value.new_photo_path !== "") {
      return isBlobOrFile(form.value.new_photo_path)
        ? URL.createObjectURL(form.value.new_photo_path)
        : "";
    } else {
      return form.value.photo_path
        ? "http://127.0.0.1:8000/storage/" + form.value.photo_path
        : "";
    }
  } else {
    return isBlobOrFile(form.value.photo_path)
      ? URL.createObjectURL(form.value.photo_path)
      : "";
  }
};

const addSocial = async () => {
  isloading.value = true;
  console.log("social", form.value);
  try {
    await api
      .post("/addSocial", form.value, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    resetForm();
    router.push("social");
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};

const updateSocial = async () => {
  isloading.value = true;
  try {
    await api
      .post("/updateSocial", form.value, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
      });
    router.push({
      name: "SocialList",
    });
  } catch (error) {
    console.log(error);
  } finally {
    isloading.value = false;
  }
};

const getOneSocial = async () => {
  try {
    await api.post(`/getOneSocial/${route.params.id}`).then((res) => {
      Object.assign(form.value, res.data);
      // form.value = res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const submit = () => {
  if (editMode.value) {
    updateSocial();
  } else {
    addSocial();
  }
};

onMounted(() => {
  if (route.params.id) {
    editMode.value = true;
    console.log(editMode.value);
    getOneSocial();
  }
});
</script>
<template>
  <div>
    <VRow>
      <VCol cols="12" md="6">
        <v-card class="mt-5 pa-4 border" elevation="0">
          <v-card-title class="customKhmerMoul text-green-darken-4"
            ><h4>បង្កើតប្រព័ន្ធផ្សព្វផ្សាយ</h4></v-card-title
          >

          <v-card-text class="d-flex mt-3">
            <!-- 👉 Avatar -->
            <V-avatar
              rounded="lg"
              size="100"
              class="me-6 rounded-lg border-sm"
              :image="getPhoto()"
            />

            <!-- 👉 Upload Photo -->
            <form class="d-flex flex-column justify-center gap-5 customFont">
              <div class="d-flex flex-wrap">
                <VBtn
                  color="orange mr-2"
                  @click="refInputEl?.click()"
                  variant="tonal"
                >
                  <VIcon icon="mdi-upload" class="d-sm-none" />
                  <span class="d-none d-sm-block">បញ្ចូលរូបភាព</span>
                </VBtn>

                <input
                  ref="refInputEl"
                  type="file"
                  name="file"
                  hidden
                  @input="handleFileUpload"
                />

                <!-- <VBtn
              type="reset"
              color="error"
              variant="tonal"
              @click="resetAvatar"
            >
              <span class="d-none d-sm-block">សម្អាត</span>
              <VIcon icon="mdi-delete-alert" class="d-sm-none" />
            </VBtn> -->
              </div>

              <p class="text-body-3 mb-0 mt-2">
                Allowed JPG, GIF or PNG. Max size of 800K
              </p>
            </form>
          </v-card-text>

          <v-divider></v-divider>

          <!-- <v-card-title class="text-primary">Personal Information </v-card-title> -->
          <v-card-text>
            <!-- 👉 Form -->
            <v-form class="customFont">
              <v-row>
                <!-- 👉 FullName Khmer -->
                <v-col md="6" cols="12" :height="50" sm="4">
                  <VTextField
                    placeholder="ទាង​ តេលា"
                    label="ឈ្មោះ *"
                    variant="outlined"
                    :rules="[rules.required]"
                    density="compact"
                    v-model="form.name"
                  />
                </v-col>

                <!-- 👉 FullName English -->
                <v-col md="6" cols="12" sm="4">
                  <VTextField
                    placeholder="TEANG Tela"
                    label="តំណរភ្ជាប់*"
                    variant="outlined"
                    :rules="[rules.required]"
                    density="compact"
                    v-model="form.link"
                  />
                </v-col>

                <!-- 👉 Form Actions -->
                <VCol cols="12" class="d-flex ga-4 justify-end">
                  <VBtn
                    variant="tonal"
                    color="red"
                    type="reset"
                    @click="resetForm"
                  >
                    សម្អាត
                  </VBtn>
                  <VBtn
                    :loading="isloading"
                    :disabled="isloading"
                    @click="submit"
                    color="green"
                    variant="tonal"
                    >រក្សាទុក</VBtn
                  >
                </VCol>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </VCol>
    </VRow>
  </div>
</template>
