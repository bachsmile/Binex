<script setup lang="ts">
const search = defineModel<string>('search', { default: '' });
const role = defineModel<string>('role', { default: '' });
const dateRange = defineModel<string>('dateRange', { default: '' });
const department = defineModel<string>('department', { default: '' });
const status = defineModel<string>('status', { default: '' });

const emit = defineEmits<{
  (e: 'export'): void;
  (e: 'clear'): void;
}>();
</script>

<template>
  <CiFilter 
    v-model:search="search"
    v-model:role="role"
    v-model:dateRange="dateRange"
    v-model:department="department"
    v-model:status="status"
    @export="emit('export')"
    @clear="emit('clear')"
  />
</template>
