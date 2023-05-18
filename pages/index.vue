<template>
  <v-container>
    <Head>
      <Title>ioTactile</Title>
      <Meta name="description" content="Page d'accueil où l'on retrouve tous les liens vers les articles du blog" />
    </Head>
    <v-row>
      <v-col v-for="article in articles" :key="article.id" cols="12">
        <v-card :to="`/articles/${article.slug}`" rounded="O" color="main">
          <v-row>
            <v-col cols="12" md="6">
              <storage-img
                :storage-src="article.images?.[0]?.url"
                height="400"
                :alt="article.title"
                cover
              />
            </v-col>
            <v-col cols="12" md="6" class="d-flex flex-column justify-space-between">
              <div>
                <v-card-title class="text-h6 text-sm-h5">
                  {{ article.title }}
                </v-card-title>
                <v-card-subtitle>
                  {{
                    dateFormatter(article.creationDate)
                  }}
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

<script lang="ts" async setup>
import { VContainer, VRow, VCol, VIcon, VCard, VCardTitle, VCardText, VCardActions, VCardSubtitle } from 'vuetify/components'
import { mdiChevronRight } from '@mdi/js'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { articleConverter } from '~/stores'

const db = useFirestore()

const articlesRef = collection(db, 'articles').withConverter(articleConverter)
const articlesQuery = query(articlesRef, orderBy('updateDate', 'desc'))
const articlesDocs = await getDocs(articlesQuery)
const articles = articlesDocs.docs.map(doc => doc.data())

const dateFormatter = new Intl.DateTimeFormat('fr', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}).format
</script>
