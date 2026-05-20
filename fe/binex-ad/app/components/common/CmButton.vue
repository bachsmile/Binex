<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconOnly?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
});

const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 outline-none select-none active:scale-97 disabled:opacity-50 disabled:pointer-events-none rounded-full';

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20',
  secondary: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
  outline: 'bg-transparent border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800/50',
  ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
  danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20',
};

const sizeClasses = {
  sm: 'text-xs px-3.5 py-1.5 gap-1.5',
  md: 'text-sm px-5 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2.5',
};

const iconOnlySizeClasses = {
  sm: 'p-1.5 aspect-square w-8 h-8',
  md: 'p-2.5 aspect-square w-10 h-10',
  lg: 'p-3 aspect-square w-12 h-12',
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      baseClasses,
      variantClasses[variant],
      iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size]
    ]"
  >
    <Icon v-if="loading" name="svg-spinners:ring-resize" class="animate-spin text-lg" />
    <template v-else>
      <Icon v-if="icon" :name="icon" :class="iconOnly ? 'text-lg' : 'text-base'" />
      <slot v-if="!iconOnly"></slot>
    </template>
  </button>
</template>
