<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import Toast from "@/helper";
import RoomList from "./roomList.vue";
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
  room_number: "",
  building: "",
  floor: "",
  description: "",
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
    room_number: "",
    building: "",
    floor: "",
    description: "",
    campus_id: campus_id.value,
  };
}

const building = ref([
  {
    name: "អគារ A",
  },
  {
    name: "អគារ B",
  },
  {
    name: "អគារ C",
  },
]);

const floor = ref([
  {
    name: "ជាន់ទី ដី",
  },
  {
    name: "ជាន់ទី ១",
  },
  {
    name: "ជាន់ទី ២",
  },
  {
    name: "ជាន់ទី ៣",
  },
]);

const addRoom = async () => {
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

const submit = () => {
  if (editMode.value) {
    updateRoom();
  } else {
    addRoom();
  }
};

const rules = ref({
  required: (value) => !!value || "Field is required",
});

onMounted(() => {
  if (route.params.id) {
    editMode.value = true;
    getOneRoom();
  }
});
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="6" sm="10">
        <v-card class="mt-2 pa-4 border border-1" elevation="0">
          <v-card-title class="customKhmerMoul text-green-darken-4"
            >បង្កើតបន្ទប់
          </v-card-title>

          <v-card-text>
            <!-- 👉 Form -->
            <v-form class="mt-6 customFont">
              <v-row>
                <!-- 👉 Room number -->
                <v-col md="4" cols="12" sm="4">
                  <VTextField
                    placeholder="1"
                    density="compact"
                    type="number"
                    label="លេខបន្ទប់*"
                    variant="outlined"
                    :rules="[rules.required]"
                    v-model="form.room_number"
                  />
                </v-col>

                <!-- 👉 building -->
                <v-col md="4" cols="12" sm="4">
                  <VSelect
                    :items="building"
                    item-title="name"
                    item-value="name"
                    density="compact"
                    placeholder=" អគារ A"
                    label="អគារ"
                    variant="outlined"
                    :rules="[rules.required]"
                    v-model="form.building"
                  />
                </v-col>

                <!-- 👉 floor -->
                <v-col md="4" cols="12" sm="4">
                  <VSelect
                    :items="floor"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    placeholder="ជាន់ទី ១"
                    label="ជាន់"
                    variant="outlined"
                    :rules="[rules.required]"
                    v-model="form.floor"
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
