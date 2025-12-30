<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import Toast from "@/helper";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { api } from "@/utils/axios";

import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

const router = useRouter();

const loading = ref(false);

const search = ref();

const rooms = ref([]);

const get_room = async () => {
  loading.value = true;
  try {
    await api
      .post("/get_all_room", {
        campus_id: campus_id.value,
      })
      .then((res) => {
        rooms.value = res.data;
        console.log(grades.value);
      });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const delete_room = async (id) => {
  try {
    Swal.fire({
      title: "តើអ្នកប្រាកដដែរឬទេថាចង់លុប?",
      text: "បើលុបហើយមិនអាចត្រលប់មកវិញទេ",
      showCancelButton: true,
      confirmButtonColor: "#ED5E68",
      cancelButtonColor: "#8388A4",
      confirmButtonText: "បាទ/ចា៎, លុប",
      cancelButtonText: "បោះបង់",
      customClass: {
        popup: "colored-toast custom-delete-swal-title",
        cancelButton: "custom-swal-cancel-button",
        confirmButton: "custom-swal-confirm-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.post(`delete_room/${id}`);
        get_room();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const getIdRoom = (id) => {
  router.push({
    name: "CreateRoom",
    params: { id },
  });
};

const headers = ref([
  {
    key: "room_number",
    title: "លេខបន្ទប់",
  },
  {
    key: "building",
    title: "អគារ",
  },
  {
    key: "floor",
    title: "ជាន់",
  },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

const debouncedGetRroom = debounce(get_room, 500);
watch(
  () => settingStore.campus_id,
  (newCampusId) => {
    campus_id.value = newCampusId;
    debouncedGetRroom();
  },
  { immediate: true }
);

onMounted(() => {
  // get_room();
});
</script>
<template>
  <div>
    <v-row>
      <v-col cols="12" md="5" class="mt-4">
        <v-card elevation="0" class="pa-4 border border-1">
          <v-row class="align-center">
            <v-col cols="12" md="6">
              <v-card-title class="customKhmerMoul text-green-darken-4"
                >បញ្ជីបន្ទប់
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
                prepend-icon="mdi-home-plus-outline"
                to="/create-room"
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
            :items="rooms"
            :search="search"
            :loading="loading"
            :loading-text="loading ? 'Loading...' : ''"
            :no-data-text="loading ? '' : 'មិនមានទិន្នន័យទេ'"
            :items-per-page="7"
            class="customFont mt-5"
            id="printArea"
          >
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="
                  item.status == 0 || item.status == null ? 'green' : 'red'
                "
                :text="
                  item.status == 0 || item.status == null ? 'ទំនេរ' : 'មិនទំនេរ'
                "
                class="text-uppercase"
                size="small"
                label
              ></v-chip>
            </template>

            <template v-slot:item.building="{ item }">
              <p>
                {{
                  item.building === "" || item.building === null
                    ? "N/A"
                    : item.building
                }}
              </p>
            </template>
            <template v-slot:item.floor="{ item }">
              <p>
                {{
                  item.floor === "" || item.floor === null ? "N/A" : item.floor
                }}
              </p>
            </template>

            <template v-slot:item.action="row">
              <!-- <v-btn icon="mdi-eye" flat size="sm" class="text-blue"> </v-btn> -->
              <v-btn
                class="text-warning mr-4"
                icon="mdi-pen"
                size="sm"
                flat
                @click="getIdRoom(row.item.id)"
              ></v-btn>
              <v-btn
                class="text-error"
                icon="mdi-delete"
                size="sm"
                flat
                @click="delete_room(row.item.id)"
              >
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
