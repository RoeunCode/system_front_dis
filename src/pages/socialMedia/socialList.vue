<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";
import { useRouter } from "vue-router";

const router = useRouter();

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const socials = ref([]);

const isloading = ref(false);

const getSocial = async () => {
  isloading.value = true;
  try {
    await api.post(`/getSocial/${campus_id.value}`).then((res) => {
      socials.value = res.data.data;
    });
  } catch (error) {
    console.log(error);
    isloading.value = false;
  } finally {
    isloading.value = false;
  }
};

const debouncedGetSocial = debounce(getSocial, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetSocial();
  },
  { immediate: true }
);

const deleteSocial = async (id) => {
  try {
    await api.post(`deleteSocial/${id}`).then((res) => {
      Toast.fire({
        title: res.data.message,
        icon: "success",
      });
    });
    getSocial();
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  }
};

const images = (img) => {
  return "http://127.0.0.1:8000/storage/" + img;
};

const headers = ref([
  // {
  //   key: "id",
  //   title: "លេខរៀង",
  // },
  {
    key: "name",
    title: "ឈ្មោះ",
  },
  {
    key: "link",
    title: "តំណរភ្ជាប់",
  },
  {
    key: "photo_path",
    title: "រូបភាព",
  },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

const getId = async (id) => {
  router.push({
    name: "SocialCreate",
    params: { id },
  });
};

const routeToSocial = (id) => {
  router.push({
    name: "Social_detail",
    params: { id },
  });
};

const search = ref("");

onMounted(async () => {
  // await getAllUser();
  // console.log("user", user.value);
});
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="7" class="mt-4">
        <v-card elevation="0" class="pa-4 border">
          <v-row class="align-center">
            <v-col cols="12" md="6">
              <v-card-title class="customKhmerMoul text-green-darken-4"
                ><v-icon>mdi-account</v-icon> ប្រព័ន្ធផ្សព្វផ្សាយ
              </v-card-title>
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center ga-1 justify-end"
            >
              <!-- <v-text-field
                class="customFont"
                append-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                label="ស្វែងរក"
                hide-details
                single-line
                v-model="search"
              ></v-text-field> -->
              <v-btn
                prepend-icon="mdi-eye"
                @click="routeToSocial(campus_id)"
                color="orange"
                variant="tonal"
                class="customFont"
              >
                មើលលម្អិត
              </v-btn>
              <v-btn
                prepend-icon="mdi-plus"
                to="/create-social"
                color="green"
                variant="tonal"
                class="customFont"
              >
                បង្កើត
              </v-btn>
            </v-col>
          </v-row>

          <!-- <v-btn @click="printFunc"> Print </v-btn> -->

          <v-data-table
            :headers="headers"
            :items="socials"
            :search="search"
            :loading="isloading"
            :loading-text="isloading ? 'Loading...' : ''"
            :no-data-text="isloading ? '' : 'មិនមានទិន្នន័យទេ'"
            :items-per-page="5"
            class="customFont mt-5"
          >
            <template #[`item.photo_path`]="{ item }">
              <div>
                <v-img
                  v-if="item.photo_path"
                  :src="images(item.photo_path)"
                  width="50"
                  height="50"
                ></v-img>
                <v-img
                  v-else
                  src="https://st4.depositphotos.com/9998432/24428/v/450/depositphotos_244284796-stock-illustration-person-gray-photo-placeholder-man.jpg"
                  width="50"
                  height="50"
                ></v-img>
              </div>
            </template>

            <template v-slot:item.action="row">
              <v-btn
                class="text-warning mr-4"
                icon="mdi-pen"
                size="sm"
                flat
                @click="getId(row.item.id)"
              ></v-btn>
              <v-btn
                class="text-error"
                icon="mdi-delete"
                size="sm"
                flat
                @click="deleteSocial(row.item.id)"
              >
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
