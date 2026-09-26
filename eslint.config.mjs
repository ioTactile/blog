import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  ignores: ["functions/**"],
  rules: {
    "vue/multi-word-component-names": "off",
  },
});
