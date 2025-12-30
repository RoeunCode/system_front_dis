<template>
  <div>
    <h2>Enter Student Scores</h2>

    <table border="1">
      <thead>
        <tr>
          <th>Student</th>
          <th v-for="subject in subjects" :key="subject.id">
            {{ subject.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.name }}</td>
          <td v-for="subject in subjects" :key="subject.id">
            <input
              type="number"
              v-model.number="scores[student.id][subject.id]"
              min="0"
              max="100"
              placeholder="Enter score"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="submitScores">Submit Scores</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const students = ref([
  { id: 1, name: "Messi" },
  { id: 2, name: "Ronaldo" },
  { id: 3, name: "Neymar" },
]);

const subjects = ref([
  { id: 101, name: "Math" },
  { id: 102, name: "Khmer" },
  { id: 103, name: "English" },
]);

// Initialize scores with ref instead of reactive
const scores = ref({});

// Properly initialize all score entries
students.value.forEach((student) => {
  scores.value[student.id] = {};
  subjects.value.forEach((subject) => {
    scores.value[student.id][subject.id] = "";
  });
});

const submitScores = () => {
  console.log("Submitting Scores:", scores.value);
  // Uncomment and adjust the axios call as needed
  /*
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/scores",
        scores.value
      );
      alert("Scores submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit scores.");
    }
    */
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
}
input {
  width: 60px;
  text-align: center;
}
button {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
