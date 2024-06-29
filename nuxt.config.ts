// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/main.css"],
  plugins: [{ src: "~/plugins/databaseInit.js", mode: "client" }],
  runtimeConfig: {
    geocodeApiKey: process.env.GEOCODE_API_KEY,
    astrologyApi: process.env.ASTROLOGY_API_URL,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
