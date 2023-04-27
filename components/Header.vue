<template>
  <div>
    <v-app-bar color="background" elevation="0" height="80">
      <NuxtLink to="/" class="text-decoration-none ml-4">
        <h1
          class="font-weight-bold text-headline text-h5 text-md-h4"
        >
          ioTactile
        </h1>
      </NuxtLink>
      <v-spacer />
      <div v-if="admin && adminUser" class="text-center">
        <v-btn variant="text" to="/admin/articles" class="text-capitalize text-h6">
          Articles
        </v-btn>
        <v-btn variant="text" to="/admin/utilisateurs" class="text-capitalize text-h6">
          Utilisateurs
        </v-btn>
      </div>
      <v-btn variant="text" to="/about" class="text-capitalize text-h6">
        À propos
      </v-btn>
      <v-btn icon="mdi-account" size="large" @click="isLogin('/profil')" />
    </v-app-bar>

    <client-only>
      <Connexion v-model="login" />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { getIdTokenResult } from 'firebase/auth'
import { useCurrentUser } from 'vuefire'

const user = useCurrentUser()

const login = ref(false)
const adminUser = ref(false)

defineProps<{ admin?: boolean }>()

onMounted(async () => {
  if (!user.value) {
    return
  }
  const { claims } = await getIdTokenResult(user.value, true)
  adminUser.value = claims.admin
})

const isLogin = (path: string) => {
  if (!user.value) {
    login.value = true
  } else {
    navigateTo(path)
  }
}
</script>
