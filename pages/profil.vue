<template>
  <v-container>
    <Head>
      <Title>Profil</Title>
      <Meta name="description" content="Page où l'on retrouve les informations utilisateur" />
    </Head>
    <v-row>
      <v-col cols="12">
        <v-card rounded="0" color="main" elevation="0">
          <v-card-title class="d-flex justify-space-between align-center">
            <h2 class="text-h5">
              Mon profil
            </h2>
            <v-btn
              :icon="mdiDotsVertical"
              variant="text"
              @click="openDeleteUser = !openDeleteUser"
            />
          </v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="updateProfile">
              <div class="d-flex">
                <v-text-field
                  v-model="firstName"
                  :disabled="!change"
                  type="text"
                  label="Prénom"
                  variant="outlined"
                />
                <v-text-field
                  v-model="lastName"
                  :disabled="!change"
                  type="text"
                  label="Nom"
                  variant="outlined"
                  class="ml-2"
                />
                <v-btn
                  class="ml-2"
                  :icon="mdiPencil"
                  variant="text"
                  @click="isChange()"
                />
              </div>
              <v-btn
                v-if="change"
                block
                type="submit"
                color="buttonBack"
                :loadind="loading"
              >
                Modifier
              </v-btn>
            </v-form>
          </v-card-text>
          <v-divider />
          <v-card-text>
            <v-btn
              class="mt-2"
              block
              color="highlight"
              :disabled="loading"
              @click="logout"
            >
              Se déconnecter
            </v-btn>
            <v-btn
              v-if="openDeleteUser"
              class="mt-4"
              block
              color="buttonBack"
              variant="outlined"
              :disabled="loading"
              @click="deleteProfile"
            >
              Supprimer votre compte
            </v-btn>
            <v-btn
              v-if="userClaims?.admin"
              class="mt-4"
              block
              color="buttonText"
              to="/admin"
            >
              Espace d'administration
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { VContainer, VRow, VCol, VCard, VCardTitle, VCardText, VForm, VTextField, VBtn, VDivider } from 'vuetify/components'
import { mdiDotsVertical, mdiPencil } from '@mdi/js'
import { deleteUser, getIdTokenResult, signOut } from '@firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { userConverter } from '~/stores'

const { notifier } = useNotifier()
const auth = useFirebaseAuth()
const user = useCurrentUser()
const db = useFirestore()

const userClaims = ref()
const loading = ref(false)
const change = ref(false)
const openDeleteUser = ref(false)
const firstName = ref<string>()
const lastName = ref<string>()
const form = ref(VForm)

const isChange = () => {
  if (!change.value) {
    change.value = true
  } else {
    change.value = false
  }
}

onMounted(async () => {
  if (!user.value) {
    return
  }
  const userId = user.value.uid
  const userRef = doc(db, 'users', userId).withConverter(userConverter)
  const userDoc = await getDoc(userRef)
  const userFetched = userDoc.data()
  if (userFetched) {
    firstName.value = userFetched.firstName
    lastName.value = userFetched.lastName
  }

  const { claims } = await getIdTokenResult(user.value, true)
  userClaims.value = claims
})

const updateProfile = async () => {
  if (!user.value || !(await form.value?.validate())?.valid) { return }
  loading.value = true

  try {
    if (user.value) {
      const userId = user.value.uid
      const userRef = doc(db, 'users', userId).withConverter(userConverter)
      await setDoc(
        userRef,
        { firstName: firstName.value, lastName: lastName.value },
        { merge: true }
      )
      notifier({
        content: 'Profil mis à jour',
        color: 'main'
      })
    }
  } catch (error) {
    notifier({
      content:
          'Une erreur est survenue lors de la mise à jour de vos informations',
      color: 'error',
      error
    })
  } finally {
    change.value = false
    loading.value = false
  }
}

const deleteProfile = async () => {
  if (!user.value) {
    return
  }
  loading.value = true

  try {
    const userRef = doc(db, 'users', user.value.uid)
    await deleteDoc(userRef)
    await deleteUser(user.value)
  } catch (error) {
    notifier({
      content: 'Une erreur est survenue lors de la suppression de votre compte',
      color: 'error',
      error
    })
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  if (!auth) {
    return
  }
  loading.value = true

  try {
    await signOut(auth)
    await navigateTo('/')
  } catch (error) {
    notifier({
      content: 'Une erreur est survenue lors de la déconnexion',
      color: 'error',
      error
    })
  } finally {
    loading.value = false
  }
}
</script>
