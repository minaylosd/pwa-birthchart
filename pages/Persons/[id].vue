<script setup>
import { ref, onMounted } from "vue";
import { getPerson } from "../../utils/database";
import { drawNatalChart } from "#imports";

const person = ref(null);
const { id } = useRoute().params;
const idNum = parseInt(id);
const editMode = ref(false);

async function loadPerson(idNum) {
  const p = await getPerson(idNum);
  console.log(p.person);
  person.value = p.person;
  drawNatalChart(p);
  showChart();
}

function showChart() {
  //   showForm.value = false;
  const chart = document.getElementById("natalChart");
  const header = document.querySelector("h3");
  const headerBottom = header.getBoundingClientRect().bottom;
  chart.setAttribute("width", `${window.innerWidth}`);
  chart.setAttribute("height", `${window.innerHeight - headerBottom}`);
  //   chart.style = "display:block;";
}

function openEditForm() {
  editMode.value = true;
}

// TODO: before edit person i need to fetch new horoscope,
//       create new person with all the horoscopes etc,
//       and after that assigning new object to person;
async function handleEditPerson(idNum, formData) {
  const p = await editPerson(idNum, formData);
  person.value = p;
  editMode.value = false;
}

async function handleDeletePerson(idNum) {
  deletePerson(idNum);
}

onMounted(() => {
  loadPerson(idNum);
});
</script>

<template>
  <div v-if="person" class="heading">
    <div>
      <h1 class="name">
        {{ editMode == "false" ? person.name : "Edit person" }}
      </h1>
      <p class="city">{{ person.city }}</p>
      <p class="city">date of birth: {{ person.date }} {{ person.time }}</p>
      <p class="city">timezone: {{ person.timezone }}</p>
      <p class="rand">
        lat: {{ person.latitude }}, lon: {{ person.longitude }}
      </p>
    </div>
    <div class="btns">
      <button @click="openEditForm">edit</button>
      <button @click="handleDeletePerson">delete</button>
    </div>
  </div>
  <svg v-show="!editMode" id="natalChart" width="0" height="0"></svg>
  <AppForm
    v-if="person"
    v-show="editMode"
    type="edit"
    :person="person"
    @form-submitted="handleEditPerson"
  />
</template>

<style scoped>
.heading {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
}

.name {
  font-size: var(--size-md);
  padding: 0;
  margin: 8px 0;
  text-align: left;
}

.city {
  font-size: var(--size-xxs);
  padding: 0;
  font-weight: 200;
  text-align: left;
}

.link {
  font-size: var(--size-md);
  font-weight: 200;
}
.rand {
  font-size: var(--size-xxs);
  font-weight: 200;
}

.btns {
  display: flex;
  gap: 16px;
}

button {
  color: #fff;
  background-color: transparent;
  border-bottom: #fff 1px solid;
  border-radius: 0;
  padding: 8px 16px;
}
</style>
