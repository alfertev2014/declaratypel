import type { DeclPrimitiveValue } from '../value'
import type { DeclType, DeclVarDefinition } from '../ast/pureflang'

export type DeclComponent = {
  tag: 'ui'
  name: string
  description?: string
  props: DeclVarDefinition[]
  return: DeclType
  body: DeclUITemplate
}

export type DeclUITemplateNativeElement = {
  uiTag: 'NativeElement'
  name: string
  attrs: Record<string, DeclPrimitiveValue>
  children?: DeclUITemplate
}

export type DeclUIComponentPropExpression = DeclPrimitiveValue | DeclUITemplateComponentElement

export type DeclUITemplateComponentElement = {
  uiTag: 'ComponentElement'
  name: string
  props: Record<string, DeclUIComponentPropExpression>
  children?: DeclUITemplate
}

export type DeclUITemplateElement = DeclUITemplateNativeElement | DeclUITemplateComponentElement

export type DeclUITemplate = DeclPrimitiveValue | DeclUITemplateElement | DeclUITemplate[]
