<script setup>
import { onMounted, ref } from "vue";
import { getHoroscope } from "../utils/horoscopeData";
import AppForm from "../components/AppForm.vue";
import { drawNatalChart } from "../utils/draw";

const showForm = ref(true);

const showCitiesList = ref(false);
const cities = ref([]);

const loadingCities = ref(false);
const loaded = ref(false);

const dateRef = ref("2000-01-01");
const timeRef = ref("00:00");
const cityRef = ref("");
const latitudeRef = ref("");
const longitudeRef = ref("");
const timezoneRef = ref("");

const fetchedParams = ref([]);

function animateBtn() {
  const btn = document.querySelector(".input-btn");
  const input = btn.querySelector("input");
  const orbit = btn.querySelector(".orbit");
  orbit.classList.add("rotation");
  setTimeout(() => {
    orbit.classList.remove("rotation");
  }, 700);
}

function showChart() {
  showForm.value = false;
  const chart = document.getElementById("natalChart");
  const header = document.querySelector("h1");
  const headerBottom = header.getBoundingClientRect().bottom;
  chart.setAttribute("width", `${window.innerWidth}`);
  chart.setAttribute("height", `${window.innerHeight - headerBottom}`);
  chart.style = "display:block;";
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function convertTimeZoneFormat(timezoneOffset) {
  return timezoneOffset.replace(/([+-]\d{2})(\d{2})/, "$1:$2");
}

function prepareDownloadSvg() {
  //get svg element.
  var svg = document.getElementById("natalChart");

  //get svg source.
  var serializer = new XMLSerializer();
  var source = serializer.serializeToString(svg);

  //add name spaces.
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
    );
  }

  //add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  //convert svg source to URI data scheme.
  var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

  //set url value to a element's href attribute.
  document.getElementById("link").href = url;
  //you can download svg file by right click menu.
}

const error = ref(null);

async function handleBuildChart(formData) {
  const { date, time, latitude, longitude, timezone } = formData;
  const formattedTimezone = convertTimeZoneFormat(timezone);
  let params =
    "" + date + "?" + time + "?" + latitude + "?" + longitude + "?" + timezone;

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
    drawNatalChart(drawingData);

    showForm.value = false;
    showChart();
    // prepareDownloadSvg();
    error.value = null; // Reset the error if the fetch is successful
  } catch (err) {
    error.value = err.message;
  }
}

// async function handleBuildChart(formData) {
//   const { date, time, latitude, longitude, timezone } = formData;
//   const drawingData = await getHoroscope(
//     date,
//     time,
//     latitude,
//     longitude,
//     timezone
//   );
//   drawNatalChart(drawingData);
//   showForm.value = false;
//   showChart();
// }
</script>

<template>
  <h1>Build chart</h1>
  <AppForm v-if="showForm" type="build" @form-submitted="handleBuildChart" />
  <div>
    <div v-for="(param, index) in fetchedParams" :key="index">{{ param }}</div>
  </div>
  <svg id="natalChart" width="0" height="0"></svg>
</template>

<style scoped>
#natalChart {
  display: none;
}

.instructions {
  font-size: var(--size-sm);
  font-family: var(--font-main-var);
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
