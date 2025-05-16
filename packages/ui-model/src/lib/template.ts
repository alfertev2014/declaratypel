import {
  DeclArgDefinition,
  DeclEllipsisExpression,
  DeclPrimitiveValue,
  DeclPropDefinition,
  DeclType,
  DeclValue,
} from "@declaratypel/ast"
import { DeclExpression } from "@declaratypel/ast"

export const COMPONENT = "component"
export const NATIVE_ELEMENT = "nativeElement"
export const COMPONENT_ELEMENT = "componentElement"
export const STATE = "state"
export const CURRENT_STATE = "current"
export const LIFECYCLE = "lifecycle"
export const NATIVE_EFFECT = "nativeEffect"
export const REACTIVE_EFFECT = "reactiveEffect"

export type NativeEffect = {
  readonly uiTag: typeof NATIVE_EFFECT
  readonly name: string
  readonly args: readonly (DeclExpression | DeclEllipsisExpression)[]
  readonly description?: string
}

export type DeclUITemplateNativeElement = {
  readonly uiTag: typeof NATIVE_ELEMENT
  readonly name: string
  readonly attrs: Record<string, DeclPrimitiveValue>
  readonly effects: NativeEffect[]
  readonly children?: DeclUITemplate
}

export type DeclUIComponentPropExpression =
  | DeclExpression
  | DeclUITemplateComponentElement

export type DeclUITemplateComponentElement = {
  readonly uiTag: typeof COMPONENT_ELEMENT
  readonly component: DeclComponent
  readonly props: Record<string, DeclUIComponentPropExpression>
  readonly children: DeclUITemplate
}

export type DeclUITemplateElement =
  | DeclUITemplateNativeElement
  | DeclUITemplateComponentElement

export type DeclUITemplate =
  | DeclUITemplateElement
  | DeclPrimitiveValue
  | DeclUITemplate[]

export type DeclUIState = {
  readonly uiTag: typeof STATE
  readonly name: string
  readonly type: DeclType
  readonly initializer: DeclExpression
  readonly description?: string
}

export type DeclUILifecycle = {
  readonly uiTag: typeof LIFECYCLE
  readonly mount: DeclActionDefinition
  readonly unmount: DeclActionDefinition
}

export type DeclActionDefinition = {
  readonly name: string
  readonly description?: string
  readonly args: readonly DeclArgDefinition[]
}

export type DeclSlotDefinition = {
  readonly name: string
  readonly description?: string
  readonly component: DeclComponent
}

export type DeclComponent = {
  readonly uiTag: typeof COMPONENT
  readonly description?: string
  readonly props: readonly DeclPropDefinition[]
  readonly actions: readonly DeclActionDefinition[]
  readonly slots: readonly DeclSlotDefinition[]
  readonly body: DeclValue
}
