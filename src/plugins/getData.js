// // getData.js
// import { api } from "@/utils/axios";
// import { ref, watch } from "vue";
// import { useSettingStore } from "@/store/setting";
// import { debounce } from "lodash";

// const classrooms = ref([]);

// // ✅ Get classroom by campus and education_id
// export const getClassroom = async (edu) => {
//   const settingStore = useSettingStore(); // MUST be inside the function

//   try {
//     const response = await api.post("/get_all_classroom", {
//       campus_id: settingStore.campus_id,
//     });

//     classrooms.value = response.data.filter(
//       (c) => c.deleted !== 1 && c.education_id == edu
//     );

//     return classrooms.value;
//   } catch (error) {
//     console.error("Error fetching classrooms:", error);
//   }
// };

// // ✅ Debounced version (if you want to auto-refresh when campus_id changes)
// export const useAutoRefreshClassrooms = (eduRef) => {
//   const settingStore = useSettingStore();

//   const debouncedGetClassroom = debounce((edu) => {
//     getClassroom(edu); // This updates `classrooms.value`
//   }, 300);

//   watch(
//     [() => settingStore.campus_id, eduRef],
//     ([_, edu]) => {
//       if (edu) debouncedGetClassroom(edu);
//     },
//     { immediate: true }
//   );

//   return classrooms; // optional
// };
// export { classrooms };
