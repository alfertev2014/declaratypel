<script setup lang="ts">
import type { DeclUITemplate } from './types/ui/template';
import TemplateStructure from './ui/Structure/components/TemplateStructure.vue';

const template: DeclUITemplate =  [
  {
    uiTag: 'NativeElement',
    name: 'div',
    attrs: {
      foo: 'bar'
    },
    children: [
      {
        uiTag: 'NativeElement',
        name: 'div',
        attrs: {
          foo: 'bar'
        },
      },
      {
        uiTag: 'NativeElement',
        name: 'p',
        attrs: {
          class: 'top'
        },
      },
      undefined,
      {
        uiTag: 'ComponentElement',
        name: "Comp",
        props: {
          foo: "bar",
          baz: "fpck"
        },
        children: [
          {
            uiTag: 'NativeElement',
            name: 'p',
            attrs: {
              class: 'top'
            },
          },
        ]
      }
    ]
  },
  false,
  "fucken shittt!!!",
  {
    uiTag: 'ComponentElement',
    name: "Comp",
    props: {
      foo: "bar",
      baz: "fpck"
    },
    children: [
      {
        uiTag: 'NativeElement',
        name: 'p',
        attrs: {
          class: 'top',
          foo: "bar",
          baz: "fpck"
        },
      },
      null,
      {
        uiTag: 'ComponentElement',
        name: "Comp",
        props: {
          foo: "bar",
          baz: "fpck"
        },
        children: [
          {
            uiTag: 'NativeElement',
            name: 'p',
            attrs: {
              class: 'top'
            },
          },
        ]
      }
    ]
  },
  100500
]

</script>

<template>
  <TemplateStructure :template="template" />
</template>

<style scoped>

</style>
