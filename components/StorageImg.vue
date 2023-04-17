<template>
  <v-img :src="imageUrl">
    <slot />
  </v-img>
</template>

<script lang="ts" setup>
import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import { storeToRefs } from 'pinia'
import { useFirebaseStorage } from 'vuefire'
import { useStore } from '@/stores'

const props = defineProps<{
  src?: string
  storageSrc?: string
}>()

const store = useStore()
const { avifSupport, webpSupport } = storeToRefs(store)
const storage = useFirebaseStorage()

const imageUrl = ref<string|undefined>(undefined)

watch(
  () => props.storageSrc,
  async (after, before) => {
    if (
      after !== before &&
      webpSupport.value !== null &&
      avifSupport.value !== null
    ) { await getImage() }
  }
)
watch(
  () => props.src,
  async (after, before) => {
    if (
      after !== before &&
      webpSupport.value !== null &&
      avifSupport.value !== null
    ) { await getImage() }
  }
)
watch(
  avifSupport,
  async (value) => {
    if (value !== null && webpSupport.value !== null) { await getImage() }
  }
)
watch(
  webpSupport,
  async (value) => {
    if (value !== null && avifSupport.value !== null) { await getImage() }
  }
)

const createRefPath = (ref: string, format: string) => {
  if (ref.slice(0, 8) !== 'https://') { return ref + format }
  const altPos = ref.indexOf('?alt=')
  return ref.slice(0, altPos) + format + ref.slice(altPos)
}

const getImage = async () => {
  if (!props.storageSrc) { return (imageUrl.value = props.src) }
  let bestFormat = ''
  if (avifSupport.value) { bestFormat = '.avif' } else if (webpSupport.value) { bestFormat = '.webp' }
  const refs = [bestFormat, ''].map(it =>
    storageRef(storage, createRefPath(props.storageSrc || '', it))
  )
  const urlsPromises = refs.map(it => getDownloadURL(it))
  const urls = await Promise.allSettled(urlsPromises)
  // @ts-ignore
  const bestUrl = urls.find(it => it.status === 'fulfilled')?.value
  imageUrl.value = bestUrl || props.src
}

onMounted(getImage)
</script>
