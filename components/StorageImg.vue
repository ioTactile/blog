<template>
  <v-img :src="imageUrl">
    <slot />
  </v-img>
</template>
<script lang="ts" setup>
import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import { useFirebaseStorage } from 'vuefire'

const props = defineProps<{
      src?: string
      storageSrc?: string
    }>()

const storage = useFirebaseStorage()

const imageUrl = ref<string|undefined>(undefined)

watch(
  () => props.storageSrc,
  async (after, before) => {
    if (after !== before) { await getImage() }
  }
)
watch(
  () => props.src,
  async (after, before) => {
    if (after !== before) { await getImage() }
  }
)

const createRefPath = (ref: string, format: string) => {
  if (ref.slice(0, 8) !== 'https://') { return ref + format }
  const altPos = ref.indexOf('?alt=')
  return ref.slice(0, altPos) + format + ref.slice(altPos)
}

const getImage = async () => {
  if (!props.storageSrc) { return (imageUrl.value = props.src) }
  const refs = ['', ''].map(it =>
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
