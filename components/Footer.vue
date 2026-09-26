<template>
  <div>
    <v-footer color="background" class="py-4">
      <v-row>
        <v-col cols="12" class="text-center text-md-h6 mt-4">
          © {{ new Date().getFullYear() }} - Réalisé par
          <a href="https://github.com/ioTactile" class="text-decoration-none text-logo">
            <strong>iotactile</strong>
          </a>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script lang="ts" setup>
import { VFooter, VRow, VCol } from 'vuetify/components';
</script>
