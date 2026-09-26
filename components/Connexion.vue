<template>
  <v-dialog
    width="500"
    :model-value="modelValue"
    :persistent="loading !== null"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <v-card color="main">
      <v-card-title class="d-flex align-center">
        <span class="text-h5 mr-auto"> Espace administration </span>
        <v-btn
          :icon="mdiClose"
          variant="text"
          :disabled="loading !== null"
          @click="emits('update:modelValue', false)"
        />
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="login">
          <InputsEmail v-model="email" variant="outlined" icon name="email" />
          <InputsPassword
            v-if="!forgotPassword"
            v-model="password"
            class="mt-2"
            variant="outlined"
          />
          <div class="d-flex justify-center mb-10">
            <v-btn class="text-lowercase" variant="text" @click="forgotPassword = !forgotPassword">
              {{ forgotPassword ? 'Retour' : 'Mot de passe oublié' }}
            </v-btn>
          </div>
          <v-btn
            block
            color="buttonBack"
            type="submit"
            :disabled="loading !== null && loading !== 'email'"
            :loading="loading === 'email'"
          >
            {{ forgotPassword ? 'Réinitialiser mon mot de passe' : 'Connexion' }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { VForm, VCard, VBtn, VCardText, VDialog, VCardTitle } from 'vuetify/components';
import { mdiClose } from '@mdi/js';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthErrorCodes,
  getIdTokenResult,
} from 'firebase/auth';
import type { ParsedToken } from 'firebase/auth';
import { FirebaseError } from '@firebase/util';

const { notifier } = useNotifier();
const user = useCurrentUser();
const auth = useFirebaseAuth();

defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const email = ref('');
const password = ref('');
const userClaims = ref<null | ParsedToken>(null);
const forgotPassword = ref(false);
const loading = ref<'email' | null>(null);
const form = ref<VForm>();

onBeforeMount(async () => {
  if (user.value) {
    const { claims } = await getIdTokenResult(user.value, true);
    userClaims.value = claims;
  }
});

const login = async () => {
  if (!auth || !(await form.value?.validate())?.valid) {
    return;
  }
  loading.value = 'email';
  try {
    if (forgotPassword.value) {
      await sendPasswordResetEmail(auth, email.value);
      notifier({
        content: 'Un email de réinitialisation a été envoyé',
        color: 'success',
      });
      forgotPassword.value = false;
    } else {
      const userCredentials = await signInWithEmailAndPassword(auth, email.value, password.value);
      const { claims } = await getIdTokenResult(userCredentials.user, true);
      if (claims.admin) {
        navigateTo('/admin');
      }
    }
    emits('update:modelValue', false);
  } catch (error: unknown) {
    if (!(error instanceof FirebaseError)) {
      throw error;
    }

    let errMessage;
    switch (error.code) {
      case AuthErrorCodes.INVALID_PASSWORD:
        errMessage = 'Mot de passe incorrect';
        break;
      default:
        errMessage = 'une erreur est survenue';
        break;
    }
    notifier({ content: errMessage, color: 'error', error });
  } finally {
    loading.value = null;
  }
};
</script>
