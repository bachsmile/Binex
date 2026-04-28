<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})
</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-black text-white">
    <!-- Video Background -->
    <video
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      loop
      muted
      playsinline
    >
      <source
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
        type="video/mp4"
      />
    </video>

    <!-- Page Content -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Navbar -->
      <nav class="px-6 md:px-12 lg:px-16 pt-6">
        <div class="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
          <!-- Left: Logo -->
          <span class="text-2xl font-semibold tracking-tight">VEX</span>

          <!-- Center: Links (hidden on mobile) -->
          <div class="hidden md:flex items-center gap-8">
            <a
              v-for="link in ['Story', 'Investing', 'Building', 'Advisory']"
              :key="link"
              href="#"
              class="text-sm text-white/80 hover:text-gray-300 transition-colors duration-300"
            >
              {{ link }}
            </a>
          </div>

          <!-- Right: CTA Button -->
          <button
            class="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            Start a Chat
          </button>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="flex-1 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-12 lg:pb-16">
        <div class="lg:grid lg:grid-cols-2 lg:items-end">
          <!-- Left Column: Main Content -->
          <div>
            <!-- Animated Heading -->
            <h1
              class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4"
              :style="{ letterSpacing: '-0.04em' }"
            >
              <CommonsFadeIn :delay="0" :duration="0">
                <CommonsAnimatedHeading
                  :text="'Shaping tomorrow\nwith vision and action.'"
                  :initial-delay="200"
                  :char-delay="30"
                  :transition-duration="500"
                />
              </CommonsFadeIn>
            </h1>

            <!-- Subheading -->
            <CommonsFadeIn :delay="800" :duration="1000">
              <p class="text-base md:text-lg text-gray-300 mb-5">
                We back visionaries and craft ventures that define what comes next.
              </p>
            </CommonsFadeIn>

            <!-- Buttons -->
            <CommonsFadeIn :delay="1200" :duration="1000">
              <div class="flex flex-wrap gap-4">
                <button
                  class="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
                >
                  Start a Chat
                </button>
                <button
                  class="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-300"
                >
                  Explore Now
                </button>
              </div>
            </CommonsFadeIn>
          </div>

          <!-- Right Column: Tag -->
          <div class="flex items-end justify-start lg:justify-end mt-8 lg:mt-0">
            <CommonsFadeIn :delay="1400" :duration="1000">
              <div class="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
                <span class="text-lg md:text-xl lg:text-2xl font-light">
                  Investing. Building. Advisory.
                </span>
              </div>
            </CommonsFadeIn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Disable the global transition-colors on this page to avoid interfering with hero animations */
:deep(*) {
  transition-property: none !important;
}
/* Re-enable transitions only where we explicitly want them */
:deep(.transition-opacity) {
  transition-property: opacity !important;
}
:deep(.transition-colors) {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important;
}
:deep(.transition-all) {
  transition-property: all !important;
}
</style>
