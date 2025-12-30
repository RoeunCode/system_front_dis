<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "@/utils/axios";
import Toast from "@/helper";
import { useRouter } from "vue-router";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const router = useRouter();

const users = ref([]);

const isloading = ref(false);

const getAllUser = async () => {
  isloading.value = true;
  try {
    await api
      .post("get_all_user", {
        campus_id: campus_id.value, // Pass campus_id
      })
      .then((res) => {
        users.value = res.data.filter((u) => u.student_id != null);
        console.log(res.data.filter((u) => u.student_id != null));
      });
  } catch (error) {
    console.log(error);
    isloading.value = false;
  } finally {
    isloading.value = false;
  }
};

const deleteUser = async (id) => {
  console.log(id);
  try {
    await api.post(`delete_user/${id}`).then((res) => {
      Toast.fire({
        title: res.data.message,
        icon: "success",
      });
    });
    getAllUser();
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  }
};

const images = (img) => {
  return "https://iconic.disreportcard.com/storage/" + img;
};

const headers = ref([
  {
    key: "username",
    title: "ឈ្មោះ",
  },
  {
    key: "email",
    title: "អុីម៉ែល",
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

const userDetail = async (id) => {
  router.push({
    name: "ParentDetail",
    params: { id },
  });
};

const search = ref("");

const debouncedGetAllUser = debounce(getAllUser, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetAllUser();
  },
  { immediate: true }
);

onMounted(async () => {
  // await getAllUser();
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
                ><v-icon>mdi-account</v-icon> បញ្ជីអាណាព្យាបាល
              </v-card-title>
            </v-col>
            <v-col cols="12" md="6" class="d-flex align-center ga-2">
              <v-text-field
                class="customFont"
                append-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                label="ស្វែងរក"
                hide-details
                single-line
                v-model="search"
              ></v-text-field>
              <v-btn
                prepend-icon="mdi-plus"
                to="/create-parent"
                elevation="3"
                class="bg-green customFont"
              >
                បង្កើត
              </v-btn>
            </v-col>
          </v-row>

          <!-- <v-btn @click="printFunc"> Print </v-btn> -->

          <v-data-table
            :headers="headers"
            :items="users"
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
                class="text-green mr-4"
                icon="mdi-eye"
                size="sm"
                flat
                @click="userDetail(row.item.id)"
              ></v-btn>
              <v-btn
                class="text-error"
                icon="mdi-delete"
                size="sm"
                flat
                @click="deleteUser(row.item.id)"
              >
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
