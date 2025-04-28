import { DeclPrimitiveValue, DeclValue } from "../ast/literalValues"
import { DeclExpression } from "../ast/sourceExpressions"
import { DeclType, DeclPropDefinition } from "../ast/typeExpressions"

export const ELEMENT = "element"
export const COMPONENT = "component"

export type DeclUITag = typeof ELEMENT | typeof COMPONENT

export type DeclUITemplateNativeElement = {
  uiTag: typeof ELEMENT
  name: string
  attrs: Record<string, DeclPrimitiveValue>
  children: DeclUITemplate
}

export type DeclUIComponentPropExpression = DeclExpression | DeclUITemplateComponentElement

export type DeclUITemplateComponentElement = {
  uiTag: typeof COMPONENT
  component: DeclComponent
  props: Record<string, DeclUIComponentPropExpression>
  children: DeclUITemplate
}

export type DeclUITemplateElement = DeclUITemplateNativeElement | DeclUITemplateComponentElement

export type DeclUITemplate = DeclUITemplateElement | DeclUITemplateElement[] | DeclPrimitiveValue

export type DeclComponent = {
  tag: "ui"
  name: string
  description?: string
  props: DeclPropDefinition[]
  return: DeclType
  body: DeclValue
}

export type DeclUIRule = {
  tag: "uirule"
  selector: string
  type: DeclType
  editor: DeclUITemplateElement
}
