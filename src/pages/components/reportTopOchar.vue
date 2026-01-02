<script setup>
import { computed, onMounted, ref } from "vue";
import { defineProps } from "vue";
import background from "@/assets/img/background.jpg";
import backgroundOchar from "@/assets/img/ochar.jpg";
import border1 from "@/assets/img/border1.jpg";
import sinature from "@/assets/img/sinature.png";
import sinatureOchar from "@/assets/img/sinatureOchar.jpg";
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
    "https://muddy-poetry-ab86.siengroeun2018.workers.dev/https://iconic.disreportcard.com/storage/" +
    img
  );
};

console.log("month", props.transformedClass);

const data = ref([]);
data.value = props.topFive;

const lengthData = ref(null);
lengthData.value = data.value.length;

const rank1 = computed(() => data.value.filter((item) => item.rank === 1));
const rank2to5 = computed(() => data.value.filter((item) => item.rank !== 1));
</script>
<template>
  <div style="width: 50%">
    <div style="width: 100%; position: relative" id="printImg">
      <img :src="backgroundOchar" height="100%" width="100%" alt="" />
    </div>

    <div
      style="
        position: absolute;
        top: 30%;
        /* left: 9%; */
        /* transform: translate(0%, -50%); */
        width: 50%;
        margin-left: -3px;
      "
    >
      <p
        class="moulight font-weight-bold text-center text-green-darken-3"
        style="font-size: 14px; margin-top: -60px"
      >
        ចំណាត់ថ្នាក់ទី
        <span class="font-weight-bold"
          >{{ props.transformedClass }} ប្រចាំ<span
            class="font-weight-bold"
            v-if="props.typeMessage != 'ឆ្នាំ'"
            >{{ props.typeMessage }}</span
          ><span class="font-weight-bold" v-if="monthMessage">{{
            props.monthMessage
          }}</span>
        </span>
        <span class="font-weight-bold">
          ឆ្នាំសិក្សា<span class="font-weight-bold">{{
            props.yearMessage
          }}</span></span
        >
      </p>
    </div>

    <div
      style="position: absolute; bottom: 15%; left: 16%"
      :style="lengthData == 2 ? { bottom: '25%' } : {}"
      class="sinature"
    >
      <img :src="sinatureOchar" height="10%" width="25%" alt="" />
    </div>

    <div
      style="
        position: absolute;
        bottom: 26.3%;
        left: 6%;
        width: 40%;
        font-size: 10px;
      "
      :style="lengthData == 2 ? { bottom: '36.3%' } : {}"
      class="date text-center siemreap"
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
      <div
        v-if="lengthData == 6"
        class="header1"
        style="width: 50%; padding: 50px; margin-left: 5px"
      >
        <VRow class="moul">
          <VCol
            style="margin-top: 20px"
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
                    style="width: 90px; height: 110px; border: 4px solid green"
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
                    font-size: 7px;
                    background-color: green;
                    width: 90px;
                    border-radius: 4px;
                    padding: 5px 1px;
                    color: white;
                  "
                  class="moulight moulName text-center"
                >
                  {{ d.kh_name }}
                </p>

                <p
                  class="moulNumber moulight"
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

      <div
        v-else-if="lengthData == 2"
        class="header1"
        style="width: 50%; padding: 50px; margin-left: 93px"
      >
        <VRow class="moul">
          <VCol
            style="margin-top: -205px"
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
                    style="width: 110px; height: 140px; border: 4px solid green"
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
                    font-size: 7px;
                    background-color: green;
                    width: 110px;
                    border-radius: 4px;
                    padding: 5px 1px;
                    color: white;
                  "
                  class="moulight moulName text-center"
                >
                  {{ d.kh_name }}
                </p>

                <p
                  class="moulNumber moulight"
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

      <div style="width: 50%" v-else>
        <template v-if="data.filter((item) => item.rank === 1).length === 2">
          <!-- Two Rank 1 Items Side by Side -->
          <VRow justify="center">
            <template
              v-for="(d, index) in data.filter((item) => item.rank === 1)"
              :key="'rank1-' + index"
            >
              <VCol
                style="margin-top: 150px"
                cols="6"
                md="6"
                sm="6"
                class="d-flex justify-center pa-2"
              >
                <div class="d-flex flex-column justify-center align-center">
                  <v-avatar
                    rounded="0"
                    class="avatar"
                    style="width: 90px; height: 110px; border: 4px solid green"
                  >
                    <v-img
                      :src="images(d.photo_path)"
                      style="height: 100%"
                      cover
                    />
                  </v-avatar>
                  <p
                    class="moulight text-center"
                    style="
                      font-size: 7px;
                      background-color: green;
                      margin-top: 6px;
                      width: 95px;
                      border-radius: 4px;
                      color: white;
                      padding: 5px 1px;
                    "
                  >
                    {{ d.kh_name }}
                  </p>
                  <p
                    class="moulight"
                    style="color: red; margin-top: 3px; font-size: 12px"
                  >
                    {{ toKhmerNumber(d.rank) }}
                  </p>
                </div>
              </VCol>
            </template>
          </VRow>

          <!-- Rank 3 Centered -->
          <VRow justify="center" style="margin-top: -60px">
            <template
              v-for="(d, index) in data.filter((item) => item.rank === 3)"
              :key="'rank3-' + index"
            >
              <VCol cols="12" md="6" sm="6" class="d-flex justify-center pa-2">
                <div class="d-flex flex-column justify-center align-center">
                  <v-avatar
                    rounded="0"
                    class="avatar"
                    style="width: 90px; height: 110px; border: 4px solid green"
                  >
                    <v-img
                      :src="images(d.photo_path)"
                      style="height: 100%"
                      cover
                    />
                  </v-avatar>
                  <p
                    class="moulight text-center"
                    style="
                      font-size: 7px;
                      background-color: green;
                      margin-top: 6px;
                      width: 95px;
                      border-radius: 4px;
                      color: white;
                      padding: 5px 1px;
                    "
                  >
                    {{ d.kh_name }}
                  </p>
                  <p
                    class="moulight"
                    style="color: red; margin-top: 3px; font-size: 12px"
                  >
                    {{ toKhmerNumber(d.rank) }}
                  </p>
                </div>
              </VCol>
            </template>
          </VRow>

          <!-- Ranks 4–5 Side by Side -->
          <VRow justify="center" style="margin-top: -60px">
            <template
              v-for="(d, index) in data.filter(
                (item) => item.rank === 4 || item.rank === 5
              )"
              :key="'rank4-5-' + index"
            >
              <VCol cols="6" md="6" sm="6" class="d-flex justify-center pa-2">
                <div class="d-flex flex-column justify-center align-center">
                  <v-avatar
                    rounded="0"
                    class="avatar"
                    style="width: 90px; height: 110px"
                    :style="{
                      border: `4px solid ${d.rank === 4 ? 'green' : 'green'}`,
                    }"
                  >
                    <v-img
                      :src="images(d.photo_path)"
                      style="height: 100%"
                      cover
                    />
                  </v-avatar>
                  <p
                    class="moulight text-center"
                    style="
                      font-size: 7px;
                      margin-top: 6px;
                      width: 95px;
                      border-radius: 4px;
                      color: white;
                      padding: 5px 1px;
                    "
                    :style="{
                      backgroundColor: d.rank === 4 ? 'green' : 'green',
                    }"
                  >
                    {{ d.kh_name }}
                  </p>
                  <p
                    class="moulight"
                    style="color: red; margin-top: 3px; font-size: 12px"
                  >
                    {{ toKhmerNumber(d.rank) }}
                  </p>
                </div>
              </VCol>
            </template>
          </VRow>
        </template>

        <div v-else>
          <!-- Original Code for Single Rank 1 -->
          <VRow>
            <template v-for="(d, index) in data" :key="index">
              <template v-if="d.rank === 1">
                <VCol
                  cols="12"
                  md="12"
                  sm="12"
                  class="d-flex justify-center pa-0"
                >
                  <div
                    style="margin-top: 40px"
                    class="d-flex flex-column justify-center align-center"
                  >
                    <v-avatar
                      rounded="0"
                      class="avatar"
                      style="
                        width: 90px;
                        height: 110px;
                        border: 4px solid green;
                      "
                    >
                      <v-img
                        :src="images(d.photo_path)"
                        style="height: 100%"
                        cover
                      />
                    </v-avatar>
                    <p
                      class="moulight moulName text-center"
                      style="
                        font-size: 7px;
                        background-color: green;
                        margin-top: 6px;
                        width: 95px;
                        border-radius: 4px;
                        color: white;
                        padding: 5px 1px;
                      "
                    >
                      {{ d.kh_name }}
                    </p>
                    <p
                      class="moulNumber moulight"
                      style="color: red; margin-top: 3px"
                    >
                      {{ toKhmerNumber(d.rank) }}
                    </p>
                  </div>
                </VCol>
              </template>
            </template>
          </VRow>

          <!-- Original Code for Ranks 2–5 -->
          <VRow style="margin-top: -80px">
            <template
              v-for="(d, index) in data
                .filter((x) => x.rank !== 1)
                .sort((a, b) => a.rank - b.rank)"
              :key="'rank2-5-' + index"
            >
              <template v-if="d.rank !== 1">
                <VCol cols="6" md="6" class="pa-0">
                  <div style="margin-top: 30px">
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
                          class="avatar"
                          style="
                            width: 90px;
                            height: 110px;
                            border: 4px solid green;
                          "
                        >
                          <v-img
                            :src="images(d.photo_path)"
                            style="height: 100%"
                            cover
                          />
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
                          font-size: 7px;
                          background-color: green;
                          width: 97px;
                          border-radius: 2px;
                          padding: 5px 1px;
                          color: white;
                        "
                        class="moulight text-center"
                      >
                        {{ d.kh_name }}
                      </p>
                      <p
                        class="moulight"
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
  </div>
</template>
<style setup>
.font_header {
  font-size: 20px;
  margin-top: -80px;
}
.img_photo {
  width: 220px;
  height: 300px;
  border: 4px solid green;
}
.img_photo_2 {
  width: 220px;
  height: 300px;
  border: 4px solid green;
}

@media only screen and (max-width: 600px) {
  .img_photo {
    width: 220px;
    height: 300px;
    border: 4px solid green;
  }
  .img_photo_2 {
    width: 220px;
    height: 300px;
    border: 4px solid green;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .img_photo {
    width: 220px;
    height: 300px;
    border: 4px solid green;
  }
  .img_photo_2 {
    width: 220px;
    height: 300px;
    border: 4px solid green;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .img_photo {
    width: 220px;
    height: 300px;
    border: 4px solid green;
  }
  .img_photo_2 {
    width: 220px;
    height: 300px;
    border: 4px solid green;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .font_header {
    font-size: 20px;
    margin-top: -80px;
  }
  .img_photo {
    margin-top: 20px;
    width: 170px;
    height: 200px;
    border: 4px solid green;
  }
  .img_photo_2 {
    margin-left: 180px;
    width: 170px;
    height: 200px;
    border: 4px solid green;
  }
}

@media only screen and (min-width: 1200px) {
  .font_header {
    font-size: 30px;
    margin-top: -120px;
  }
  .img_photo {
    margin-top: -40px;
    width: 200px;
    height: 260px;
    border: 4px solid green;
  }
  .img_photo_2 {
    margin-left: 270px;
    width: 200px;
    height: 260px;
    border: 4px solid green;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1600px) {
  .font_header {
    font-size: 30px;
    margin-top: -120px;
  }
  .img_photo {
    margin-top: -40px;
    width: 220px;
    height: 300px;
    border: 4px solid green;
  }
  .img_photo_2 {
    margin-left: 270px;
    width: 220px;
    height: 300px;
    border: 4px solid green;
  }
}
</style>
