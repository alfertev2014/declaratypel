<script setup lang="ts">
import { ref } from 'vue';
import StructureNode from './StructureNode.vue';
import PropValueShort from './PropValueShort.vue';
import type { DeclUITemplateComponentElement } from '@/types/ui/template';
import TemplateStructure from './TemplateStructure.vue';

const { component } = defineProps<{ component: DeclUITemplateComponentElement }>()

const expanded = ref<boolean>(false)
</script>

<template>
  <StructureNode v-model:expanded="expanded">
    <template #header>
      <span class="header">
        {{component.name}}
        <template v-for="(value, name) in component.props" :key="name">
          <span>
            {{name}}=<PropValueShort :value />
          </span>{{' '}}
      </template>
      </span>
    </template>
    <template #default>
      <TemplateStructure :template="component.children" />
    </template>
  </StructureNode>
</template>

<style scoped>
.header {
  color: green;
}
</style>