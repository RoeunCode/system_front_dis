<script setup>
import { onMounted, ref, watch, computed } from "vue";

import axios from "axios";
// import { api } from import { daysInWeek } from "date-fns/constants";
import { api } from "@/utils/axios";
("@/utils/axios");
import Toast from "@/helper";
import { useRoute, useRouter } from "vue-router";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const user_login_role_id = ref(parseInt(user.value.role_id));

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const route = useRoute();
const router = useRouter();
const visible = ref(false);

const campus = ref([]);
const rules = ref({
  required: (value) => !!value || "Field is required",
});

const isloading = ref(false);

const form = ref({
  id: "",
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
  photo_path: "",
  new_photo_path: "",
  campus_ids: [],
  role_id: null,
  is_AllCampus: 0,
  teacher_id: null,
});

const resetForm = () => {
  form.value = {
    id: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    photo_path: "",
    new_photo_path: "",
    campus_ids: [],
    role_id: null,
    is_AllCampus: 0,
    teacher_id: null,
  };
};

// const addParents = () => {
//   console.log(form.value);
// };

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
  if (form.value.id) {
    if (form.value.new_photo_path != "") {
      return typeof form.value.new_photo_path != "string"
        ? URL.createObjectURL(form.value.new_photo_path)
        : "";
    } else {
      return "http://dewey_api.test/storage/" + form.value.photo_path;
    }
  } else {
    return typeof form.value.photo_path != "string"
      ? URL.createObjectURL(form.value.photo_path)
      : "";
  }
};

const getCampus = async () => {
  try {
    const res = await api.post("getAllCampus");
    console.log(res.data);
    campus.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

const teachers = ref([]);

const getTeacher = async () => {
  // loading.value = true;
  try {
    await api
      .post("/get_all_teacher", {
        campus_id: campus_id.value, // Pass campus_id
      })
      .then((res) => {
        teachers.value = res.data;
        console.log(teachers.value);
      });
  } catch (error) {
    console.log(error);
  }
};

const debouncedGetTeacher = debounce(getTeacher, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetTeacher();
  },
  { immediate: true }
);

const roles = ref([]);

const getRole = async () => {
  try {
    const res = await api.post("/getRole");
    roles.value = res.data;
    console.log("All roles:", roles.value);
  } catch (error) {
    console.log(error);
  }
};

const createUser = async () => {
  isloading.value = true;
  if (user_login_role_id.value == 2) {
    form.value.campus_ids = campus_id.value;
  }
  console.log("form", form.value);
  try {
    await api
      .post("/register", form.value, {
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
    console.log(form.value);
    router.push("/user");
  } catch (error) {
    console.log(error);
  } finally {
    isloading.value = false;
    resetForm();
  }
};

watch(
  () => form.value.is_AllCampus,
  (newVal) => {
    if (form.value.is_AllCampus == 1 || form.value.is_AllCampus == true) {
      form.value.campus_ids = campus.value.map((c) => c.id);
    } else {
      form.value.campus_ids = null;
    }
  }
);

const visibleRoles = ref([]);

onMounted(async () => {
  await getCampus();
  await getRole();
  if (roles.value) {
    const computeRole = computed(() => {
      if (user_login_role_id.value === 1 || user_login_role_id.value === "1") {
        return roles.value;
      } else if (user_login_role_id.value === 2) {
        console.log("hello world");
        return roles.value.filter((r) => r.id != 1 && r.id != 2);
      } else {
        return [];
      }
    });
    console.log(computeRole.value);
    console.log("User role ID:", user_login_role_id.value);
    visibleRoles.value = computeRole.value;
  }
});
</script>
<template>
  <div>
    <div>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="mt-2 pa-4 border" elevation="0">
            <v-card-title class="customKhmerMoul text-green-darken-4"
              >បង្កើតអ្នកប្រើប្រាស់
            </v-card-title>

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
                    variant="tonal"
                    color="orange mr-2"
                    @click="refInputEl?.click()"
                  >
                    <VIcon icon="mdi-upload" class="d-sm-none" />
                    <span class="d-none d-sm-block">បញ្ចូលរូបភាព</span>
                  </VBtn>

                  <input
                    ref="refInputEl"
                    type="file"
                    name="file"
                    accept=".jpeg,.png,.jpg,GIF"
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

                <p class="text-body-1 mb-0 mt-2">
                  Allowed JPG, GIF or PNG. Max size of 800K
                </p>
              </form>
            </v-card-text>

            <v-card-text>
              <!-- 👉 Form -->
              <v-form class="mt-1 customFont">
                <v-row>
                  <!-- 👉 UserName -->
                  <v-col md="5" cols="12">
                    <VTextField
                      placeholder="1"
                      density="compact"
                      label="ឈ្មោះអ្នកប្រើប្រាស់"
                      variant="outlined"
                      :rules="[rules.required]"
                      v-model="form.username"
                    />
                  </v-col>

                  <!-- 👉 Email -->
                  <v-col md="7" cols="12">
                    <VTextField
                      density="compact"
                      placeholder="telateang@gmail.com"
                      label="អុីម៉ែល"
                      variant="outlined"
                      :rules="[rules.required]"
                      v-model="form.email"
                    />
                  </v-col>

                  <VCol cols="12" md="6">
                    <VAutocomplete
                      class="customFont"
                      density="compact"
                      label="ជ្រើសរើសបុគ្គលិក"
                      variant="outlined"
                      :items="teachers"
                      item-title="kh_name"
                      item-value="id"
                      v-model="form.teacher_id"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VSelect
                      :items="visibleRoles"
                      item-title="name"
                      item-value="id"
                      class="customFont"
                      density="compact"
                      label="ជ្រើសរើសតួរនាទី"
                      variant="outlined"
                      v-model="form.role_id"
                    />
                  </VCol>
                  <VCol
                    cols="4"
                    md="3"
                    class="pa-0"
                    v-if="user_login_role_id == 1"
                  >
                    <VCheckbox
                      v-model="form.is_AllCampus"
                      class="customFontSiemreap"
                      :true-value="1"
                      :false-value="0"
                      label="គ្រប់សាខា"
                    />
                  </VCol>
                  <VCol cols="12" md="9" v-if="user_login_role_id == 1">
                    <VSelect
                      class="customFont"
                      density="compact"
                      label="ជ្រើសរើសសាខា"
                      variant="outlined"
                      :items="campus"
                      item-title="name"
                      item-value="id"
                      multiple
                      v-model="form.campus_ids"
                    />
                  </VCol>

                  <!-- 👉Password -->
                  <v-col md="6" cols="12">
                    <VTextField
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visible ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock-outline"
                      @click:append-inner="visible = !visible"
                      density="compact"
                      placeholder="tela123"
                      label="លេខសម្ងាត់"
                      variant="outlined"
                      :rules="[rules.required]"
                      v-model="form.password"
                    />
                  </v-col>

                  <!-- 👉Comfirm Password  -->
                  <v-col md="6" cols="12">
                    <VTextField
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visible ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock-outline"
                      @click:append-inner="visible = !visible"
                      density="compact"
                      placeholder="tela123"
                      label="បញ្ជាក់ពាក្យសម្ងាត់"
                      variant="outlined"
                      :rules="[rules.required]"
                      v-model="form.password_confirmation"
                    />
                  </v-col>

                  <!-- 👉 Form Actions -->
                  <VCol cols="12" class="d-flex flex-wrap ga-4 justify-end">
                    <VBtn
                      variant="tonal"
                      color="red"
                      type="reset"
                      @click="resetForm"
                      ><v-icon>mdi-refresh</v-icon>សម្អាត</VBtn
                    >
                    <VBtn
                      @click="createUser"
                      variant="tonal"
                      color="green"
                      :loading="isloading"
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
  </div>
</template>
