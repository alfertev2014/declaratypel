<script setup lang="ts">
import { computed } from 'vue';

const { value } = defineProps<{ value: unknown }>()

const valueString = computed<string>(() => {
  if (typeof value === 'string') {
    return value
  }else if (value == null || typeof value === 'boolean' || typeof value === 'number') {
    return `${value}`
  } else if (typeof value === 'function') {
    return `f ${value.name || ''}(...){...}`
  } else if (Array.isArray(value)) {
    return value.length ? `[...${value.length} items]` : '[]'
  } else if (typeof value === 'object') {
    return '{...}'
  }
  return `${value}`
})

</script>

<template>
  <span class="value">{{ valueString }}</span>
</template>

<style scoped>
.value {
  color: red;
}
</style>
