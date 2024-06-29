<script setup>
const error = ref(null);
async function handleAddPerson(formData) {
  const { name, date, time, city, latitude, longitude, timezone } = formData;

  try {
    const response = await fetch(
      `/api/fetchHoroscope?query=${date}?${time}?${latitude}?${longitude}?${encodeURIComponent(
        timezone
      )}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status code: ${response.status}`);
    }

    const data = await response.json();
    const drawingData = data.data;

    drawingData.person = {
      name,
      date,
      time,
      city,
      latitude,
      longitude,
      timezone,
    };

    addPerson(drawingData);
    await navigateTo("/persons");

    error.value = null; // Reset the error if the fetch is successful
  } catch (err) {
    error.value = err.message;
  }

  // const drawingData = await getHoroscope(
  //   date,
  //   time,
  //   latitude,
  //   longitude,
  //   timezone
  // );
}
</script>

<template>
  <h1>Add person</h1>
  <AppForm type="add" @form-submitted="handleAddPerson" />
</template>

<style scoped>
h1 {
  padding: 0 1rem;
  font-family: var(--font-metana);
}
</style>
