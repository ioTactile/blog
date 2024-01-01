export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "nuxt-vuefire"],
  css: ["vuetify/styles", "~/assets/main.scss"],
  build: { transpile: ["vuetify"] },
  vite: { define: { "process.env.DEBUG": false } },
  vuefire: {
    auth: true,
    config: {
      apiKey: "AIzaSyCyYv1vujR377lBM2d5z8c2RDXA_Fl8d_0",
      authDomain: "iotactile.firebaseapp.com",
      projectId: "iotactile",
      storageBucket: "iotactile.appspot.com",
      messagingSenderId: "855373712183",
      appId: "1:855373712183:web:55c78efe77bd08905e68b2",
      measurementId: "G-12178KVRFW",
    },
  },
  routeRules: {
    "/profil": { ssr: false },
    "/admin/*": { ssr: false },
  },
});
