<template>
  <h1>My persons</h1>
  <div class="content" v-if="persons.length === 0">
    <p>The list are currently empty</p>
    <NuxtLink to="/add-person"
      ><img src="/icons/pwa/pwa-192x192.png" alt=""
    /></NuxtLink>
    <p>Add new person</p>
  </div>
  <div class="list" v-else>
    <NuxtLink
      :to="`/persons/${person.id}`"
      class="list-item"
      v-for="person in persons"
      :key="person.id"
    >
      <div>
        <h3 class="name">{{ person.person.name }}</h3>
        <p class="city">{{ person.person.city }}</p>
      </div>
      <div>
        <p class="link">{{ person.person.timezone }}</p>
        <p class="rand">
          lat: {{ person.person.latitude }}, lon: {{ person.person.longitude }}
        </p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllPersons } from "../utils/database";

const persons = ref([]);
async function loadPersons() {
  persons.value = await getAllPersons();
}

onMounted(() => {
  loadPersons();
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(-20%);
  height: 100%;
  gap: 20px;
}

img {
  width: 64px;
  height: 64px;
}

.list {
  padding: 0 1rem;
}

.list-item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
}

.name {
  font-size: var(--size-md);
  padding: 0;
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
  text-align: right;
}
.rand {
  font-size: var(--size-xxs);
  font-weight: 200;
  text-align: right;
}
</style>
