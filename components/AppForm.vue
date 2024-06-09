<script setup>
import Loader from "./Loader.vue";
import Circles from "./Circles.vue";
import { ref } from "vue";

const props = defineProps({
  type: String,
});

const emit = defineEmits(["formSubmitted"]);

const showCitiesList = ref(false);
const cities = ref([]);

const loadingCities = ref(false);
const loaded = ref(false);

const nameRef = ref("");
const dateRef = ref("2000-01-01");
const timeRef = ref("00:00");
const cityRef = ref("");
const latitudeRef = ref("");
const longitudeRef = ref("");
const timezoneRef = ref("");

// for debouncing fetch
let timeout;

const person = props.addPerson;

// Function to convert timezone offset format
function convertTimeZoneFormat(timezoneOffset) {
  return timezoneOffset.replace(/([+-]\d{2})(\d{2})/, "$1:$2");
}

function clearCity() {
  cityRef.value = "";
  latitudeRef.value = "";
  longitudeRef.value = "";
  timezoneRef.value = "";
  showCitiesList.value = false;
  cities.value = [];
}

function setCity(index) {
  cityRef.value =
    cities.value[index].components._normalized_city +
    ", " +
    cities.value[index].components.country;
  latitudeRef.value = cities.value[index].geometry.lat;
  longitudeRef.value = cities.value[index].geometry.lng;
  timezoneRef.value = convertTimeZoneFormat(
    cities.value[index].annotations.timezone.offset_string
  );
  showCitiesList.value = false;
}

function debouncedGetCities(cityRef, delay) {
  clearTimeout(timeout);
  loadingCities.value = true;
  timeout = setTimeout(() => {
    getCities(cityRef);
  }, delay);
}

const error = ref(null);

async function getCities() {
  if (cityRef.value.length >= 3) {
    loadingCities.value = true;
    console.log(cityRef.value);
    try {
      const response = await fetch(
        `/api/fetchCity?city=${encodeURIComponent(cityRef.value)}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data. Status code: ${response.status}`
        );
      }
      const data = await response.json();
      cities.value = data.data;
      showCitiesList.value = true;
      loadingCities.value = false;
      error.value = null; // Reset the error if the fetch is successful
    } catch (err) {
      error.value = err.message;
      cities.value = []; // Reset the cities if there's an error
    }
  }
}

function filterCities(list) {
  const filteredCities = list.filter(
    (city) =>
      city.components._type === "city" ||
      city.components._type === "town" ||
      city.components._type === "township" ||
      city.components._type === "village" ||
      city.components._type === "hamlet"
  );
  return filteredCities;
}

async function fetchCities(cityName) {
  const apiKey = import.meta.env.VITE_GEOCODE_API_KEY;
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    cityName
  )}&key=${apiKey}&language=en`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status code: ${response.status}`);
    }
    const data = await response.json();
    const result = data.results;

    return result;
  } catch (error) {
    console.error(error);
  }
}

// Function to submit form and trigger horoscope fetching
async function submitForm(e) {
  e.preventDefault();
  const formFilled =
    dateRef.value != "" &&
    timeRef.value != "" &&
    latitudeRef.value != "" &&
    longitudeRef.value != "" &&
    timezoneRef.value != "";
  console.log(formFilled);
  if (!formFilled) {
    alert(
      "Please fill in all fields. Pick a city from the list below after typing in. 🌟"
    );
    return;
  }

  const formData = {
    name: nameRef.value,
    date: dateRef.value,
    time: timeRef.value,
    city: cityRef.value,
    latitude: latitudeRef.value,
    longitude: longitudeRef.value,
    timezone: timezoneRef.value,
  };

  emit("formSubmitted", formData);
}
</script>

<template>
  <form @submit.prevent="submitForm" class="content">
    <div class="field-wrapper">
      <div v-if="props.type === 'add'" class="field name">
        <label for="person-name">Name</label>
        <input
          id="person-name"
          name="person-name"
          type="text"
          placeholder="Person Name"
          autocomplete="off"
          required
          v-model="nameRef"
        />
        <div class="divider-overflow">
          <div class="divider-wrapper">
            <div class="divider"></div>
            <div class="divider"></div>
          </div>
        </div>
      </div>
      <div class="field date">
        <label for="birth-date">Date of birth</label>
        <input
          id="birth-date"
          name="birth-date"
          type="date"
          required
          v-model="dateRef"
        />
        <div class="divider-overflow">
          <div class="divider-wrapper">
            <div class="divider"></div>
            <div class="divider"></div>
          </div>
        </div>
      </div>
      <div class="field time">
        <label for="birth-time">Time of birth</label>
        <input
          id="birth-time"
          name="birth-time"
          type="time"
          required
          v-model="timeRef"
        />
        <div class="divider-overflow">
          <div class="divider-wrapper">
            <div class="divider"></div>
            <div class="divider"></div>
          </div>
        </div>
      </div>
      <div class="field birthplace">
        <label for="birth-place">Place of birth</label>
        <div class="city-wrapper">
          <input
            id="birth-place"
            name="birth-place"
            placeholder="Moscow"
            type="text"
            required
            autocomplete="off"
            v-model="cityRef"
            @input="debouncedGetCities(cityRef, 400)"
          />
          <div v-if="loadingCities && !loaded" class="cities-loader">
            <Loader />
          </div>
          <div v-else class="cross-btn" @click="clearCity"></div>
          <!-- <div class="cities-loader"><Loader /></div> -->
        </div>

        <div class="divider-overflow">
          <div class="divider-wrapper">
            <div class="divider"></div>
            <div class="divider"></div>
          </div>
        </div>

        <div v-if="showCitiesList" class="cities-autocomplete">
          <div
            class="city"
            v-for="(city, index) in cities"
            :key="index"
            @click="setCity(index)"
          >
            <div>
              <h4>
                {{
                  city.components.city ||
                  city.components.town ||
                  city.components.village ||
                  city.components.township ||
                  city.components.hamlet
                }},
                {{ city.components["ISO_3166-1_alpha-3"] }}
              </h4>
              <p>{{ city.formatted }}</p>
            </div>
            <div>
              <p class="timezone">
                {{ city.annotations.timezone.offset_string.substr(0, 3) }}:{{
                  city.annotations.timezone.offset_string.substr(3)
                }}
              </p>
              <p class="geometry">
                lat: {{ city.geometry.lat.toFixed(2) }}, lng:
                {{ city.geometry.lng.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p v-if="props.type === 'build'" class="instructions">
        Follow these few easy steps to let magic happen and build a chart
      </p>
      <!-- <ul class="instructions">
        <li>Enter your date of birth</li>
        <li>Enter your time of birth</li>
        <li>Enter your place of birth</li>
        <li>lets go!</li>
      </ul> -->
      <Circles />
    </div>

    <div class="input-btn">
      <input type="submit" value="Let's go" />
    </div>
  </form>
</template>

<style scoped>
.instructions {
  font-size: var(--size-sm);
  font-family: var(--font-main);
  font-weight: 200;
  text-align: left;
  margin: 0 auto 0 auto;
}

h1 {
  padding: 0 1rem;
}
.content {
  display: flex;
  /* flex-direction: column; */
  flex-wrap: wrap;
  /* align-items: flex-start; */
  align-content: space-between;
  justify-content: space-between;
  height: 100%;
  gap: 0.75rem;
  padding: 0 1rem;
}

.field-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-md);
  justify-content: space-between;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  min-height: 84px;
  /* border-bottom: 1px solid #fff; */
  width: 100%;
  padding: 8px 0 8px 0;
  /* overflow: hidden; */
  transition: background-color 0.3s ease-out;
}

.date {
  width: 55%;
}

.time {
  width: 35%;
}

/* .birthplace .divider-overflow {
} */

.divider-overflow {
  width: 100%;
  height: 1px;
  overflow: hidden;
  position: relative;
}

.divider-wrapper {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  width: calc(200% + 48px);
  height: 1px;
  gap: 48px;
  transition: transform 0.4s cubic-bezier(0.4, 0.22, 0.03, 0.44);
}

.divider {
  background-color: #fff;
  height: 1px;
  width: 100%;
}

@keyframes anim {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - 24px));
  }
  /* 65% {
    transform: translateX(calc(-50% - 24px));
  }
  100% {
    transform: translateX(0);
  } */
}

/* .field:nth-child(4) {
  margin-bottom: var(--size-2xl);
} */

.field:focus-within .divider-wrapper {
  /* background-color: var(--background-light); */
  transform: translateX(calc(50% + 24px));
  /* animation: anim 0.4s ease-out; */
}

.city-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.city-wrapper input {
  padding: 0;
}

.city-wrapper input:not(:placeholder-shown) + .cross-btn {
  display: block;
}

.cross-btn {
  display: none;
  width: 32px;
  height: 32px;
  background-image: url("/icons/cross2.svg");
  background-size: cover;
  cursor: pointer;
}

.cities-loader {
  width: 32px;
  height: 32px;
}

.cities-autocomplete {
  position: absolute;
  top: 84px;
  left: -16px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 16px 16px 16px 16px;
  width: 100vw;
  max-height: 348px;
  overflow-y: auto;
  /* background-color: var(--background-light); */
  background-color: rgba(15, 20, 26, 0.3);
  backdrop-filter: blur(8px);
}

.field label {
  font-size: var(--size-xs);
  font-family: var(--font-display);
  /* font-weight: 300; */
  text-align: left;
  padding: 0 4px;
}

input {
  background-color: transparent;
  color: #fff;
  font-family: var(--font-main-var);
  font-weight: 200;
  border: none;
  font-size: var(--size-md);
  padding: 0 4px;
}

input:focus {
  outline: none;
}

input::placeholder {
  color: inherit;
  opacity: 0.5;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  /* opacity: 0; */
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23fff" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
}

input[type="time"]::-webkit-calendar-picker-indicator {
  /* opacity: 0; */
  background-image: url("/icons/time.svg");
}

.input-btn {
  /* margin-top: var(--size-md); */
  display: flex;
  /* flex-basis: 60%; */
  width: fit-content;
  margin: 32px auto 32px auto;
  /* flex-basis: 25%; */
  align-items: center;
  justify-content: center;
  /* padding: 13px 68px; */
  /* border: 1px solid #fff; */
  /* border-radius: 40px; */
  position: relative;
}

.input-btn input {
  font-family: var(--font-display);
  font-size: var(--size-lg);
  padding: 16px 32px;
  width: 100%;
}

.input-btn input:active {
  transform: scale(0.7);
}

.city {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0 8px 8px 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
}

.city h4 {
  padding: 0;
  font-size: 1.125rem;
  text-align: left;
}

.city p {
  font-size: var(--size-xxs);
  font-weight: 200;
  text-align: left;
}

.city .timezone {
  font-size: var(--size-sm);
  text-align: right;
}

.city .geometry {
  text-align: right;
  font-size: var(--size-xxs);
  white-space: nowrap;
}
</style>
