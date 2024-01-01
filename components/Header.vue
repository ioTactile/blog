<template>
  <div>
    <v-app-bar color="background" height="80">
      <v-app-bar-nav-icon class="d-block d-sm-none" @click="toggleDrawer" />
      <v-spacer class="d-block d-sm-none" />
      <NuxtLink to="/" class="text-decoration-none ml-4">
        <v-img src="/iotactile.png" height="50" :width="xs ? '140' : '200'" />
      </NuxtLink>
      <v-spacer />
      <div v-if="admin && adminUser" class="text-center">
        <v-btn
          variant="text"
          to="/admin/articles"
          class="text-capitalize text-h6"
        >
          Articles
        </v-btn>
        <v-btn
          variant="text"
          to="/admin/utilisateurs"
          class="text-capitalize text-h6"
        >
          Utilisateurs
        </v-btn>
      </div>
      <v-btn
        variant="text"
        to="/about"
        class="d-none d-sm-flex text-capitalize text-h6"
      >
        À propos
      </v-btn>
      <v-btn
        class="d-none d-sm-block"
        :icon="mdiThemeLightDark"
        @click="toggleTheme"
      />
      <v-btn :icon="mdiAccount" size="large" @click="isLogin('/profil')" />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      width="200"
      color="background"
    >
      <v-list nav>
        <v-list-item to="/about"> À Propos </v-list-item>
        <v-list-item @click="toggleTheme">
          Thème {{ theme.current.value.dark ? "clair" : "sombre" }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <client-only>
      <Connexion v-model="login" />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import {
  VAppBar,
  VAppBarNavIcon,
  VBtn,
  VImg,
  VList,
  VListItem,
  VNavigationDrawer,
  VSpacer,
} from "vuetify/components";
import { mdiAccount, mdiThemeLightDark } from "@mdi/js";
import { getIdTokenResult } from "firebase/auth";
import { useDisplay, useTheme } from "vuetify";

const { xs } = useDisplay();
const theme = useTheme();
const user = useCurrentUser();

const login = ref<boolean>(false);
const adminUser = ref<boolean | unknown>(false);
const drawer = ref<boolean>(false);

defineProps<{ admin?: boolean }>();

onMounted(async () => {
  if (!user.value) {
    return;
  }
  const { claims } = await getIdTokenResult(user.value, true);
  adminUser.value = claims.admin;

  localStorage.getItem("theme") === "myCustomDarkTheme"
    ? (theme.global.name.value = "myCustomDarkTheme")
    : (theme.global.name.value = "myCustomLightTheme");
});

const isLogin = (path: string) => {
  if (!user.value) {
    login.value = true;
  } else {
    navigateTo(path);
  }
};

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const toggleTheme = () => {
  theme.global.name.value =
    theme.name.value === "myCustomLightTheme"
      ? "myCustomDarkTheme"
      : "myCustomLightTheme";

  localStorage.setItem("theme", theme.global.name.value);
};
</script>
