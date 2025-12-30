<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/utils/axios";
import { computed } from "vue";
import { format, parse } from "date-fns";

// import { format, parse } from "date-fns";

const route = useRoute();

const student = ref({});

const studentHistory = ref({});

const images = (img) => {
  return "https://iconic.disreportcard.com/storage/" + img;
};

const getOneStudent = async () => {
  try {
    await api.post(`/get_one_student/${route.params.id}`).then((res) => {
      student.value = res.data;
      console.log(student.value);
    });
  } catch (error) {
    console.log(error);
  }
};

const studentData = async () => {
  try {
    await api
      .get(`https://iconic.disreportcard.com/api/getclass/${route.params.id}`)
      .then((res) => {
        studentHistory.value = res.data.class;
        console.log(studentHistory.value);
      });
  } catch (error) {
    console.log(error);
  }
};

const formattedDate = computed(() => {
  try {
    const parsedDate = parse(student.value.dob, "yyyy-MM-dd", new Date());
    return format(parsedDate, "dd-MM-yyyy");
  } catch (error) {
    return "Invalid Date"; // Handle parsing errors
  }
});

onMounted(() => {
  getOneStudent();
  studentData();
});
</script>
<template>
  <div>
    <VCard class="border" elevation="0">
      <VImg
        src="https://img.freepik.com/premium-vector/simple-elegant-plain-green-gradient-background_768131-640.jpg?semt=ais_hybrid&w=740"
        min-height="125"
        max-height="250"
        cover
      />

      <VCardText
        class="d-flex align-bottom flex-sm-row flex-column justify-center ga-x-6"
      >
        <div class="d-flex h-0">
          <VAvatar
            v-if="student.photo_path"
            rounded
            size="130"
            :image="images(student.photo_path)"
            class="user-profile-avatar mx-auto"
          />
          <VAvatar
            v-else
            rounded
            size="130"
            image="https://i.pinimg.com/736x/eb/09/31/eb0931b489d885d739fb750df5539120.jpg"
            class="user-profile-avatar mx-auto"
          />
        </div>

        <div class="user-profile-info w-100 mt-16 ml-2 pt-6 pt-sm-0 mt-sm-0">
          <h4
            class="text-h5 text-center font-weight-bold text-sm-start font-weight-medium mb-2"
          >
            {{ student.en_name }}
          </h4>

          <div
            class="d-flex align-center mb-5 justify-center justify-sm-space-between flex-wrap gap-5"
          >
            <p class="customAnkor ml-1">{{ student.kh_name }}</p>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VRow class="mt-6">
      <VCol cols="12" md="4">
        <VCard elevation="0" class="border">
          <VCardTitle
            class="text-center my-2 customAnkor text-green-darken-4"
            style="font-size: 20px"
          >
            ព័ត៌មានសិស្ស
          </VCardTitle>
          <VCardText class="customFont">
            <p class="font-weight-bold">
              ឈ្មោះសិស្ស ៖ <span>{{ student.kh_name }}</span>
            </p>
            <p class="font-weight-bold mt-1">
              អក្សរឡាតាំង ៖ <span>{{ student.en_name }}</span>
            </p>
            <p class="font-weight-bold mt-1">
              ភេទ ៖
              <span v-if="student.gender == 'F' || student.gender == 2"
                >ស្រី</span
              >
              <span v-else>ប្រុស</span>
            </p>

            <p class="font-weight-bold mt-1">
              សញ្ជាតិ ៖ <span>{{ student.national }}</span>
            </p>

            <p class="font-weight-bold mt-1">
              ថ្ងៃខែឆ្នាំកំណើត ៖
              <span>{{ formattedDate }} </span>
            </p>

            <p class="font-weight-bold mt-1">
              ទីកន្លែងកំណើត ៖

              <span
                v-if="
                  student.village_birth &&
                  student.commune_birth &&
                  student.district_birth &&
                  student.province_birth
                "
                >{{ student.village_birth }} {{ student.commune_birth }}
                {{ student.district_birth }} {{ student.province_birth }}</span
              >
              <span v-else>មិនមាន</span>
            </p>
            <p class="font-weight-bold mt-1">
              អស័យដ្ឋានបច្ចុប្បន្ន ៖

              <span
                v-if="
                  student.village_address &&
                  student.commune_address &&
                  student.district_address &&
                  student.province_address
                "
                >{{ student.village_address }} {{ student.commune_address }}
                {{ student.district_address }}
                {{ student.province_address }}</span
              >
              <span v-else>មិនមាន</span>
            </p>
            <p class="font-weight-bold mt-1">
              លេខទូរស័ព្ទ ៖
              <span v-if="student.phone">{{ student.phone }}</span>
              <span v-else>មិនមាន</span>
            </p>
            <p class="font-weight-bold mt-1">
              អុីម៉ែល ៖ <span v-if="student.email">{{ student.email }}</span
              ><span v-else>មិនមាន</span>
            </p>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="5">
        <VCard elevation="0" class="border" style="height: 38vh">
          <VCardTitle
            class="text-center my-2 customAnkor text-green-darken-4"
            style="font-size: 20px"
          >
            ព័ត៌មានអាណាព្យាបាល
          </VCardTitle>
          <VRow>
            <!-- 👉Mothername -->
            <VCol cols="12" md="6">
              <VCardText class="customFont">
                <p class="font-weight-bold">
                  ម្ដាយឈ្មោះ ៖
                  <span v-if="student.m_name">{{ student.m_name }}</span>
                  <span v-else>មិនមាន</span>
                </p>
                <p class="font-weight-bold mt-1">
                  ភេទ ៖
                  <span>ស្រី</span>
                </p>

                <p class="font-weight-bold mt-1">
                  សញ្ជាតិ ៖
                  <span v-if="student.m_national">{{
                    student.m_national
                  }}</span>
                  <span v-else>មិនមាន</span>
                </p>

                <p class="font-weight-bold mt-1">
                  ទីកន្លែងកំណើត ៖

                  <span v-if="student.m_address">{{ student.m_address }}</span>
                  <span v-else>មិនមាន</span>
                </p>
                <p class="font-weight-bold mt-1">
                  លេខទូរស័ព្ទ ៖
                  <span v-if="student.m_phone">{{ student.m_phone }}</span
                  ><span v-else>មិនមាន</span>
                </p>
                <p class="font-weight-bold mt-1">
                  អុីម៉ែល ៖ <span v-if="student.email">{{ student.email }}</span
                  ><span v-else>មិនមាន</span>
                </p>
                <p class="font-weight-bold mt-1">
                  មុខរបរ ៖
                  <span v-if="student.m_job">{{ student.m_job }}</span>
                  <span v-else>មិនមាន </span>
                </p>
              </VCardText>
            </VCol>
            <VDivider vertical />
            <VCol cols="12" md="6">
              <VCardText class="customFont">
                <p class="font-weight-bold">
                  ឪពុកឈ្មោះ ៖
                  <span v-if="student.f_name">{{ student.f_name }}</span>
                  <span v-else>មិនមាន</span>
                </p>
                <p class="font-weight-bold mt-1">
                  ភេទ ៖
                  <span>ប្រុស</span>
                </p>

                <p class="font-weight-bold mt-1">
                  សញ្ជាតិ ៖
                  <span v-if="student.f_national">{{
                    student.f_national
                  }}</span>
                  <span v-else>មិនមាន</span>
                </p>

                <p class="font-weight-bold mt-1">
                  ទីកន្លែងកំណើត ៖

                  <span v-if="student.f_address">{{ student.f_address }}</span>
                  <span v-else>មិនមាន</span>
                </p>
                <p class="font-weight-bold mt-1">
                  លេខទូរស័ព្ទ ៖
                  <span v-if="student.f_phone">{{ student.f_phone }}</span
                  ><span v-else>មិនមាន</span>
                </p>
                <p class="font-weight-bold mt-1">
                  អុីម៉ែល ៖ <span v-if="student.email">{{ student.email }}</span
                  ><span v-else>មិនមាន</span>
                </p>
                <p class="font-weight-bold mt-1">
                  មុខរបរ ៖
                  <span v-if="student.f_job">{{ student.f_job }}</span>
                  <span v-else>មិនមាន </span>
                </p>
              </VCardText>
            </VCol>
          </VRow>
        </VCard>
      </VCol>

      <VCol cols="12" md="3">
        <VCard elevation="0" border style="height: 38vh">
          <VCardTitle
            class="text-center my-2 customAnkor text-green-darken-4"
            style="font-size: 20px"
          >
            ការសិក្សា
          </VCardTitle>
          <VCardText class="customFont" v-for="s in studentHistory" :key="s.id">
            <p class="font-weight-bold">
              ថ្នាក់ទី ៖ <span>{{ s.grade }}</span>
            </p>
            <p class="font-weight-bold mt-1">
              កម្មវិធីសក្សា ៖ <span>{{ s.curriculum }}</span>
            </p>
            <p class="font-weight-bold mt-1">
              ឆ្នាំសិក្សា ៖ <span>{{ s.academic_year }}</span>
            </p>
            <p class="font-weight-bold mt-1">
              អត្តលេខ ៖ <span>{{ s.student_id }}</span>
            </p>
            <p class="font-weight-bold mt-1">
              ស្ថានភាព ៖ <span v-if="s.deleted == 0">កំពុងសិក្សា</span>
              <span v-else>ឈប់រៀន</span>
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.user-profile-avatar {
  border: 2px solid rgb(var(--v-theme-surface));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  /* .v-img__img {
    border-radius: 0.125rem;
  } */
}
</style>
