<script setup>
import { ref } from "vue";
import Border from "@/assets/img/border.jpg";

const props = defineProps({
  yearMessage: {
    type: String,
    required: true,
  },
  topFive: {
    type: Array,
    required: true,
  },
  Border: {
    type: String,
    required: true,
  },
});

console.log("props data", props.topFive);

const border = props.Border;

const data = ref([]);
data.value = props.topFive;

const lengthData = ref(null);
lengthData.value = data.value.length;
</script>

<template>
  <div>
    <div v-if="lengthData == 6">
      <VRow class="moul">
        <VCol
          cols="6"
          md="4"
          style="margin-top: -30px"
          v-for="(d, index) in data"
          :key="index"
        >
          <div>
            <p
              style="font-size: 40px"
              class="text-center angkor"
              :class="{
                'text-red': d.rank === 1,
                'text-green-darken-4': d.rank === 2,
                'text-orange': d.rank === 3,
                'text-blue-darken-3': d.rank === 4,
                'text-purple': d.rank === 5,
              }"
            >
              {{ d.rank }}
            </p>
          </div>
          <div style="width: 100%; position: relative">
            <v-img :src="border" height="160"></v-img>
            <p
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                margin: 0;
                font-size: 20px;
              "
              class="customAnkor angkor"
              :class="{
                'text-red': d.rank === 1,
                'text-green-darken-4': d.rank === 2,
                'text-orange': d.rank === 3,
                'text-blue-darken-3': d.rank === 4,
                'text-purple': d.rank === 5,
              }"
            >
              {{ d.kh_name }}
            </p>
          </div>
        </VCol>
      </VRow>
    </div>

    <div v-else>
      <VRow class="moul">
        <template v-for="(d, index) in data" :key="index">
          <template v-if="d.rank === 1">
            <div class="w-100" style="margin-top: -28px">
              <p style="font-size: 40px" class="text-center angkor text-red">
                {{ d.rank }}
              </p>
            </div>

            <VCol cols="12" md="12" sm="12" class="d-flex justify-center">
              <div style="width: 100%; position: relative">
                <v-img :src="border" height="160"></v-img>
                <p
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin: 0;
                    font-size: 20px;
                  "
                  class="customAnkor angkor text-red"
                >
                  {{ d.kh_name }}
                </p>
              </div>
            </VCol>
          </template>

          <!-- Layout for rank 2–5 -->
          <template v-else>
            <VCol cols="6" md="6" style="margin-top: -25px">
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
                  {{ d.rank }}
                </p>
              </div>
              <div style="width: 100%; position: relative">
                <v-img :src="border" height="160"></v-img>
                <p
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin: 0;
                    font-size: 20px;
                  "
                  class="customAnkor angkor"
                  :class="{
                    'text-green-darken-4': d.rank === 2,
                    'text-orange': d.rank === 3,
                    'text-blue-darken-3': d.rank === 4,
                    'text-purple': d.rank === 5,
                  }"
                >
                  {{ d.kh_name }}
                </p>
              </div>
            </VCol>
          </template>
        </template>
      </VRow>
    </div>
  </div>
</template>
