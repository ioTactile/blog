<template>
  <template v-if="showComments === 'show'">
    <div v-if="!comments?.length" class="text-center font-weight-bold">Aucun commentaire</div>
    <div v-else>
      <v-card v-for="(message, i) in comments" :key="i" max-width="600" elevation="3">
        <v-card-title class="d-flex flex-column py-0 mb-0">
          {{ message?.firstName }}
          {{ message?.lastName.substring(0, 1) + '.' }}
        </v-card-title>
        <v-card-subtitle class="my-0">
          {{ dateFormatter(message?.createdAt) }}
        </v-card-subtitle>
        <v-card-text class="my-0">{{ message?.content }}</v-card-text>
      </v-card>
    </div>
  </template>
  <template v-if="showComments === 'not-show'">
    <div :style="'max-width: 600px'">
      <v-textarea
        v-model="comment"
        variant="outlined"
        label="Laisser un commentaire"
        placeholder="Votre commentaire"
        hide-details
        auto-grow
      />
      <div class="d-flex">
        <v-text-field v-model="lastName" variant="outlined" label="Votre nom" class="ma-0 pa-0" />
        <v-text-field
          v-model="firstName"
          variant="outlined"
          label="Votre prénom"
          class="ma-0 pa-0 ml-2"
        />
      </div>
      <v-btn :loading="loading" color="highlight" class="ml-4" @click="sendComment">
        Envoyer
      </v-btn>
    </div>
  </template>
</template>

<script setup async lang="ts">
import {
  VTextarea,
  VTextField,
  VBtn,
  VCard,
  VCardText,
  VCardTitle,
  VCardSubtitle,
} from 'vuetify/components';
import { updateDoc, doc, arrayUnion, Timestamp, getDoc } from '@firebase/firestore';
import { articleConverter } from '~/stores';
import type { LocalArticleType } from '~/stores';

const props = defineProps<{
  showComments: string;
  id: string;
}>();

const { notifier } = useNotifier();
const db = useFirestore();

const articleRef = doc(db, 'articles', props.id).withConverter(articleConverter);

const loading = ref<boolean>(false);
const comment = ref<string>('');
const lastName = ref<string>('');
const firstName = ref<string>('');
const createdAt = ref(new Date(Date.now()));

const comments = ref<LocalArticleType['comments']>([]);

const articleDoc = await getDoc(articleRef);
comments.value = articleDoc.data()?.comments ?? [];

const sendComment = async () => {
  if (!comment.value || !firstName.value || !lastName.value) {
    notifier({ content: 'Veuillez remplir tous les champs', color: 'error' });
    return;
  }
  try {
    loading.value = true;

    await updateDoc(articleRef, {
      comments: arrayUnion({
        firstName: firstName.value,
        lastName: lastName.value,
        content: comment.value,
        createdAt: Timestamp.fromDate(createdAt.value),
        updatedAt: Timestamp.now(),
      }),
    });

    notifier({ content: 'Commentaire envoyé', color: 'success' });
  } finally {
    comment.value = '';
    firstName.value = '';
    lastName.value = '';
    loading.value = false;
  }
};

const dateFormatter = new Intl.DateTimeFormat('fr', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format;
</script>

<style scoped>
div {
  margin: 20px auto;
}
</style>
