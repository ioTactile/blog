import { createVuetify, ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    // Illustration
    main: '#fffffe', // white
    secondary: '#e3f6f5', // light blue
    tertiary: '#bae8e8', // light blue
    logo: '#d9c9ba', // light brown
    stroke: '#272343', // dark blue
    highlight: '#ffd803', // yellow
    // Elements
    background: '#fffffe', // white
    headline: '#272343', // dark blue
    paragraph: '#2d334a', // dark blue
    buttonBack: '#ffd803', // yellow
    buttonText: '#272343', // dark blue
    // Events
    error: '#ed4337', // red
    success: '#4caf50' // green
  }
}

const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    // Illustration
    main: '#272343', // dark blue
    secondary: '#2d334a', // dark blue
    tertiary: '#3a405e', // dark blue
    logo: '#d9c9ba', // light brown
    stroke: '#fffffe', // white
    highlight: '#ffd803', // yellow
    // Elements
    background: '#1c1f2e', // dark
    headline: '#fffffe', // white
    paragraph: '#e3f6f5', // light blue
    buttonBack: '#ffd803', // yellow
    buttonText: '#fffffe', // white
    // Events
    error: '#ed4337', // red
    success: '#4caf50' // green
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi }
    },
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: { myCustomLightTheme, myCustomDarkTheme }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
