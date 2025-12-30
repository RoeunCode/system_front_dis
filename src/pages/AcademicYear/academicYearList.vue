<script setup>
import Toast from "@/helper";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { api } from "@/utils/axios";

const router = useRouter();

const loading = ref(false);

const search = ref();

const years = ref([]);

const get_year = async () => {
  loading.value = true;
  try {
    await api.post("/get_all_year").then((res) => {
      years.value = res.data;
    });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const getId = async (id) => {
  router.push({
    name: "CreateAcademicYear",
    params: { id },
  });
};

const deleteYear = async (id) => {
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
        await api.post(`/delete_year/${id}`);

        get_year();
      }
    });
  } catch (error) {
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
    console.log(error);
  }
};

const headers = ref([
  {
    key: "name",
    title: "ឆ្នាំសិក្សា",
  },
  {
    key: "startDate",
    title: "ចាប់ពីថ្ងៃទី",
  },
  {
    key: "endDate",
    title: "ដល់ថ្ងៃទី",
  },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

onMounted(() => {
  get_year();
});
</script>
<template>
  <div>
    <v-row>
      <v-col cols="12" md="6" class="mt-4">
        <v-card elevation="0" class="pa-4 border border-1">
          <v-row class="align-center">
            <v-col cols="12" md="6">
              <v-card-title class="customKhmerMoul text-green-darken-4"
                >ឆ្នាំសិក្សា
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
                to="/create-year"
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
            :items="years"
            :search="search"
            :loading="loading"
            :loading-text="loading ? 'Loading...' : ''"
            :no-data-text="loading ? '' : 'មិនមានទិន្នន័យទេ'"
            :items-per-page="5"
            class="customFont mt-5 my-custom-table"
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
                @click="deleteYear(row.item.id)"
              >
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
