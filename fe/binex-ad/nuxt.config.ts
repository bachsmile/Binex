// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap' },
      ],
    },
  },
  modules: [
    "@element-plus/nuxt",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  colorMode: {
    classSuffix: "-mode",
  },
  devServer: {
    port: 3301,
  },
  css: ["~/tailwind.css"],
  future: {
    compatibilityVersion: 4,
  },
  imports: {
    dirs: ['api']
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:3000",
    },
  },
});
