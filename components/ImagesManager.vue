<template>
  <v-card>
    <v-card-title>
      <slot>
        <span v-if="!label" class="text-capitalize">
          {{ type }}{{ unique ? '' : 's' }}
        </span>
        <span v-else>{{ label }}</span>
      </slot>
    </v-card-title>
    <v-card-text>
      <v-row class="py-3" align="center" justify="center">
        <v-col cols="12">
          <v-file-input
            v-model="currentFiles"
            :disabled="disabled || !slug"
            :loading="!!fileLoading"
            :hint="slug ? '' : 'Définissez d\'abord le lien'"
            :persistent-hint="!slug"
            :clearable="false"
            :multiple="!unique"
            :accept="video ? 'video/*' : 'image/png,image/jpeg,image/svg+xml'"
            :prepend-icon="video ? mdiVideo : mdiImage"
            :label="fileInputLabel"
          >
            <template #selection="{ fileNames }">
              <v-chip small label color="primary">
                {{ fileNames.join(', ') }}
              </v-chip>
            </template>
          </v-file-input>
          <v-divider class="my-2" />
        </v-col>
      </v-row>
      <v-container v-if="unique && allImages.length && allImages[0]">
        <VideoManager v-if="video" controls :src="allImages[0]?.ref" />
        <StorageImg
          v-else
          contain
          height="150"
          :storage-src="allImages[0]?.ref"
          :src="allImages[0]?.url"
        />
      </v-container>
      <v-container v-if="allImages.length && !unique">
        <v-row class="py-3">
          <v-col cols="12" class="pt-0">
            <v-table>
              <thead>
                <tr>
                  <th />
                  <th v-if="allowCopy" />
                  <th class="text-left">Image</th>
                  <th class="text-left">Action</th>
                </tr>
              </thead>
              <draggable
                :model-value="allImages"
                tag="tbody"
                item-key="name"
                @update:model-value="updateList"
              >
                <template #item="{ element, index }">
                  <tr>
                    <td class="icon-container">
                      <v-icon :icon="mdiDrag" />
                    </td>
                    <td v-if="allowCopy">
                      <v-btn
                        :icon="mdiContentCopy"
                        variant="text"
                        :disabled="!element.url"
                        @click="copy(element.url)"
                      />
                    </td>
                    <td class="text-left">
                      <VideoManager v-if="video" controls :src="element.ref" />
                      <template v-else>
                        <StorageImg
                          v-if="
                            (element &&
                              element.name &&
                              element.name.split('.')[
                                element.name.split('.').length - 1
                              ] !== 'pdf') ||
                            !element.name
                          "
                          height="50"
                          width="50"
                          contain
                          :storage-src="element.ref"
                          :src="element.url"
                        />
                        <v-hover v-else v-slot="{ isHovering }">
                          <v-icon
                            :size="isHovering ? 47 : 45"
                            class="pointer"
                            :class="isHovering ? 'elevation-12' : 'elevation-2'"
                            :icon="mdiFilePdfBox"
                            @click="displayPdfFile(element)"
                          />
                        </v-hover>
                      </template>
                    </td>
                    <td>
                      <v-btn
                        :icon="mdiDelete"
                        color="red"
                        variant="text"
                        :loading="fileRemoving === index"
                        @click="deleteImg(index)"
                      />
                      <v-tooltip
                        v-if="index === 0"
                        location="top"
                        text="Image par défaut"
                      >
                        <template #activator="{ props: attrs }">
                          <v-icon
                            :icon="mdiCrown"
                            color="primary"
                            dark
                            v-bind="attrs"
                          />
                        </template>
                      </v-tooltip>
                    </td>
                  </tr>
                </template>
              </draggable>
            </v-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {
  VCard,
  VCardTitle,
  VCardText,
  VFileInput,
  VDivider,
  VTable,
  VBtn,
  VIcon,
  VTooltip,
  VChip,
  VRow,
  VCol,
  VContainer,
  VHover
} from 'vuetify/components'
import {
  mdiDrag,
  mdiContentCopy,
  mdiFilePdfBox,
  mdiCrown,
  mdiVideo,
  mdiImage,
  mdiDelete
} from '@mdi/js'
import draggable from 'vuedraggable'
import {
  ref as storageRef,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage'
import type { StorageReference } from 'firebase/storage'
import { useFirebaseStorage } from 'vuefire'
import { resizeImage } from '~/assets/imageManipulation'

const toBase64 = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () =>
      resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = (error) => reject(error)
  })

type dbFile = {
  url: string
  ref?: string
  name: string
  file?: File
}

type tuUpFile = Omit<dbFile, 'ref'> & { file: File }

const props = defineProps<{
  modelValue?: dbFile[] | dbFile
  slug: string
  collection: string
  disabled?: boolean
  maxHeight?: number
  unique?: boolean
  video?: boolean
  label?: string
  allowCopy?: boolean
}>()
const emits = defineEmits<{
  (e: 'update:model-value', value?: dbFile[] | dbFile): void
  (e: 'fileLoading', value: boolean): void
}>()

const storage = useFirebaseStorage()
const { notifier } = useNotifier()

const currentFiles = ref<File[]>()
const fileLoading = ref(false)
const fileRemoving = ref<number>()
const uploadProgress = ref<number>()
const toUpload = ref<tuUpFile[]>([])
const toDelete = ref<dbFile[]>([])
const allImages = ref<dbFile[]>(
  Array.isArray(props.modelValue)
    ? props.modelValue
    : props.modelValue
    ? [props.modelValue]
    : []
)
const saving = ref(false)

const type = computed(() => (props.video ? 'video' : 'illustration'))
const fileInputLabel = computed(() => {
  const determinant = props.video ? 'la ' : "l'"
  if (!props.unique) {
    return `Ajouter des ${type.value}s`
  }
  if (Array.isArray(allImages.value) && allImages.value.length) {
    return `Modifier ${determinant}${type.value}`
  }
  return `Ajouter une ${type.value}`
})

watch(currentFiles, async (files) => {
  if (!files) {
    return
  }
  emits('fileLoading', true)
  fileLoading.value = true

  let newFiles = Array.isArray(files) ? files : [files]
  if (!props.video) {
    newFiles = await resizeImage(newFiles, props.maxHeight)
  }

  for (let i = 0; i < newFiles.length; i++) {
    const file = newFiles[i]

    try {
      const result = {
        url: await toBase64(file),
        name: `${Date.now()}-${file.name}`,
        file
      }

      if (!props.unique) {
        toUpload.value.push(result)
      } else {
        toUpload.value = [result]
      }
    } catch (error) {
      notifier({
        content: "Une erreur est survenue lors de l'envoie de l'image",
        color: 'error',
        error
      })
    }
  }

  fileLoading.value = false
  emits('fileLoading', false)
  currentFiles.value = undefined
})

watch(toUpload, (newValue) => {
  if (!props.unique) {
    allImages.value = [
      ...(props.modelValue
        ? Array.isArray(props.modelValue)
          ? props.modelValue
          : [props.modelValue]
        : []),
      ...newValue
    ]
  } else {
    if (Array.isArray(props.modelValue) && props.modelValue.length) {
      emits('update:model-value', undefined)
    }
    allImages.value = [...newValue]
  }
})

watch(
  () => props.modelValue,
  () => {
    if (Array.isArray(props.modelValue) && !saving.value) {
      allImages.value = [...props.modelValue, ...toUpload.value]
    }
  }
)

const displayPdfFile = async (file: dbFile) => {
  if (
    !file ||
    file.name?.split('.')?.[file.name?.split('.')?.length - 1] !== 'pdf'
  ) {
    return
  }

  const fileRef = storageRef(
    storage,
    `${props.collection}/${props.slug}/${file.name}`
  )
  const downloadURL = await getDownloadURL(fileRef)
  window.open(downloadURL, '_blank')?.focus()
}

const uploadFile = (file: tuUpFile, transferred: number, totalSize: number) =>
  new Promise<dbFile>((resolve, reject) => {
    let fileRef: StorageReference
    if (props.unique) {
      fileRef = storageRef(storage, `${props.collection}/${props.slug}`)
    } else {
      fileRef = storageRef(
        storage,
        `${props.collection}/${props.slug}/${file.name}`
      )
    }
    const uploadTask = uploadBytesResumable(fileRef, file.file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        uploadProgress.value =
          ((transferred + snapshot.bytesTransferred) / totalSize) * 100
      },
      reject,
      async () => {
        resolve({
          url: await getDownloadURL(fileRef),
          ref: fileRef.fullPath,
          name: file.name
        })
      }
    )
  })

const deleteImg = (id: number) => {
  if (!Array.isArray(props.modelValue)) {
    return
  }
  fileRemoving.value = id
  if (id >= props.modelValue.length) {
    toUpload.value = toUpload.value.filter(
      (_, index) => index !== id - (props.modelValue as dbFile[]).length
    )
  } else {
    toDelete.value.push(props.modelValue[id])
    const illustrations = props.modelValue.filter((_, i) => i !== id)
    emits('update:model-value', illustrations)
    fileRemoving.value = undefined
  }
}

const save = async () => {
  saving.value = true
  if (!toUpload.value.length && !toDelete.value.length) {
    return
  }
  const formats = ['', '.webp', '.avif']
  if (toUpload.value.length) {
    const uploadPromises = []
    const totalSize = toUpload.value.reduce(
      (result, it) => result + it.file.size,
      0
    )
    for (const file of toUpload.value) {
      uploadPromises.push(uploadFile(file, 0, totalSize))
    }

    const results = await Promise.all(uploadPromises)

    if (props.unique) {
      emits(
        'update:model-value',
        results[0] ||
          (Array.isArray(props.modelValue)
            ? props.modelValue[0]
            : props.modelValue)
      )
    } else {
      emits('update:model-value', [
        ...(props.modelValue
          ? Array.isArray(props.modelValue)
            ? props.modelValue
            : [props.modelValue]
          : []),
        ...results
      ])
    }
  }

  if (!toDelete.value.length) {
    return
  }

  const deletePromise = []

  for (const file of toDelete.value) {
    let fileRefs
    let promises
    if (file.name.includes('pdf')) {
      fileRefs = storageRef(storage, file.ref)
      promises = deleteObject(fileRefs)
      deletePromise.push(promises)
    } else if (
      formats
        .filter((_, i) => i !== 0)
        .some((format) => file.name.includes(format))
    ) {
      fileRefs = formats.map((it) => storageRef(storage, file.ref + it))
      promises = fileRefs.map((it) => deleteObject(it))
      deletePromise.push(...promises)
    } else {
      fileRefs = storageRef(storage, file.ref)
      promises = deleteObject(fileRefs)
      deletePromise.push(promises)
    }
  }

  await Promise.all(deletePromise)
  saving.value = false
}

const updateList = (newVal: dbFile[]) => {
  emits('update:model-value', newVal)
  allImages.value = newVal
}

const copy = async (value: string) => {
  // @ts-ignore
  const result = await navigator.permissions.query({ name: 'clipboard-write' })
  if (result.state === 'granted' || result.state === 'prompt') {
    await navigator.clipboard.writeText(value)
    notifier({
      color: 'success',
      content: 'Lien copié avec succès !'
    })
  }
}

defineExpose({ save, deleteImg })
</script>

<style>
.icon-container {
  width: 30px;
}
</style>
