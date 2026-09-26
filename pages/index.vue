<template>
  <v-container class="container">
    <v-row>
      <v-col v-for="article in articles" :key="article.id" cols="12">
        <v-card :to="`/articles/${article.slug}`" rounded="O" color="main">
          <v-row>
            <v-col cols="12" md="6">
              <v-img :src="article.images?.[0]?.url" height="100%" :alt="article.title" contain />
            </v-col>
            <v-col cols="12" md="6" class="d-flex flex-column justify-space-between">
              <div>
                <v-card-title class="text-h6 text-sm-h5" :title="article.title">
                  {{ article.title }}
                </v-card-title>
                <v-card-subtitle>
                  {{ dateFormatter(article.creationDate) }}
                </v-card-subtitle>
                <v-card-text class="pt-2 text-body-2 text-sm-body-1">
                  {{ article.description?.substring(0, 500) }}
                </v-card-text>
              </div>

              <v-card-actions class="justify-center">
                <div>Lire la suite</div>
                <v-icon end :icon="mdiChevronRight" />
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script async setup lang="ts">
import {
  VContainer,
  VRow,
  VCol,
  VIcon,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VCardSubtitle,
  VImg,
} from 'vuetify/components';
import { mdiChevronRight } from '@mdi/js';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { articleConverter } from '~/stores';

const db = useFirestore();

const articlesRef = collection(db, 'articles').withConverter(articleConverter);
const articlesQuery = query(articlesRef, orderBy('creationDate', 'desc'));
const articlesDocs = await getDocs(articlesQuery);
const articles = articlesDocs.docs.map((doc) => doc.data());

const title = `ioTactile - Un blog sur le développement informatique - Dernier article: ${articles[0].title}`;
const content = ref(title);

const dateFormatter = new Intl.DateTimeFormat('fr', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format;

useSeoMeta({
  title: 'Accueil - ioTactile',
  ogTitle: 'Accueil - ioTactile',
  twitterTitle: 'Accueil - ioTactile',
  description: content,
  ogDescription: content,
  twitterDescription: content,
  ogImage: articles[0].images?.[0]?.url,
  twitterImage: articles[0].images?.[0]?.url,
  twitterCard: 'summary_large_image',
  ogUrl: 'https://iotactile.com',
});

useHead({
  htmlAttrs: {
    lang: 'fr',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: 'favicon.png',
    },
  ],
});
</script>

<style scoped lang="scss">
.container {
  max-width: 1080px;
}
</style>
