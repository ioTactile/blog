<template>
  <v-container>
    <div class="pb-4">
      <v-btn color="buttonBack" @click="createArticle">
        Ajouter un article
      </v-btn>
    </div>

    <v-table>
      <thead>
        <tr>
          <th>Image principale</th>
          <th>Titre</th>
          <th>Description</th>
          <th>Date de création</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td>
            <storage-img
              :storage-src="article.images?.[0]?.url"
              width="100"
              height="100"
              contain
            />
          </td>
          <td>{{ article.title }}</td>
          <td>{{ article.description }}</td>
          <td>{{ dateFormatter(article.creationDate) }}</td>
          <td>
            <v-btn
              :icon="mdiPencil"
              color="stroke"
              variant="text"
              @click="edit(article)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>

    <client-only>
      <v-dialog v-model="dialog" :persistent="loading || fileLoading">
        <v-card>
          <v-form ref="form" @submit.prevent="saveArticle">
            <v-card-title class="d-flex align-center">
              <div>Création d'une actualité</div>
              <v-spacer />
              <v-btn
                :icon="mdiClose"
                :disabled="loading || fileLoading"
                variant="text"
                @click="reset"
              />
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="title"
                    label="Titre"
                    :rules="[(v: string) => !!v || 'Le titre est requis']"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="description"
                    label="Description"
                    rows="2"
                  />
                </v-col>
                <v-col cols="12">
                  <images-manager
                    ref="imageManager"
                    v-model="images"
                    :slug="id || ''"
                    collection="articles"
                    :max-height="1000"
                    @file-loading="fileLoading = $event"
                  />
                </v-col>
                <v-col cols="12">
                  <tiptap-editor v-model="content" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="removing" :disabled="loading || fileLoading" color="error" @click="removeArticle">
                Supprimer
              </v-btn>
              <v-spacer />
              <v-btn variant="text" :disabled="loading || fileLoading || removing" @click="reset">
                Annuler
              </v-btn>
              <v-btn
                color="buttonBack"
                type="submit"
                variant="elevated"
                :loading="loading"
                :disabled="fileLoading || removing"
              >
                Enregistrer
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </client-only>
  </v-container>
</template>

<script lang="ts" async setup>
import { mdiPencil, mdiClose } from '@mdi/js'
import { VContainer, VForm, VTextField, VTextarea, VBtn, VSpacer, VDialog, VCard, VCardTitle, VCardText, VCardActions, VRow, VCol, VTable } from 'vuetify/components'
import { collection, getDocs, setDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore'
import { useFirestore, useCurrentUser } from 'vuefire'
import slugify from 'slugify'
import { articleConverter, LocalArticleType } from '~/stores'
import { Image } from '~/functions/src/types'

definePageMeta({ layout: 'admin' })

const db = useFirestore()
const user = useCurrentUser()

const dialog = ref(false)
const id = ref<string|null>(null)
const imageManager = ref()
const images = ref<Image[]>([])
const title = ref<string>('')
const description = ref<string>('')
const content = ref<string>('')
const creationDate = ref(new Date(Date.now()))
const loading = ref(false)
const fileLoading = ref(false)
const removing = ref(false)
const form = ref<VForm>()

const articlesRef = collection(db, 'articles').withConverter(articleConverter)

const getArticles = async () => {
  const articlesQuery = query(articlesRef, orderBy('creationDate', 'desc'))
  const articles = await getDocs(articlesQuery)
  return articles.docs.map(doc => doc.data())
}
const articles = ref(await getArticles())

const createArticle = () => {
  id.value = doc(articlesRef).id
  dialog.value = true
}

const saveArticle = async () => {
  if (!(await form.value?.validate())?.valid || !id.value || !user.value) { return }
  loading.value = true

  try {
    await imageManager.value.save()

    const articleRef = doc(articlesRef, id.value)
    await setDoc(articleRef, {
      id: id.value,
      images: images.value,
      title: title.value,
      slug: slugify(title.value + '-' + articleRef.id, {
        lower: true,
        strict: true
      }),
      description: description.value,
      content: content.value,
      creationDate: Timestamp.fromDate(creationDate.value),
      updateDate: Timestamp.now()
    })

    articles.value = await getArticles()
  } finally {
    reset()
  }
}

const edit = (article: LocalArticleType) => {
  id.value = article.id
  images.value = article.images
  title.value = article.title
  description.value = article.description
  content.value = article.content
  creationDate.value = article.creationDate
  dialog.value = true
}

const removeArticle = async () => {
  removing.value = true

  try {
    images.value?.forEach((_, id) => imageManager.value.deleteImg(id))
    await imageManager.value.save()

    // const articleRef = doc(articlesRef, id.value)
    // await deleteDoc(articleRef)

    articles.value = await getArticles()
  } finally {
    reset()
  }
}

const reset = () => {
  id.value = null
  images.value = []
  title.value = ''
  description.value = ''
  content.value = ''
  creationDate.value = new Date(Date.now())
  dialog.value = false
  loading.value = false
  removing.value = false
}

const dateFormatter = new Intl.DateTimeFormat('fr', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}).format
</script>
