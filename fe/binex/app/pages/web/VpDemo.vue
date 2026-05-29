<template>
  <main class="demo-page">
    <section class="demo-hero">
      <div class="demo-glow demo-glow--blue" />
      <div class="demo-glow demo-glow--violet" />

      <div class="demo-copy">
        <p class="demo-eyebrow">Binex Vue Demo</p>
        <h1>React asset converted into a Vue/Nuxt demo page</h1>
        <p class="demo-description">
          This page uses the original React SVG artwork as an inline Vue
          template element, then adds Vue state, interaction, and scoped CSS
          animation without touching the source r3f project.
        </p>

        <div class="demo-actions">
          <button class="demo-button" type="button" @click="toggleOrbit">
            {{ isOrbiting ? 'Pause orbit' : 'Play orbit' }}
          </button>
          <button class="demo-button demo-button--ghost" type="button" @click="resetCounter">
            Reset clicks
          </button>
        </div>

        <dl class="demo-stats">
          <div>
            <dt>Framework</dt>
            <dd>Vue 3 / Nuxt</dd>
          </div>
          <div>
            <dt>Asset</dt>
            <dd>react.svg</dd>
          </div>
          <div>
            <dt>Clicks</dt>
            <dd>{{ clickCount }}</dd>
          </div>
        </dl>
      </div>

      <div class="demo-card" :class="{ 'is-paused': !isOrbiting }">
        <div class="demo-card__shine" />
        <button
          class="atom-scene"
          type="button"
          aria-label="Interactive React SVG logo converted to Vue"
          @click="clickCount++"
        >
          <svg
            class="react-logo"
            :class="{ 'is-orbiting': isOrbiting }"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="256"
            height="228"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 256 228"
          >
            <path
              fill="currentColor"
              d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"
            />
          </svg>

          <span class="atom-pulse" />
        </button>

        <div class="demo-card__caption">
          <strong>Interactive SVG</strong>
          <span>Click the atom to update Vue state.</span>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const isOrbiting = ref(true)
const clickCount = ref(0)

const toggleOrbit = () => {
  isOrbiting.value = !isOrbiting.value
}

const resetCounter = () => {
  clickCount.value = 0
}

definePageMeta({
  path: '/demo'
})

useHead({
  title: 'Binex Demo | Vue SVG Conversion',
  meta: [
    {
      name: 'description',
      content: 'A Vue/Nuxt demo page converted from the r3f animated book slider React SVG asset.'
    }
  ]
})
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  overflow: hidden;
  color: #f8fafc;
  background:
    radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.28), transparent 32rem),
    radial-gradient(circle at 80% 10%, rgba(124, 58, 237, 0.24), transparent 30rem),
    linear-gradient(135deg, #020617 0%, #0f172a 54%, #111827 100%);
}

.demo-hero {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
  width: min(1180px, calc(100% - 2rem));
  min-height: 100vh;
  margin: 0 auto;
  padding: clamp(4rem, 8vw, 7rem) 0;
}

.demo-glow {
  position: absolute;
  z-index: -1;
  width: 18rem;
  height: 18rem;
  border-radius: 999px;
  filter: blur(28px);
  opacity: 0.32;
}

.demo-glow--blue {
  top: 18%;
  left: -8%;
  background: #38bdf8;
}

.demo-glow--violet {
  right: -6%;
  bottom: 14%;
  background: #8b5cf6;
}

.demo-copy {
  max-width: 660px;
}

.demo-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 1.25rem;
  color: #67e8f9;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.demo-eyebrow::before {
  width: 0.7rem;
  height: 0.7rem;
  content: '';
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 28px currentColor;
}

.demo-copy h1 {
  margin: 0;
  font-size: clamp(2.65rem, 6vw, 5.75rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.075em;
}

.demo-description {
  max-width: 56ch;
  margin: 1.5rem 0 0;
  color: rgba(226, 232, 240, 0.78);
  font-size: clamp(1rem, 2vw, 1.16rem);
  line-height: 1.8;
}

.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 2rem;
}

.demo-button {
  border: 0;
  border-radius: 999px;
  padding: 0.9rem 1.35rem;
  color: #020617;
  background: #67e8f9;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(103, 232, 249, 0.22);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}

.demo-button:hover {
  transform: translateY(-2px);
  background: #a5f3fc;
  box-shadow: 0 22px 48px rgba(103, 232, 249, 0.32);
}

.demo-button--ghost {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
}

.demo-button--ghost:hover {
  background: rgba(255, 255, 255, 0.16);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
}

.demo-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  max-width: 620px;
  margin: 2.25rem 0 0;
}

.demo-stats div {
  padding: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1.25rem;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(16px);
}

.demo-stats dt {
  color: rgba(148, 163, 184, 0.88);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.demo-stats dd {
  margin: 0.35rem 0 0;
  font-size: 1.05rem;
  font-weight: 800;
}

.demo-card {
  position: relative;
  display: grid;
  place-items: center;
  min-height: min(78vh, 640px);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: clamp(2rem, 5vw, 3.5rem);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05)),
    rgba(15, 23, 42, 0.62);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 40px 120px rgba(2, 6, 23, 0.42);
  backdrop-filter: blur(24px);
}

.demo-card__shine {
  position: absolute;
  inset: 1px;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.demo-card__shine::before {
  position: absolute;
  top: -30%;
  left: -55%;
  width: 70%;
  height: 150%;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16), transparent);
  transform: rotate(18deg);
  animation: shine 6s ease-in-out infinite;
}

.atom-scene {
  position: relative;
  display: grid;
  place-items: center;
  width: min(72vw, 360px);
  aspect-ratio: 1;
  border: 0;
  border-radius: 999px;
  color: #61dafb;
  background:
    radial-gradient(circle, rgba(97, 218, 251, 0.2) 0 26%, transparent 27%),
    radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent 65%);
  cursor: pointer;
}

.react-logo {
  position: relative;
  z-index: 1;
  width: min(62vw, 300px);
  height: auto;
  color: #61dafb;
  filter:
    drop-shadow(0 0 18px rgba(97, 218, 251, 0.48))
    drop-shadow(0 0 56px rgba(97, 218, 251, 0.22));
  transition: transform 280ms ease;
}

.react-logo.is-orbiting {
  animation: orbit 13s linear infinite;
}

.atom-scene:hover .react-logo {
  transform: scale(1.045);
}

.atom-pulse {
  position: absolute;
  inset: 10%;
  border: 1px solid rgba(97, 218, 251, 0.32);
  border-radius: 999px;
  animation: pulse 2.8s ease-in-out infinite;
}

.demo-card.is-paused .atom-pulse,
.demo-card.is-paused .demo-card__shine::before {
  animation-play-state: paused;
}

.demo-card__caption {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  left: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1.2rem;
  color: rgba(226, 232, 240, 0.76);
  background: rgba(2, 6, 23, 0.42);
  backdrop-filter: blur(14px);
}

.demo-card__caption strong {
  color: #fff;
}

@keyframes orbit {
  to {
    rotate: 360deg;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.28;
    transform: scale(0.92);
  }

  50% {
    opacity: 0.72;
    transform: scale(1.04);
  }
}

@keyframes shine {
  0%,
  42% {
    transform: translateX(0) rotate(18deg);
  }

  72%,
  100% {
    transform: translateX(260%) rotate(18deg);
  }
}

@media (max-width: 900px) {
  .demo-hero {
    grid-template-columns: 1fr;
  }

  .demo-card {
    min-height: 520px;
  }
}

@media (max-width: 640px) {
  .demo-stats {
    grid-template-columns: 1fr;
  }

  .demo-card {
    min-height: 430px;
  }

  .demo-card__caption {
    flex-direction: column;
  }
}
</style>