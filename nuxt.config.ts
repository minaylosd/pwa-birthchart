// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/global.css"],
  plugins: [{ src: "~/plugins/databaseInit.js", mode: "client" }],
  runtimeConfig: {
    geocodeApiKey: process.env.GEOCODE_API_KEY,
    astrologyApi: process.env.ASTROLOGY_API_URL,
  },
});
