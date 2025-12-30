<script setup>
import { computed, ref } from "vue";
const props = defineProps({
  students_scores: {
    type: Array,
    required: true,
  },
  level: {
    type: Number,
  },
  subject: {
    type: Array,
  },
});

const loading = ref(false);

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const user_role_id = ref(parseInt(user.value.role_id));

const subjectNames = computed(
  () => props.subject?.map((s) => s.subject_name) || []
);

const hasSubject = (subjectName) =>
  subjectNames.value.some((name) => name.includes(subjectName));

const filteredSubjects = computed(() => {
  const allSubjects = [
    // { name: "ឈ្មោះសិស្ស", key: "name" },
    { name: "តែងសេចក្ដី", key: "writing" },
    { name: "ស.ស.អាន", key: "essay" },
    { name: "ភាសាខ្មែរ", key: "khmer" },
    { name: "សីលធម៌", key: "morality" },
    { name: "ប្រវត្តិវិទ្យា", key: "history" },
    { name: "ភូមិវិទ្យា", key: "geography" },
    { name: "គណិតវិទ្យា", key: "math" },
    { name: "រូបវិទ្យា", key: "physical" },
    { name: "គីមីវិទ្យា", key: "chemistry" },
    { name: "ជីវវិទ្យា", key: "biology" },
    { name: "ផែនដី", key: "geology" },
    { name: "គេហវិទ្យា", key: "house_education" },
    { name: "កីឡា", key: "pe" },
    { name: "អង់គ្លេស", key: "english" },
    { name: "កុំព្យូទ័រ", key: "computer" },
  ];

  //  Always include the student name column
  const filtered = [];
  if (user_role_id.value == 4) {
    loading.value = true;
    const teachesKhmer = hasSubject("ភាសាខ្មែរ");

    console.log("Teacher teaches Khmer:", teachesKhmer);

    // Filter other subjects based on props.subject
    for (let i = 0; i < allSubjects.length; i++) {
      const subject = allSubjects[i];
      if (
        hasSubject(subject.name) ||
        (teachesKhmer &&
          (subject.name.includes("តែងសេចក្ដី") ||
            subject.name.includes("ស.ស.អាន")))
      ) {
        filtered.push(subject);
        console.log("hel", filtered);
      }
    }
    loading.value = false;
  } else {
    for (let i = 0; i < allSubjects.length; i++) {
      const subject = allSubjects[i];
      filtered.push(subject);
    }
  }

  console.log("filter", filtered);
  return filtered;
});

const scoreFields = [
  "writing",
  "essay",
  "khmer",
  "morality",
  "history",
  "geography",
  "math",
  "physical",
  "chemistry",
  "biology",
  "geology",
  "house_education",
  "pe",
  "english",
  "computer",
];

// function for copy and paste data to table field
const handlePaste = (event, rowIndex, startField) => {
  event.preventDefault();

  const clipboardData = event.clipboardData || window.clipboardData;
  const pasteValue = clipboardData.getData("text");
  const values = pasteValue.trim().split(/\t|\n/);

  const student = props.students_scores[rowIndex];
  const level = Number(props.level);

  console.log("Pasted values:", values);
  console.log("Target student:", student);

  // Find the index of the field where paste started
  let startIndex = scoreFields.indexOf(startField);

  if (startIndex === -1) {
    console.warn(`Invalid start field: ${startField}`);
    return;
  }

  // Begin pasting from the correct field
  for (let i = startIndex; i < scoreFields.length; i++) {
    const field = scoreFields[i];

    // Skip fields based on level conditions
    if (field === "pe" && level === 9) {
      continue;
    }

    if (values.length > 0) {
      const value = values.shift();
      student[field] = value.trim();
      console.log(`Assigned ${value} to ${field}`);
    } else {
      break;
    }
  }
};

console.log("propLevel", typeof props.level);
</script>

<template>
  <v-table fixed-header height="460" class="border customFont">
    <thead class="my-custom-table">
      <tr>
        <!-- <th class="text-left py-2" style="height: 0px">ឈ្មោះសិស្ស</th> -->

        <th
          class="sticky-header text-left py-2 px-8 border"
          style="left: 0; z-index: 50; background: white; height: 0px"
        >
          ឈ្មោះសិស្ស
        </th>
        <th
          style="height: 0px"
          v-for="s in filteredSubjects"
          :key="s.key"
          class="text-left py-2 px-8 border"
        >
          {{ s.name }}
        </th>

        <th
          v-if="user_role_id != 4 || user_role_id != '4'"
          class="text-left py-2 px-8 border"
        >
          សកម្មភាព
        </th>
      </tr>
    </thead>

    <tbody class="my-custom-table">
      <tr v-for="(item, rowIndex) in students_scores" :key="item.id">
        <td class="border sticky-col">
          {{ item.kh_name }}
        </td>
        <td
          v-for="subject in filteredSubjects"
          :key="subject.key"
          class="border"
        >
          <VTextField
            :readonly="props.level == 9 && subject.key == 'pe'"
            :class="
              props.level == 9 && subject.key == 'pe' ? 'bg-grey-lighten-3' : ''
            "
            @paste.native="(e) => handlePaste(e, rowIndex, subject.key)"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item[subject.key]"
          />
        </td>
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'essay')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.essay"
          />
        </td> -->
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'khmer')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.khmer"
          />
        </td> -->
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'morality')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.morality"
          />
        </td> -->
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'history')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.history"
          />
        </td> -->
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'geography')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.geography"
          />
        </td> -->
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'math')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.math"
          />
        </td> -->
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'physical')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.physical"
          />
        </td> -->
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'chemistry')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.chemistry"
          />
        </td> -->
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'biology')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.biology"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'geology')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.geology"
          />
        </td> -->
        <!-- <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'house_education')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.house_education"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'pe')"
            :readonly="props.level == 9"
            :class="props.level == 9 ? 'bg-grey-lighten-3' : ''"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.pe"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'english')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.english"
          />
        </td>

        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'computer')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.computer"
          />
        </td> -->
        <td
          v-if="user_role_id != 4 || user_role_id != '4'"
          class="border text-center"
        >
          <VBtn
            variant="outlined"
            color="red"
            @click="$emit('deleteRecord', item.id)"
            >លុប</VBtn
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.sticky-col {
  position: sticky;
  left: 0;
  background: white;
  z-index: 1;
}

.sticky-header {
  position: sticky;
  left: 0;
  z-index: 10;
  background: white;
}

.table-header {
  height: 40px !important;
  white-space: nowrap;
}
</style>
