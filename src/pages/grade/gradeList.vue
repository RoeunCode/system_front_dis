<script setup>
import Toast from "@/helper";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { api } from "@/utils/axios";

const isloading = ref(false);

const route = useRoute();

const router = useRouter();

const search = ref();

const grades = ref([]);

const get_grade = async () => {
  try {
    isloading.value = true;
    await api.post("/get_all_grade").then((res) => {
      grades.value = res.data;
      console.log(grades.value);
    });
  } catch (error) {
    console.log(error);
  } finally {
    isloading.value = false;
  }
};

const deleteGrade = async (id) => {
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
        await api.post(`/delete_grade/${id}`);
        get_grade();
      }
    });
  } catch (error) {
    console.log(error);
    Toast.fire({
      title: error.response.data.message,
      icon: "error",
    });
  }
};

const getId = async (id) => {
  router.push({
    name: "CreateGrade",
    params: { id },
  });
};

const headers = ref([
  {
    key: "name",
    title: "កម្រិតថ្នាក់",
  },
  {
    key: "edu_name",
    title: "កម្រិតអប់រំ",
  },
  {
    key: "curriculum_name",
    title: "កម្មវិធីសិក្សា",
  },
  {
    key: "action",
    title: "សកម្មភាព",
  },
]);

onMounted(() => {
  get_grade();
});
</script>
<template>
  <div>
    <v-row>
      <v-col cols="12" md="7" class="mt-4">
        <v-card elevation="0" class="pa-4 border border-1">
          <v-row class="align-center">
            <v-col cols="12" md="6">
              <v-card-title class="customKhmerMoul text-green-darken-4"
                >កម្រិតថ្នាក់សិក្សា
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
                to="/create-grade"
                elevation="3"
                class="bg-green customFont"
              >
                បង្កើត
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="grades"
            :search="search"
            :loading="isloading"
            :loading-text="isloading ? 'Loading...' : ''"
            :no-data-text="isloading ? '' : 'មិនមានទិន្នន័យទេ'"
            :items-per-page="8"
            class="customFont mt-5 my-custom-table"
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

            <template v-slot:item.action="row">
              <!-- <v-btn icon="mdi-eye" flat size="sm" class="text-blue"> </v-btn> -->
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
                @click="deleteGrade(row.item.id)"
              >
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
