<template>
  <video
    ref="video"
    :src="bestVideoFormatSrc"
    :loop="loop"
    :autoplay="autoplay"
    :muted="muted"
    :playsinline="playsinline"
    :controls="controls"
    :poster="thumbnail"
    @play="load"
  />
</template>

<script lang="ts" setup>
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { storeToRefs } from "pinia";
import { useFirebaseStorage } from "vuefire";
import { useStore } from "@/stores";

const createRefPath = (ref: string, format: string) => {
  if (ref.slice(0, 8) !== "https://") {
    return ref + format;
  }
  const altPos = ref.indexOf("?alt=");
  return ref.slice(0, altPos) + format + ref.slice(altPos);
};

const props = defineProps<{
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  playsinline?: boolean;
  controls?: boolean;
  thumbnail?: string;
}>();
const emits = defineEmits<{ (e: "getVideo", val: HTMLVideoElement): void }>();

const store = useStore();
const { av1Support, vp9Support } = storeToRefs(store);
const storage = useFirebaseStorage();

const bestVideoFormatSrc = ref<string>();
const video = ref<HTMLVideoElement>();

const getBestVideoFormat = async () => {
  if (!props.src) {
    return;
  }
  let bestFormat = "";
  if (av1Support.value) {
    bestFormat = "-av1.mp4";
  } else if (vp9Support.value) {
    bestFormat = "-vp9.webm";
  }
  const refs = [bestFormat, ""].map((it) =>
    storageRef(storage, createRefPath(props.src as string, it)),
  );
  const urlsPromises = refs.map((it) => getDownloadURL(it));
  const urls = await Promise.allSettled(urlsPromises);
  // @ts-ignore
  const bestUrl = urls.find((it) => it.status === "fulfilled")?.value;
  bestVideoFormatSrc.value = bestUrl || props.src;
};

watch(
  () => props.src,
  async (after, before) => {
    if (
      after !== before &&
      vp9Support.value !== null &&
      av1Support.value !== null
    ) {
      await getBestVideoFormat();
    }
  },
);
watch(av1Support, async (value) => {
  if (value !== null && vp9Support.value !== null) {
    await getBestVideoFormat();
  }
});
watch(vp9Support, async (value) => {
  if (value !== null && av1Support.value !== null) {
    await getBestVideoFormat();
  }
});

onMounted(getBestVideoFormat);

const load = () => {
  if (video.value) {
    emits("getVideo", video.value);
  }
};
</script>

<style>
video {
  object-fit: cover;
  object-position: center center;
  width: 100%;
}
</style>
