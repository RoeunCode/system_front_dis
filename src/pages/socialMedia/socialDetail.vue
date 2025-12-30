<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "@/utils/axios";
import Logo from "../../assets/img/DIS.png";
import { useRoute } from "vue-router";
import { useSettingStore } from "@/store/setting";
import { debounce } from "lodash";

const route = useRoute();

const settingStore = useSettingStore();

const campus_id = ref(settingStore.campus_id);

console.log("test", campus_id.value);

const data = ref([]);

const getSocial = async () => {
  try {
    await api.post(`/getSocial/${route.params.id}`).then((res) => {
      data.value = res.data.data;
    });
  } catch (error) {
    console.log(error);
  }
};

const images = (img) => {
  return "http://127.0.0.1:8000/storage/" + img;
};

onMounted(() => {
  getSocial();
});
</script>
<template>
  <div class="div">
    <VCard elevation="0" class="transparent-card py-5 px-2">
      <VCardTitle class="text-center">
        <img class="logo" :src="Logo" alt="" />
        <h3 class="customKhmerMoul text text-white mt-2">
          បណ្ដាញសង្គម ឌូវីអុីនធឺណេសិនណល
        </h3>
        <!-- {{ data }} -->
      </VCardTitle>
      <VCardText class="custom-card mx-auto" v-for="d in data" :key="d.id">
        <a :href="d.link" style="text-decoration: none">
          <VRow class="border-md mx-auto mt-3 radius-lg rounded-lg pa-0">
            <VCol class="d-flex align-center justify-center">
              <img
                class="card-img text-center"
                style="border-radius: 50%"
                :src="images(d.photo_path)"
                alt=""
              />
            </VCol>
            <VCol class="d-flex align-center justify-center">
              <p class="text-white text-h5">
                {{ d.name }}
              </p>
            </VCol>
          </VRow>
        </a>
      </VCardText>
    </VCard>
  </div>
</template>
<style scoped>
.div {
  height: 100vh;
  /* padding-top: 2%; */
  padding: 2% 10%;
  background-image: url("https://static.vecteezy.com/system/resources/previews/004/771/729/non_2x/abstract-gradient-background-with-green-color-spotlight-pattern-illustration-free-vector.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: local;
}
.transparent-card {
  background-color: rgba(
    8,
    8,
    8,
    0.118
  ) !important; /* Black with 50% opacity */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: none !important;
  border-radius: 12px;
}
.logo {
  width: 7%;
}
.custom-card {
  width: 40%;
}
.card-img {
  width: 20%;
  /* display: flex;
  justify-items: center; */
  margin-left: -40px;
}
@media (max-width: 480px) {
  .logo {
    width: 20%;
  }
  .text {
    font-size: 15px;
  }
  .div {
    padding: 2% 5%;
  }
  .custom-card {
    width: 100% !important;
  }
  .card-img {
    width: 34% !important;
  }
}
</style>
