<script setup lang="ts">
import type { DeclUITemplate } from '@/types/ui/template';
import NativeStructureNode from './NativeStructureNode.vue';
import ComponentStructureNode from './ComponentStructureNode.vue';
import TextStructureNode from './TextStructureNode.vue';

const { template } = defineProps<{ template: DeclUITemplate }>()
</script>

<template>
  <template v-if="Array.isArray(template)">
    <TemplateStructure v-for="(item, index) of template" :template="item" :key="index" />
  </template>
  <template v-else-if="typeof template === 'object' && template != null">
    <NativeStructureNode v-if="template.uiTag === 'NativeElement'" :element="template" />
    <ComponentStructureNode v-if="template.uiTag === 'ComponentElement'" :component="template" />
  </template>
  <TextStructureNode v-else-if="template != null && typeof template !== 'boolean'" :text="template.toString()" />
</template>
