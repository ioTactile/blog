<template>
  <v-container>
    <Head>
      <Title>{{ article.title }}</Title>
      <Meta name="description" :content="article.description" />
    </Head>
    <div class="container">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <h2 class="pt-12 pb-4 font-weight-bold text-h4 text-sm-h3 text-center text-sm-left">
            {{ article.title }}
          </h2>
        </v-col>
        <v-col cols="12" class="d-flex justify-center pa-0 image-border">
          <v-img :src="article.images?.[0]?.url" />
        </v-col>
        <v-col cols="12" class="content-container">
          <div class="text-subtitle-2 text-sm-subtitle-1 ">
            Publié {{ dateFormatter(article.creationDate) }}
          </div>
          <div class="font-weight-bold text-h6 text-sm-h5 py-4">
            {{ article.description }}
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="pt-10" v-html="article.content" />
        </v-col>
      </v-row>
      <div class="d-flex">
        <NuxtLink
          v-if="previousArticle"
          :to="`/articles/${previousArticle.slug}`"
          class="d-flex align-center pt-10 text-stroke text-decoration-none"
        >
          <v-icon size="x-large" :icon="mdiArrowLeft" />
          <span class="pl-2 text-h5">Précédent</span>
        </NuxtLink>
        <v-spacer />
        <NuxtLink
          v-if="nextArticle"
          :to="`/articles/${nextArticle.slug}`"
          class="d-flex align-center pt-10 text-stroke text-decoration-none"
        >
          <span class="pr-2 text-h5">Suivant</span>
          <v-icon size="x-large" :icon="mdiArrowRight" />
        </NuxtLink>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" async setup>
import { VContainer, VRow, VCol, VImg, VIcon, VSpacer } from 'vuetify/components'
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'
import { collection, getDocs, query, orderBy } from '@firebase/firestore'
import { articleConverter, LocalArticleType } from '~/stores'

const db = useFirestore()
const route = useRoute()

const articlesRef = collection(db, 'articles').withConverter(articleConverter)
const articleQuery = query(articlesRef, orderBy('updateDate', 'desc'))
const articlesFetched = await getDocs(articleQuery)
const articlesDocs = articlesFetched.docs.map(doc => doc.data())
const article = articlesDocs.find(article => article.slug === route.params.id) as LocalArticleType
const articleIndex = articlesDocs.findIndex(article => article.slug === route.params.id)
const previousArticle = articleIndex > 0 ? articlesDocs[articleIndex - 1] : null
const nextArticle = articleIndex < articlesDocs.length - 1 ? articlesDocs[articleIndex + 1] : null

const dateFormatter = new Intl.DateTimeFormat('fr', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}).format
</script>

<style scoped>
.container {
    max-width: 1440px;
    margin: 0 auto;
}

.content-container {
    max-width: 800px;
    margin: 0 auto;
}

.image-border {
  border: 1px solid rgb(var(--v-theme-headline));
}
</style>
