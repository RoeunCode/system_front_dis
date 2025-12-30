<script setup>
import { ref } from "vue";
const props = defineProps({
  students_scores: {
    type: Array,
    required: true,
  },
  level: {
    type: String,
  },
  subject: {
    type: Object,
  },
});

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const user_role_id = ref(parseInt(user.value.role_id));

console.log("subjjjjjjj", props.subject);

console.log("prop", props.level);

const scoreFields = [
  "listent",
  "speaking",
  "reading",
  "writing",
  "essay",
  "grammar",
  "math",
  "chemistry",
  "physical",
  "history",
  "morality",
  "art",
  "word",
  "pe",
  "homework",
  "healthy",
  "steam",
];

const handlePaste = (event, rowIndex, startField) => {
  event.preventDefault();

  const clipboardData = event.clipboardData || window.clipboardData;
  const pasteValue = clipboardData.getData("text");
  const values = pasteValue.trim().split(/\t|\n/);

  const student = props.students_scores[rowIndex];
  const level = Number(props.level); // Ensure level is a number

  console.log("Pasted values:", values);
  console.log("Target student:", student);

  let startIndex = scoreFields.indexOf(startField);

  if (startIndex === -1) {
    console.warn(`Invalid start field: ${startField}`);
    return;
  }

  // Initialize if not already set
  if (student._lastPastedIndex === undefined) {
    student._lastPastedIndex = 0;
  }

  let fieldIndex = student._lastPastedIndex;

  console.log("startIndex", startIndex);

  for (let i = startIndex; i < scoreFields.length; i++) {
    const field = scoreFields[i];

    // Skip fields based on level conditions
    // if (
    //   (["essay", "grammar"].includes(field) && (level === 1 || level === 2)) ||
    //   (["homework", "healthy"].includes(field) && [1, 2, 3, 4].includes(level))
    // ) {
    //   continue;
    // }

    // Only update from the current fieldIndex
    if (fieldIndex > 0) {
      fieldIndex--;
      continue;
    }

    // Assign value if it exists
    if (values.length > 0) {
      const value = values.shift(); // take the next value
      student[field] = value.trim();
      console.log(`Assigned ${value} to ${field}`);
      student._lastPastedIndex = i + 1; // update last pasted index
    }
  }
};

// const subject = ref([
//   { name: "ឈ្មោះសិស្ស" },
//   { name: "ស្ដាប់" },
//   { name: "និយាយ" },
//   { name: "អំណាន" },
//   { name: "សរសេរ" },
//   { name: "តែងសេចក្ដី" },
//   { name: "វេយ្យាករណ៍" },
//   { name: "គណិតវិទ្យា" },
//   { name: "វិទ្យាសាស្រ្ត" },
//   { name: "ភូមិវិទ្យា" },
//   { name: "ប្រវិត្តិវិទ្យា" },
//   { name: "សីលធម៍" },
//   { name: "គំនូរ" },
//   { name: "អក្សរផ្ចង់" },
//   { name: "អប់រំកាយ" },
//   { name: "កិច្ចការផ្ទះ" },
//   { name: "អនាម័យ" },
//   { name: "STEAM" },
// ]);
</script>

<template>
  <v-table fixed-header height="460" class="border customFont">
    <thead class="my-custom-table">
      <tr>
        <!-- <th
          style="height: 10px; background-color: red"
          class="position-fixed text-left py-2 px-8 border"
        >
          ឈ្មោះសិស្ស
        </th> -->

        <th
          class="sticky-header text-left py-2 px-8 border"
          style="left: 0; z-index: 50; background: white; height: 0px"
        >
          ឈ្មោះសិស្ស
        </th>
        <th
          v-if="subject.values"
          style="height: 0px"
          class="text-left py-2 px-8 border"
        >
          ស្ដាប់
        </th>
        <th style="height: 0px" class="text-left py-2 px-8 border">និយាយ</th>
        <th style="height: 0px" class="text-left py-2 px-8 border">អំណាន</th>
        <th style="height: 0px" class="text-left py-2 px-8 border">សរសេរ</th>
        <!-- <th style="height: 0px" class="text-left py-2 px-8 border">
          តែងសេចក្ដី
        </th> -->
        <th
          style="height: 0px"
          class="text-left py-2 px-8 border"
          v-if="props.level != 1 && props.level != 2"
        >
          តែងសេចក្ដី
        </th>

        <!-- <th style="height: 0px" class="text-left py-2 px-8 border">
          វេយ្យាករណ៍
        </th> -->
        <th
          style="height: 0px"
          class="text-left py-2 px-8 border"
          v-if="props.level != 1 && props.level != 2"
        >
          វេយ្យាករណ៍
        </th>

        <th style="height: 0px" class="text-left py-2 px-8 border">
          គណិតវិទ្យា
        </th>
        <th style="height: 0px" class="text-left py-2 px-8 border">
          វិទ្យាសាស្រ្ត
        </th>
        <th style="height: 0px" class="text-left py-2 px-8 border">
          ភូមិវិទ្យា
        </th>
        <th style="height: 0px" class="text-left py-2 px-8 border">
          ប្រវិត្តិវិទ្យា
        </th>
        <th style="height: 0px" class="text-left py-2 px-8 border">សីលធម៍</th>
        <th style="height: 0px" class="text-left py-2 px-8 border">គំនូរ</th>
        <th style="height: 0px" class="text-left py-2 px-8 border">
          អក្សរផ្ចង់
        </th>
        <th style="height: 0px" class="text-left py-2 px-8 border">អប់រំកាយ</th>

        <!-- <th style="height: 0px" class="text-left py-2 px-8 border">
          កិច្ចការផ្ទះ
        </th> -->

        <th
          style="height: 0px"
          class="text-left py-2 px-8 border"
          v-if="props.level == 5 || props.level == 6"
        >
          កិច្ចការផ្ទះ
        </th>

        <th
          style="height: 0px"
          class="text-left py-2 px-8 border"
          v-if="props.level == 5 || props.level == 6"
        >
          អនាម័យ
        </th>
        <th style="height: 0px" class="text-left py-2 px-8 border">STEAM</th>
        <th
          style="height: 0px"
          class="text-left py-2 px-8 border"
          v-if="user_role_id != 4 || user_role_id != '4'"
        >
          សកម្មភាព
        </th>
      </tr>
    </thead>

    <tbody class="my-custom-table">
      <tr v-for="(item, rowIndex) in students_scores" :key="item.id">
        <!-- <td class="border">
          {{ item.kh_name }}
        </td> -->

        <td class="border sticky-col">
          {{ item.kh_name }}
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'listent')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.listent"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'speaking')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.speaking"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'reading')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.reading"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'writing')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.writing"
          />
        </td>
        <td class="border" v-if="props.level != 1 && props.level != 2">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'essay')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.essay"
          />
        </td>
        <!-- <td class="border">
          <VTextField
            :readonly="props.level == 1 || props.level == 2"
            :disabled="props.level == 1 || props.level == 2"
            :class="
              props.level == 1 || props.level == 2 ? 'bg-grey-lighten-3' : ''
            "
            :value="props.level == 1 || props.level == 2 ? '0.0.1' : item.essay"
            @paste.native="(e) => handlePaste(e, rowIndex, 'essay')"
            hide-details
            density="compact"
            variant="outlined"
            @input="
              item.essay =
                props.level == 1 || props.level == 2
                  ? '0.0.1'
                  : $event.target.value
            "
          />
        </td> -->

        <td class="border" v-if="props.level != 1 && props.level != 2">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'grammar')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.grammar"
          />
        </td>

        <!-- <td class="border">
          <VTextField
            :readonly="props.level == 1 || props.level == 2"
            :disabled="props.level == 1 || props.level == 2"
            :class="
              props.level == 1 || props.level == 2 ? 'bg-grey-lighten-3' : ''
            "
            hide-details
            density="compact"
            variant="outlined"
            :value="
              props.level == 1 || props.level == 2 ? '0.0.1' : item.grammar
            "
            v-model="item.grammar"
          />
        </td> -->
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'math')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.math"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'chemistry')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.chemistry"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'physical')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.physical"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'history')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.history"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'morality')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.morality"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'art')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.art"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'word')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.word"
          />
        </td>
        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'pe')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.pe"
          />
        </td>
        <!-- <td class="border">
          <VTextField
            :readonly="
              props.level == 1 ||
              props.level == 2 ||
              props.level == 3 ||
              props.level == 4
            "
            :disabled="
              props.level == 1 ||
              props.level == 2 ||
              props.level == 3 ||
              props.level == 4
            "
            :class="
              props.level == 1 ||
              props.level == 2 ||
              props.level == 3 ||
              props.level == 4
                ? 'bg-grey-lighten-3'
                : ''
            "
            @paste.native="(e) => handlePaste(e, rowIndex, 'homework')"
            hide-details
            density="compact"
            variant="outlined"
            :value="
              props.level == 1 ||
              props.level == 2 ||
              props.level == 3 ||
              props.level == 4
                ? '0.0.1'
                : item.homework
            "
            @input="
              item.homework =
                props.level == 1 ||
                props.level == 2 ||
                props.level == 3 ||
                props.level == 4
                  ? '0.0.1'
                  : $event.target.value
            "
          />
        </td> -->
        <td class="border" v-if="props.level == 5 || props.level == 6">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'homework')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.homework"
          />
        </td>

        <!-- <td class="border">
          <VTextField
            :readonly="
              props.level == 1 ||
              props.level == 2 ||
              props.level == 3 ||
              props.level == 4
            "
            :disabled="
              props.level == 1 ||
              props.level == 2 ||
              props.level == 3 ||
              props.level == 4
            "
            :class="
              props.level == 1 ||
              props.level == 2 ||
              props.level == 3 ||
              props.level == 4
                ? 'bg-grey-lighten-3'
                : ''
            "
            @paste.native="(e) => handlePaste(e, rowIndex, 'healthy')"
            hide-details
            density="compact"
            variant="outlined"
            :value="
              props.level == 1 ||
              props.level == 2 ||
              props.level == 3 ||
              props.level == 4
                ? '0.0.1'
                : item.healthy
            "
            @input="
              item.healthy =
                props.level == 1 ||
                props.level == 2 ||
                props.level == 3 ||
                props.level == 4
                  ? '0.0.1'
                  : $event.target.value
            "
          />
        </td> -->
        <td class="border" v-if="props.level == 5 || props.level == 6">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'healthy')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.healthy"
          />
        </td>

        <td class="border">
          <VTextField
            @paste.native="(e) => handlePaste(e, rowIndex, 'steam')"
            hide-details
            density="compact"
            variant="outlined"
            v-model="item.steam"
          />
        </td>
        <td
          class="border text-center"
          v-if="user_role_id != 4 || user_role_id != '4'"
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
