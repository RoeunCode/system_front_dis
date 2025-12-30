<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import axios from "axios";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const route = useRoute();
const router = useRouter();

const visible = ref(false);
const isLoading = ref(false);

const rules = {
  required: (value) => !!value || "Field is required",
};

const email_username = ref("");

watch(
  () => email_username.value,
  (newVal) => {
    form.value.username = newVal;
    form.value.email = newVal;
  }
);

const form = ref({
  id: "",
  username: email_username.value,
  email: email_username.value,
  password: "",
  password_confirmation: "",
  student_id: "",
  photo_path: "",
  new_photo_path: "",
  campus_ids: campus_id.value,
  is_AllCampus: 0,
});

const resetForm = () => {
  form.value = {
    id: "",
    username: email_username.value,
    email: email_username.value,
    password: "",
    password_confirmation: "",
    student_id: "",
    photo_path: "",
    new_photo_path: "",
    campus_ids: campus_id.value,
    is_AllCampus: 0,
  };
  email_username.value = "";
  model.value = null;
};

watch(
  () => settingStore.campus_id,
  (newVal) => {
    campus_id.value = newVal;
    form.value.campus_id = campus_id.value;
  }
);

const CreateParent = async () => {
  form.value.student_id = model.value.map((item) => item.id).join(",");
  console.log(form.value);
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
    resetForm();
    router.push({
      name: "ParentList",
    });

    console.log(form.value);
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
    console.log(error);
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  }
};

const refInputEl = ref(null);

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (form.value.id) {
    form.value.new_photo_path = file;
  } else {
    form.value.photo_path = file;
  }
};

const getPhoto = () => {
  if (form.value.id) {
    if (
      form.value.new_photo_path &&
      typeof form.value.new_photo_path !== "string"
    ) {
      return URL.createObjectURL(form.value.new_photo_path);
    } else {
      return `http://dewey_api.test/storage/${form.value.photo_path}`;
    }
  } else {
    if (form.value.photo_path && typeof form.value.photo_path !== "string") {
      return URL.createObjectURL(form.value.photo_path);
    } else {
      return "";
    }
  }
};

const items = ref([
  { header: true, title: "Select an option or create one", id: "" },
]);

const getStudent = async () => {
  try {
    const findStudent = "all_student_name";
    const res = await api.post(`/get_all_student?year=${findStudent}`, {
      selectedCampusId: campus_id.value, // Pass campus_id in the request
    });
    console.log(res.data);

    if (Array.isArray(res.data)) {
      const students = res.data.map((s) => ({
        title: s.kh_name,
        id: s.id,
      }));

      items.value = [
        { header: true, title: "Select an option or create one" },
        ...students,
      ];

      console.log("dataStu", items.value);
    }
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }
};

const model = ref([]);
const search = ref("");
const nonce = ref(1);
const colors = ["green", "blue", "red", "orange", "purple"]; // Example colors

watch(model.value, (val, prev) => {
  if (val.length === prev.length) return;
  model.value = val.map((v) => {
    if (typeof v === "string") {
      const newItem = {
        title: v,
        kh_name: v,
        color: colors[nonce.value % colors.length],
      };
      //   items.value.push(newItem);
      nonce.value++;
      return newItem;
    }
    return v;
  });
});

const filter = (value, queryText, item) => {
  const query = queryText.toLowerCase();
  const text = item.raw.title?.toLowerCase() || "";
  return text.includes(query);
};

const removeSelection = (index) => {
  model.value.splice(index, 1);
};

const debouncedGetStudent = debounce(getStudent, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetStudent();
  },
  { immediate: true }
);

// onMounted(() => {
//   getStudent();
// });
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mt-2 pa-4 border" elevation="0">
          <v-card-title class="customKhmerMoul text-green-darken-4">
            បង្កើតអាណាព្យាបាល
          </v-card-title>

          <v-card-text class="d-flex mt-3">
            <!-- 👉 Avatar -->
            <v-avatar
              rounded="lg"
              size="100"
              class="me-6 rounded-lg border-sm"
              :image="getPhoto()"
            />

            <!-- 👉 Upload Photo -->
            <form class="d-flex flex-column justify-center gap-5 customFont">
              <div class="d-flex flex-wrap">
                <v-btn
                  variant="tonal"
                  color="orange mr-2"
                  @click="refInputEl?.click()"
                >
                  <v-icon icon="mdi-upload" class="d-sm-none" />
                  <span class="d-none d-sm-block">បញ្ចូលរូបភាព</span>
                </v-btn>

                <input
                  ref="refInputEl"
                  type="file"
                  name="file"
                  accept=".jpeg,.png,.jpg,.gif"
                  hidden
                  @change="handleFileUpload"
                />
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
                <v-col md="6" cols="12">
                  <v-text-field
                    placeholder="ex: telateang@gmail.com"
                    density="compact"
                    label="អុីម៉ែល"
                    variant="outlined"
                    v-model="email_username"
                  />
                </v-col>

                <!-- 👉 Email -->
                <!-- <v-col md="6" cols="12">
                  <v-text-field
                    density="compact"
                    placeholder="telateang@gmail.com"
                    label="អុីម៉ែល"
                    variant="outlined"
                    :rules="[rules.required]"
                    v-model="form.email"
                  />
                </v-col> -->

                <!-- 👉 Password -->
                <v-col md="6" cols="12">
                  <v-text-field
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

                <!-- 👉 Confirm Password -->
                <v-col md="6" cols="12">
                  <v-text-field
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

                <!-- 👉 Combobox -->
                <!-- {{ items }} -->
                <v-col cols="12" md="6">
                  <VCombobox
                    v-model="model"
                    v-model:search="search"
                    :items="items"
                    :custom-filter="filter"
                    item-title="title"
                    item-value="id"
                    label="ជ្រើសរើសសិស្ស"
                    variant="outlined"
                    density="compact"
                    hide-selected
                    multiple
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip
                        v-if="item && typeof item === 'object'"
                        color="green-lighten-4"
                        :text="item.kh_name || item.title"
                        size="small"
                        variant="flat"
                        closable
                        label
                        @click:close="removeSelection(index)"
                      />
                    </template>
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-if="item.raw.header && search">
                        <span class="mr-3">Create</span>
                        <v-chip size="small" variant="flat" label>
                          {{ search }}
                        </v-chip>
                      </v-list-item>
                      <v-list-subheader
                        v-else-if="item.raw.header"
                        :title="item.raw.title"
                      />
                      <v-list-item v-else @click="props.onClick">
                        <v-chip
                          :text="item.raw.kh_name || item.raw.title"
                          variant="flat"
                          color="red-lighten-3"
                          label
                        />
                      </v-list-item>
                    </template>
                  </VCombobox>
                </v-col>

                <!-- 👉 Form Actions -->
                <v-col cols="12" class="d-flex flex-wrap ga-4 justify-end">
                  <v-btn
                    variant="tonal"
                    color="red"
                    type="reset"
                    @click="resetForm"
                  >
                    <v-icon>mdi-refresh</v-icon>សម្អាត
                  </v-btn>
                  <v-btn
                    @click="CreateParent"
                    variant="tonal"
                    color="green"
                    :loading="isLoading"
                  >
                    <v-icon>mdi-download</v-icon>រក្សាទុក
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
