<script setup>
import { onMounted, ref } from "vue";
import { defineProps } from "vue";
import background from "@/assets/img/background.jpg";
import border1 from "@/assets/img/border1.jpg";
import sinature from "@/assets/img/sinature.png";
import { watch } from "vue";

const props = defineProps({
  yearMessage: {
    type: String,
    required: true,
  },
  topFive: {
    type: Array,
    required: true,
  },
  // Border: {
  //   type: String,
  //   required: true,
  // },
  monthMessage: {
    type: String,
    required: true,
  },
  typeMessage: {
    type: String,
    required: true,
  },
  transformedClass: {
    type: String,
    required: true,
  },
  khmerDate: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const date = ref("");
const khmerDate = ref("");

onMounted(() => {
  date.value = props.date;
  khmerDate.value = props.khmerDate;
});

watch(
  () => props.khmerDate,
  (newVal) => {
    khmerDate.value = newVal;
  }
);

watch(
  () => props.date,
  (newVal) => {
    date.value = newVal;
  }
);

function toKhmerNumber(number) {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return number
    .toString()
    .split("")
    .map((d) => khmerDigits[+d])
    .join("");
}

const images = (img) => {
  return (
    "https://muddy-poetry-ab86.siengroeun2018.workers.dev/https://iconic.disreportcard.com/" +
    img
  );
};

console.log("month", props.transformedClass);

const data = ref([]);
data.value = props.topFive;

const lengthData = ref(null);
lengthData.value = data.value.length;
</script>
<template>
  <div style="width: 100%">
    <div style="width: 100%; position: relative" id="printImg">
      <img :src="background" height="100%" width="100%" alt="" />
    </div>

    <div
      style="
        position: absolute;
        top: 30%;
        /* transform: translate(0%, -50%); */
        width: 100%;
      "
    >
      <p
        class="customKhmerMoul grade text-center"
        style="font-size: 30px; margin-top: -80px"
      >
        ចំណាត់ថ្នាក់ទី
        <span
          >{{ props.transformedClass }} ប្រចាំ<span
            v-if="props.typeMessage != 'ឆ្នាំ'"
            >{{ props.typeMessage }}</span
          ><span v-if="monthMessage">{{ props.monthMessage }}</span>
        </span>
        <span>
          ឆ្នាំសិក្សា<span>{{ props.yearMessage }}</span></span
        >
      </p>
    </div>

    <div style="position: absolute; bottom: 16%; left: 35%" class="sinature">
      <img :src="sinature" height="10%" width="70%" alt="" />
    </div>

    <div
      style="position: absolute; bottom: 22%; left: 38%; font-size: 13px"
      class="date text-center customFont"
    >
      <p>{{ khmerDate }}</p>
      <p>{{ date }}</p>
    </div>

    <div
      style="
        width: 100%;
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -80%);
      "
      class="header1"
    >
      <div v-if="lengthData == 6" class="header1">
        <VRow class="moul">
          <VCol
            style="margin-top: 30px"
            cols="4"
            md="4"
            v-for="(d, index) in data"
            :key="index"
          >
            <div>
              <div>
                <p
                  style="font-size: 40px"
                  class="text-center angkor"
                  :class="{
                    'text-green-darken-4': d.rank === 2,
                    'text-orange': d.rank === 3,
                    'text-blue-darken-3': d.rank === 4,
                    'text-purple': d.rank === 5,
                  }"
                >
                  <v-avatar
                    rounded="0"
                    class="avartar"
                    style="width: 120px; height: 150px; border: 4px solid green"
                  >
                    <v-img
                      :src="images(d.photo_path)"
                      style="height: 100%"
                      cover
                    ></v-img>
                  </v-avatar>
                </p>
              </div>
              <div style="width: 100%; position: relative; margin-top: 20px">
                <!-- <v-img :src="border" height="160"></v-img> -->
                <p
                  style="
                    position: absolute;
                    top: 60%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin: 0;
                    font-size: 13px;
                    background-color: green;
                    width: 120px;
                    border-radius: 4px;
                    padding: 2px 0;
                    color: white;
                  "
                  class="customKhmerMoul moulName text-center"
                >
                  {{ d.kh_name }}
                </p>

                <p
                  class="moulNumber customKhmerMoul"
                  style="
                    color: red;
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%, 60%);
                    margin: 0;
                  "
                >
                  {{ toKhmerNumber(d.rank) }}
                </p>
              </div>
            </div>
          </VCol>
        </VRow>
      </div>

      <div v-else>
        <VRow class="main">
          <template v-for="(d, index) in data" :key="index">
            <template v-if="d.rank === 1">
              <VCol cols="12" md="12" sm="12" class="d-flex justify-center">
                <div
                  style="
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin: 0;
                  "
                  class="d-flex flex-column justify-center align-center"
                >
                  <v-avatar
                    rounded="0"
                    class="avartar"
                    style="width: 120px; height: 150px; border: 4px solid green"
                  >
                    <v-img
                      :src="images(d.photo_path)"
                      style="height: 100%"
                      cover
                    ></v-img>
                  </v-avatar>
                  <p
                    class="customKhmerMoul moulName text-center"
                    style="
                      font-size: 13px;
                      background-color: green;
                      margin-top: 8px;
                      width: 120px;
                      border-radius: 4px;
                      color: white;
                      padding: 2px 0;
                    "
                  >
                    {{ d.kh_name }}
                  </p>
                  <p
                    class="moulNumber customKhmerMoul"
                    style="color: red; margin-top: 3px"
                  >
                    {{ toKhmerNumber(d.rank) }}
                  </p>
                </div>
              </VCol>
            </template>

            <!-- Layout for rank 2–5 -->
            <template v-else>
              <VCol cols="6" md="6">
                <div style="margin-top: 20px">
                  <div>
                    <p
                      style="font-size: 40px"
                      class="text-center angkor"
                      :class="{
                        'text-green-darken-4': d.rank === 2,
                        'text-orange': d.rank === 3,
                        'text-blue-darken-3': d.rank === 4,
                        'text-purple': d.rank === 5,
                      }"
                    >
                      <v-avatar
                        rounded="0"
                        class="avartar"
                        style="
                          width: 120px;
                          height: 150px;
                          border: 4px solid green;
                        "
                      >
                        <v-img
                          :src="images(d.photo_path)"
                          crossOrigin="anonymous"
                          style="height: 100%"
                          cover
                        ></v-img>
                      </v-avatar>
                    </p>
                  </div>
                  <div
                    style="width: 100%; position: relative; margin-top: 20px"
                  >
                    <p
                      style="
                        position: absolute;
                        top: 60%;
                        left: 50%;
                        transform: translate(-50%, -70%);
                        margin: 0;
                        font-size: 13px;
                        background-color: green;
                        width: 120px;
                        border-radius: 4px;
                        padding: 2px 0;
                        color: white;
                      "
                      class="customKhmerMoul moulName text-center"
                    >
                      {{ d.kh_name }}
                    </p>

                    <p
                      class="moulNumber customKhmerMoul"
                      style="
                        color: red;
                        position: absolute;
                        left: 50%;
                        transform: translate(-50%, 50%);
                        margin: 0;
                      "
                    >
                      {{ toKhmerNumber(d.rank) }}
                    </p>
                  </div>
                </div>
              </VCol>
            </template>
          </template>
        </VRow>
      </div>
    </div>
  </div>
</template>
<style setup>
/* .img {
  background-image: var(--bg-image);
  background-size: 100% 100%; 
  background-position: center;
  background-repeat: no-repeat;
  width: 100%; 
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
} */
</style>
<!-- height: 100vh;
  padding-top: 8%;
  background-image: linear-gradient(
      0deg,
      rgba(100, 97, 97, 0.75),
      rgba(100, 97, 97, 0.75)
    ),
    url("https://e1.pxfuel.com/desktop-wallpaper/975/55/desktop-wallpaper-login-page-login.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: local; -->
