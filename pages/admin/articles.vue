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
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="articleItem in articles" :key="articleItem.id">
          <td>
            <StorageImg
              :storage-src="articleItem.images?.[0]?.url"
              width="100"
              height="100"
              contain
            />
          </td>
          <td>{{ articleItem.title }}</td>
          <td>{{ articleItem.description }}</td>
          <td>{{ dateFormatter(articleItem.creationDate) }}</td>
          <td>
            <v-btn
              icon="mdi-pencil"
              color="secondary"
              variant="text"
              @click="edit(articleItem)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>

    <client-only>
      <v-dialog v-model="dialog" :persistent="loading || fileLoading">
        <v-card>
          <v-form ref="form" @submit.prevent="saveArticle">
            <v-card-title class="d-flex">
              <div>Création d'une actualité</div>
              <v-spacer />
              <v-btn icon="mdi-close" :disabled="loading || fileLoading" variant="text" @click="reset" />
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="title"
                    label="Titre"
                    :rules="[(v) => !!v || 'Le titre est requis']"
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
                  <ImagesManager
                    ref="imageManager"
                    v-model="images"
                    :slug="id || ''"
                    collection="articles"
                    :max-height="1000"
                    @file-loading="fileLoading = $event"
                  />
                </v-col>
                <v-col cols="12">
                  <div ref="editor" />
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
import { VForm } from 'vuetify/components'
import { collection, getDocs, setDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore'
import { useFirestore, useCurrentUser } from 'vuefire'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Embed from '@editorjs/embed'
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
const editor = ref<EditorJS>()
const creationDate = ref(new Date(Date.now()))
const loading = ref(false)
const fileLoading = ref(false)
const removing = ref(false)
const form = ref<VForm>()

const articlesRef = collection(db, 'articles').withConverter(articleConverter)

const getArticles = async () => {
  const articlesQuery = query(articlesRef, orderBy('date', 'desc'))
  const articles = await getDocs(articlesQuery)
  return articles.docs.map(doc => doc.data())
}
const articles = ref(await getArticles())

const createArticle = () => {
  id.value = doc(articlesRef).id
  dialog.value = true

  editor.value = new EditorJS({
    holder: 'editorjs',
    tools: {
      header: {
        class: Header,
        inlineToolbar: true
      },
      list: {
        class: List,
        inlineToolbar: [
          'link',
          'bold'
        ]
      },
      embed: {
        class: Embed,
        inlineToolbar: false,
        config: {
          services: {
            youtube: true,
            coub: true
          }
        }
      }
    },
    onReady: () => {
      console.log('Editor.js is ready to work!')
    }
  })
}

const saveArticle = async () => {
  if (!(await form.value?.validate())?.valid || !id.value || !user.value) { return }
  loading.value = true

  try {
    await imageManager.value.save()
    content.value = JSON.stringify(await editor.value?.save())

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

const edit = (newsItem: LocalArticleType) => {
  id.value = newsItem.id
  images.value = newsItem.images
  title.value = newsItem.title
  description.value = newsItem.description
  content.value = newsItem.content
  creationDate.value = newsItem.creationDate
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
