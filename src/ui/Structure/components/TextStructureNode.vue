<script setup lang="ts">
const { text } = defineProps<{ text: string }>()
</script>

<template>
  <div><p class="text">"{{text}}"</p></div>
</template>

<style scoped>
.text {
  color: blue;
  line-height: 1em;
  margin: 0;
}
</style>