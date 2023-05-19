<template>
  <div>
    <Head>
      <Title>À Propos - ioTactile</Title>
      <Meta name="description" content="Page où je présente le site et moi-même" />
    </Head>
    <v-container class="container">
      <v-row>
        <v-col cols="12">
          <h3 class="text-h4 text-sm-h3 text-md-h2 mb-8">
            Bonjour et bienvenue
          </h3>
          <p class="text-md-h6 mb-8">
            Je m'appelle <strong>Jordan</strong>, j'ai 24 ans et je suis en formation à CESI Reims pour devenir développeur informatique.
            Ce blog a pour but de partager mes connaissances et mes expériences dans le domaine du développement web, mais aussi de vous presenter
            des projets que j'ai réalisé.
          </p>
          <p class="text-md-h6 mb-8">
            Je me passione chaque jour un peu plus pour le développement web, et je suis toujours à la recherche de nouvelles technologies à apprendre tout
            en approfondissant mes connaissances dans les technologies que je connais déjà.
          </p>
          <p class="text-md-h6 mb-8">
            J'utilise essentiellement le framework <strong>Vue.js</strong> pour le développement de mes applications web, mais je suis aussi à l'aise avec
            <strong>React.js</strong>. Je me forme en ce moment sur le framework <strong>Nest.js</strong>
          </p>
          <p class="text-md-h6 mb-8">
            En espérant vous apprendre de nouvelles choses, je vous souhaite une bonne lecture !
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { VContainer, VRow, VCol } from 'vuetify/components'
</script>

  <style scoped>
  .container {
      max-width: 800px;
      margin: 0 auto;
  }
  </style>
