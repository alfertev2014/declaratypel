<script setup lang="ts">
import { type Slot } from 'vue'

defineSlots<{ header: Slot, default: Slot }>()
const expanded = defineModel<boolean>('expanded')

</script>

<template>
  <div>
    <div @click="expanded = !expanded">
      <slot name="header"></slot>
    </div>
    <div v-if="expanded" class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding-left: 1em;
}
</style>
