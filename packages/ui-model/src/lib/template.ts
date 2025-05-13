import { DeclPrimitiveValue } from "@declaratypel/ast"
import { DeclExpression } from "@declaratypel/ast"
import type { DeclComponent } from "./component.ts"

export const NATIVE_ELEMENT = "nativeElement"
export const COMPONENT_ELEMENT = "componentElement"

export type DeclUITag = typeof NATIVE_ELEMENT | typeof COMPONENT_ELEMENT

export type DeclUITemplateNativeElement = {
  uiTag: typeof NATIVE_ELEMENT
  name: string
  attrs: Record<string, DeclPrimitiveValue>
  children: DeclUITemplate
}

export type DeclUIComponentPropExpression =
  | DeclExpression
  | DeclUITemplateComponentElement

export type DeclUITemplateComponentElement = {
  uiTag: typeof COMPONENT_ELEMENT
  component: DeclComponent
  props: Record<string, DeclUIComponentPropExpression>
  children: DeclUITemplate
}

export type DeclUITemplateElement =
  | DeclUITemplateNativeElement
  | DeclUITemplateComponentElement

export type DeclUITemplate =
  | DeclUITemplateElement
  | DeclPrimitiveValue
  | DeclUITemplate[]
