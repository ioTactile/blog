export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "nuxt-vuefire"],
  css: ["vuetify/styles", "~/assets/main.scss"],
  build: { transpile: ["vuetify"] },
  vite: { define: { "process.env.DEBUG": false } },
  runtimeConfig: {
    APP_CHECK_DEBUG_TOKEN_FROM_CI: process.env.APP_CHECK_DEBUG_TOKEN_FROM_CI,
  },
  vuefire: {
    auth: {
      enabled: true,
    },
    appCheck: {
      debug: process.env.NODE_ENV !== "production",
      isTokenAutoRefreshEnabled: true,
      provider: "ReCaptchaV3",
      key: "6LdaGkMpAAAAAAKMirSgcZJShFoUOt8X5pZMiAZr",
    },
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
