<template>
  <v-container class="container">
    <v-row>
      <v-col cols="12">
        <h3 class="text-h4 text-sm-h3 text-md-h2 mb-8">Bonjour et bienvenue</h3>
        <p class="text-md-h6 mb-8">
          Je m'appelle <strong>Jordan</strong>, j'ai 24 ans et je suis en
          formation à CESI Reims pour devenir développeur informatique. Ce blog
          a pour but de partager mes connaissances et mes expériences dans le
          domaine du développement web, mais aussi de vous presenter des projets
          que j'ai réalisé.
        </p>
        <p class="text-md-h6 mb-8">
          Je me passione chaque jour un peu plus pour le développement web, et
          je suis toujours à la recherche de nouvelles technologies à apprendre
          tout en approfondissant mes connaissances dans les technologies que je
          connais déjà.
        </p>
        <p class="text-md-h6 mb-8">
          J'utilise essentiellement <strong>Vue.js</strong> et
          <strong>Nuxt.js</strong> pour le développement de mes applications
          web.
        </p>
        <p class="text-md-h6 mb-8">
          En espérant vous apprendre de nouvelles choses, je vous souhaite une
          bonne lecture !
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { VContainer, VRow, VCol } from "vuetify/components";

useSeoMeta({
  title: "À Propos - ioTactile",
  ogTitle: "À Propos - ioTactile",
  twitterTitle: "À Propos - ioTactile",
  description: "Page où je présente le site et moi-même",
  ogDescription: "Page où je présente le site et moi-même",
  twitterDescription: "Page où je présente le site et moi-même",
  ogImage: "/iotactile.png",
  twitterImage: "/blog.png",
  twitterCard: "summary_large_image",
  ogUrl: "https://iotactile.fr/about",
});

useHead({
  htmlAttrs: {
    lang: "fr",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "favicon.png",
    },
  ],
});
</script>

<style scoped lang="scss">
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
