<template>
  <div>
    <Head>
      <Title>Accueil administrateur - ioTactile</Title>
      <Meta name="description" content="Accueil administrateur - ioTactile" />
    </Head>
    <v-container class="text-center text-headline text-h6 text-md-h5">
      Interface d'administration
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { VContainer } from 'vuetify/components'

definePageMeta({ layout: 'admin' })
</script>
