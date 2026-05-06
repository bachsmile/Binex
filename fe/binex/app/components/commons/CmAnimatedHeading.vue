<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  initialDelay?: number
  charDelay?: number
  transitionDuration?: number
}>(), {
  initialDelay: 200,
  charDelay: 30,
  transitionDuration: 500,
})

const animationStarted = ref(false)

// Split text into lines
const lines = computed(() => props.text.split('\n'))

// Split a line into words (preserving spaces as part of word grouping)
function getWords(line: string): string[] {
  return line.split(/(\s+)/)
}

// Calculate the global character index for delay calculation
function getGlobalCharIndex(lineIndex: number, localCharIndex: number): number {
  let total = 0
  for (let i = 0; i < lineIndex; i++) {
    total += lines.value[i].length
  }
  return total + localCharIndex
}

function getCharDelay(globalIndex: number): number {
  return props.initialDelay + globalIndex * props.charDelay
}

onMounted(() => {
  setTimeout(() => {
    animationStarted.value = true
  }, props.initialDelay)
})
</script>

<template>
  <span>
    <span v-for="(line, lineIndex) in lines" :key="lineIndex">
      <span
        v-for="(word, wordIndex) in getWords(line)"
        :key="`w-${lineIndex}-${wordIndex}`"
        class="inline-block whitespace-nowrap"
      >
        <span
          v-for="(char, charIndex) in word.split('')"
          :key="`c-${lineIndex}-${wordIndex}-${charIndex}`"
          class="inline-block"
          :style="{
            opacity: animationStarted ? 1 : 0,
            transform: animationStarted ? 'translateX(0)' : 'translateX(-18px)',
            transitionProperty: 'opacity, transform',
            transitionDuration: `${transitionDuration}ms`,
            transitionDelay: `${getCharDelay(
              getGlobalCharIndex(lineIndex, word.split('').slice(0, charIndex).join('').length + line.split(/(\s+)/).slice(0, wordIndex).join('').length)
            )}ms`,
          }"
        >{{ char === ' ' ? '\u00A0' : char }}</span>
      </span>
      <br v-if="lineIndex < lines.length - 1" />
    </span>
  </span>
</template>
