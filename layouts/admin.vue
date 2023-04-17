<template>
  <v-app class="overflow-x-hidden">
    <Header admin />
    <v-main class="background">
      <slot />
    </v-main>
    <Footer />
    <ClientOnly>
      <Snackbar />
    </ClientOnly>
  </v-app>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCurrentUser } from 'vuefire'
import { useStore } from '~/stores'
import TestAllFeatures from '~/assets/feature-test'

const user = useCurrentUser()
const { notifier } = useNotifier()

const store = useStore()
const { av1Support, avifSupport, vp9Support, webpSupport } = storeToRefs(store)

onErrorCaptured((error) => {
  notifier({ error })
  return false
})

onBeforeMount(async () => {
  if (!user.value) { return await navigateTo('/') }
  const { vp9Available, av1Available, webpAvailable, avifAvailable } =
    await TestAllFeatures()

  av1Support.value = av1Available
  avifSupport.value = avifAvailable
  vp9Support.value = vp9Available
  webpSupport.value = webpAvailable
})
</script>
