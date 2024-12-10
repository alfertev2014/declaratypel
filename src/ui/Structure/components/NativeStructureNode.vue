<script setup lang="ts">
import { ref } from 'vue';
import StructureNode from './StructureNode.vue';
import type { DeclUITemplateNativeElement } from '@/types/ui/template';
import PropValueShort from './PropValueShort.vue';

const { element } = defineProps<{
  element: DeclUITemplateNativeElement
}>();

const expanded = ref(false)
</script>

<template>
  <StructureNode v-model:expanded="expanded">
    <template #header>
      <span>
        &lt;{{element.name}}
        <template v-for="(value, name) in element.attrs" :key="name">
          <span>
            {{name}}=<PropValueShort :value />
          </span>{{' '}}
        </template>
        {{!expanded ? ".../" : element.children == null ? "/" : ''}}&gt;
      </span>
    </template>
    <template #default>
      <TemplateStructure :template="element.children" />
    </template>
  </StructureNode>
</template>