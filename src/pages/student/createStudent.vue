<script setup>
import Toast from "@/helper";
import { api } from "@/utils/axios";
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const route = useRoute();

const router = useRouter();

const editMode = ref(false);

const isloading = ref(false);

const form = ref({
  student_card_id: "",
  id: "",
  kh_name: "",
  en_name: "",
  gender: 1,
  dob: "",
  village_birth: "",
  commune_birth: "",
  district_birth: "",
  province_birth: "",
  phone: "",
  national: "ខ្មែរ",
  village_address: "",
  commune_address: "",
  district_address: "",
  province_address: "",
  old_school: "",
  old_grade: "",
  old_school_english: "",
  description: "",
  photo_path: "",
  new_photo_path: "",
  m_name: "",
  m_national: "",
  m_job: "",
  m_phone: "",
  m_address: "",
  f_name: "",
  f_national: "",
  f_job: "",
  f_phone: "",
  f_address: "",
  campus_id: campus_id.value,
});
watch(
  () => settingStore.campus_id,
  (newVal) => {
    campus_id.value = newVal;
    form.value.campus_id = campus_id.value;
  }
);

const resetForm = () => {
  form.value = {
    student_card_id: "",
    id: "",
    kh_name: "",
    en_name: "",
    gender: 1,
    dob: "",
    village_birth: "",
    commune_birth: "",
    district_birth: "",
    province_birth: "",
    phone: "",
    national: "",
    village_address: "",
    commune_address: "",
    district_address: "",
    province_address: "",
    old_school: "",
    old_grade: "",
    old_school_english: "",
    description: "",
    photo_path: "",
    new_photo_path: "",
    m_name: "",
    m_national: "",
    m_job: "",
    m_phone: "",
    m_address: "",
    f_name: "",
    f_national: "",
    f_job: "",
    f_phone: "",
    f_address: "",
    campus_id: campus_id.value,
  };
};

const grades = ref([
  { name: "1" },
  { name: "2" },
  { name: "3" },
  { name: "4" },
  { name: "5" },
  { name: "6" },
  { name: "7" },
  { name: "8" },
  { name: "9" },
  { name: "10" },
  { name: "11" },
  { name: "12" },
]);

const nation = ref([
  {
    name: "ខ្មែរ",
  },
  {
    name: "ជនជាតិ",
  },
]);

const gender = ref([
  {
    name: "ប្រុស",
    id: 1,
  },
  {
    name: "ស្រី",
    id: 2,
  },
]);

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
        ? "https://iconic.disreportcard.com/storage/" + form.value.photo_path
        : "";
    }
  } else {
    return isBlobOrFile(form.value.photo_path)
      ? URL.createObjectURL(form.value.photo_path)
      : "";
  }
};

const addStudent = async () => {
  isloading.value = true;
  console.log(form.value);
  try {
    await api
      .post("/add_student", form.value, {
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
    router.push("student");
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

const getOneStudent = async () => {
  try {
    await api.post(`/get_one_student/${route.params.id}`).then((res) => {
      Object.assign(form.value, res.data);
    });
  } catch (error) {}
};

const updateStudent = async () => {
  isloading.value = true;
  try {
    await api
      .post("/updateStudent", form.value, {
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
      name: "StudentList",
    });
  } catch (error) {
    Toast.fire({
      title: error.response.data.messsage,
      icon: "error",
    });
  } finally {
    isloading.value = false;
  }
};

const submit = () => {
  if (editMode.value) {
    updateStudent();
  } else {
    addStudent();
  }
};

onMounted(() => {
  if (route.params.id) {
    editMode.value = true;
  }
  getOneStudent();
});
</script>
<template>
  <div>
    <v-card class="mt-5 pa-4 border border-2" elevation="0">
      <v-card-title class="customKhmerMoul text-green-darken-4"
        ><h3>បង្កើតសិស្ស</h3></v-card-title
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

          <p class="text-body-1 mb-0 mt-2">
            Allowed JPG, GIF or PNG. Max size of 800K
          </p>
        </form>
      </v-card-text>

      <!-- <v-divider></v-divider> -->

      <!-- <v-card-title class="text-primary">Personal Information </v-card-title> -->
      <v-card-text>
        <p class="customFont text-green-darken-4" style="font-size: 18px">
          ព័ត៌មានសិស្ស
        </p>
        <v-divider></v-divider>
        <!-- 👉 Form -->
        <v-form class="customFont mt-5">
          <v-row>
            <!-- 👉 FullName Khmer -->
            <v-col md="3" cols="12" sm="5">
              <VTextField
                placeholder="ទាង​ តេលា"
                label="ឈ្មោះ(ជាភាសាខ្មែរ) *"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.kh_name"
              />
            </v-col>

            <!-- 👉 FullName English -->
            <v-col md="3" cols="12" sm="4">
              <VTextField
                placeholder="TEANG Tela"
                label="ឈ្មោះ(ជាភាសាអក្សរឡាតាំង) *"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.en_name"
              />
            </v-col>

            <!-- 👉 studentId -->
            <v-col md="2" cols="12" sm="3">
              <VTextField
                placeholder="Ex: P 1111"
                label="អត្តលេខ *"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.student_card_id"
              />
            </v-col>

            <!-- 👉 Gender -->
            <v-col md="2" cols="12" sm="4">
              <v-select
                placeholder="ប្រុស"
                label="ភេទ *"
                variant="outlined"
                :items="gender"
                item-title="name"
                item-value="id"
                :rules="[rules.required]"
                density="compact"
                v-model="form.gender"
              />
            </v-col>

            <!-- 👉 National -->
            <v-col md="2" cols="12" sm="4">
              <VSelect
                placeholder="ខ្មែរ"
                :items="nation"
                item-title="name"
                item-value="name"
                label="សញ្ជាតិ *"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.national"
              />
            </v-col>

            <!-- 👉 DataOfBirth -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                label="ថ្ងៃខែឆ្នាំកំណើត *"
                variant="outlined"
                type="date"
                :rules="[rules.required]"
                density="compact"
                v-model="form.dob"
              />
            </v-col>

            <!-- 👉 village of Birth -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="កម្មករ"
                label="ភូមិកំណើត"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.village_birth"
              />
            </v-col>
            <!-- 👉 commune of Birth -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="កម្មករ"
                label="ឃុំ/សង្កាត់កំណើត"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.commune_birth"
              />
            </v-col>
            <!-- 👉 district of Birth -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="កម្មករ"
                label="ស្រុកកំណើត"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.district_birth"
              />
            </v-col>
            <!-- 👉 province of Birth -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="កម្មករ"
                label="ខេត្តកំណើត"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.province_birth"
              />
            </v-col>

            <!-- 👉 Email -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="telateang@gmail.com"
                label="អុីម៉ែល"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.email"
              />
            </v-col>

            <!-- 👉 PhoneNumber -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="096 2211 209"
                label="លេខទូរស័ព្ទ"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.phone"
              />
            </v-col>

            <!-- 👉village Address -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="កម្មករ"
                label="ភូមិបច្ចុប្បន្ន"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.village_address"
              />
            </v-col>
            <!-- 👉comune Address -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="កម្មករ"
                label="ឃុំ/សង្កាត់បច្ចុប្បន្ន"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.commune_address"
              />
            </v-col>

            <!-- 👉district Address -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="កម្មករ"
                label="ស្រុកបច្ចុប្បន្ន"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.district_address"
              />
            </v-col>
            <!-- 👉province Address -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="កម្មករ"
                label="ខេត្តបច្ចុប្បន្ន"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.province_address"
              />
            </v-col>
            <!-- 👉 oldGrade -->
            <v-col md="2" cols="12" sm="2">
              <VSelect
                placeholder="ថ្នាក់សាលាចាស់"
                label="ថ្នាក់ទី"
                :items="grades"
                item-title="name"
                item-value="name"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.old_grade"
              />
            </v-col>

            <!-- 👉 FromSchool -->
            <v-col md="4" cols="12" sm="3">
              <VTextField
                placeholder="សាលាឌូវី"
                label="ប្ដូរមកពីសាលា"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.old_school"
              />
            </v-col>

            <!-- 👉 FromEnglishSchool -->
            <v-col md="4" cols="12" sm="3">
              <VTextField
                placeholder="Dewey International School"
                label="From English School"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.old_school_english"
              />
            </v-col>
          </v-row>

          <p
            class="mt-2 customFont text-green-darken-4"
            style="font-size: 18px"
          >
            ព័ត៌មានអាណាព្យាបាល
          </p>
          <v-divider></v-divider>

          <v-row class="mt-5">
            <!-- 👉Mothername  -->
            <v-col md="3" cols="12" sm="5">
              <VTextField
                placeholder="ឃុន នារី"
                label="ម្ដាយឈ្មោះ"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.m_name"
              />
            </v-col>
            <!-- 👉 nation -->
            <v-col md="2" cols="12" sm="3">
              <VSelect
                placeholder="ខ្មែរ"
                :items="nation"
                item-title="name"
                item-value="name"
                label="សញ្ជាតិ"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.m_national"
              />
            </v-col>
            <!-- 👉 job -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="គ្រូបង្រៀន"
                label="មុខរបរ"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.m_job"
              />
            </v-col>

            <!-- 👉 phone -->
            <v-col md="2" cols="12" sm="6">
              <VTextField
                placeholder="សាលាឌូវី"
                label="លេខទូរស័ព្ទ"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.m_phone"
              />
            </v-col>
            <!-- 👉 អស័យដ្ឋានបច្ចុប្បន្ន -->
            <v-col md="3" cols="12" sm="6">
              <VTextField
                placeholder="ភូមិ ឃុំ ស្រុក ខេត្ត"
                label="អស័យដ្ឋានបច្ចុប្បន្ន"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.m_address"
              />
            </v-col>

            <!-- 👉Father name  -->
            <v-col md="3" cols="12" sm="5">
              <VTextField
                placeholder="សាលាឌូវី"
                label="ឪពុកឈ្មោះ"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.f_name"
              />
            </v-col>
            <!-- 👉 nation -->
            <v-col md="2" cols="12" sm="3">
              <VSelect
                placeholder="ខ្មែរ"
                label="សញ្ជាតិ"
                :items="nation"
                item-title="name"
                item-value="name"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.f_national"
              />
            </v-col>
            <!-- 👉 job -->
            <v-col md="2" cols="12" sm="4">
              <VTextField
                placeholder="សាលាឌូវី"
                label="មុខរបរ"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.f_job"
              />
            </v-col>
            <!-- 👉 phone -->
            <v-col md="2" cols="12" sm="6">
              <VTextField
                placeholder="0988773434"
                label="លេខទូរស័ព្ទ"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.f_phone"
              />
            </v-col>
            <!-- 👉 address -->
            <v-col md="3" cols="12" sm="6">
              <VTextField
                placeholder="ភូមិ ឃុំ ស្រុក ខេត្ត"
                label="អស័យដ្ឋានបច្ចុប្បន្ន"
                variant="outlined"
                :rules="[rules.required]"
                density="compact"
                v-model="form.f_address"
              />
            </v-col>

            <!-- 👉 Description -->
            <v-col cols="12" md="12">
              <v-textarea
                clearable
                label="កត់សម្គាល់"
                row-height="25"
                rows="3"
                variant="outlined"
                auto-grow
                shaped
                v-model="form.description"
              ></v-textarea>
            </v-col>

            <!-- 👉 Form Actions -->
            <VCol cols="12" class="d-flex ga-4 justify-end">
              <VBtn color="red" type="reset" variant="tonal" @click="resetForm">
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
  </div>
</template>
