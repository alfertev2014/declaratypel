import type {
  DeclArgDefinition,
  DeclEllipsisExpression,
  DeclPropDefinition,
  DeclType,
  DeclIdentifier,
  DeclImport,
  DeclLambdaExpression,
  DeclExpression
} from "@declaratypel/ast"

export const COMPONENT = "component"
export const NATIVE_ELEMENT = "nativeElement"
export const COMPONENT_ELEMENT = "componentElement"
export const STATE = "state"
export const CURRENT_STATE = "current"
export const LIFECYCLE = "lifecycle"
export const NATIVE_EFFECT = "nativeEffect"
export const REACTIVE_EFFECT = "reactiveEffect"
export const UI_SCOPE = "uiScope"
export const UI_TYPEDEF = "uiTypeDef"
export const PURE_FUNCTION = "pureFunction"
export const ACTION = "action"
export const COMPONENT_DEF = "componentDefinition"
export const UI_EXPORT = "uiExport"
export const UI_MODULE = "uiModule"

export type NativeEffect = {
  readonly uiTag: typeof NATIVE_EFFECT
  readonly name: string
  readonly args: readonly (DeclExpression | DeclEllipsisExpression)[]
  readonly description?: string
}

export type DeclUITemplateNativeElement = {
  readonly uiTag: typeof NATIVE_ELEMENT
  readonly name: string
  readonly attrs: Record<string, DeclExpression>
  readonly props: Record<string, DeclExpression>
  readonly effects: NativeEffect[]
  readonly children?: DeclUITemplate
  readonly description?: string
}

export type DeclUIComponentPropExpression =
  | DeclExpression
  | DeclUITemplateComponentElement

export type DeclUITemplateComponentElement = {
  readonly uiTag: typeof COMPONENT_ELEMENT
  readonly component: DeclUIComponent
  readonly props: Record<string, DeclUIComponentPropExpression>
  readonly children: DeclUITemplate
  readonly description?: string
}

export type DeclUITemplateElement =
  | DeclUITemplateNativeElement
  | DeclUITemplateComponentElement

export type DeclUIState = {
  readonly uiTag: typeof STATE
  readonly name: string
  readonly type: DeclType
  readonly initializer: DeclExpression
  readonly description?: string
}

export type DeclUILifecycle = {
  readonly uiTag: typeof LIFECYCLE
  readonly mount: DeclLambdaExpression
  readonly unmount: DeclLambdaExpression
  readonly description?: string
}

export type DeclUITypeDefinition = {
  readonly uiTag: typeof UI_TYPEDEF
  readonly type: DeclType
  readonly description?: string
}

export type DeclUIPureFunction = {
  readonly uiTag: typeof PURE_FUNCTION
  readonly value: DeclLambdaExpression | DeclIdentifier
  readonly type?: DeclType
  readonly description?: string
}

export type DeclUIAction = {
  readonly uiTag: typeof ACTION
  readonly value: DeclLambdaExpression | DeclIdentifier
  readonly type?: DeclType
  readonly description?: string
}

export type DeclUIDefinition = {
  readonly name: string
  readonly value: DeclUIState | DeclUIPureFunction | DeclUIAction | DeclUITypeDefinition
  readonly description?: string
}

export type DeclUIScope = {
  readonly uiTag: typeof UI_SCOPE
  readonly defs: readonly DeclUIDefinition[]
  readonly lifecycles?: readonly DeclUILifecycle[]
  readonly body: DeclUITemplate
}

export type DeclUITemplate =
  | DeclUITemplateElement
  | DeclUIScope
  | readonly DeclUITemplate[]

export type DeclActionDefinition = {
  readonly name: string
  readonly args: readonly DeclArgDefinition[]
  readonly description?: string
}

export type DeclSlotDefinition = {
  readonly name: string
  readonly component: DeclUIComponentArgs
  readonly description?: string
}

export type DeclUIComponentArgs = {
  readonly props: readonly DeclPropDefinition[]
  readonly actions: readonly DeclActionDefinition[]
  readonly slots: readonly DeclSlotDefinition[]
}

export type DeclUIComponent = {
  readonly uiTag: typeof COMPONENT
  readonly args: DeclUIComponentArgs
  readonly body: DeclUITemplate
  readonly description?: string
}

export type DeclUIExport = {
  readonly uiTag: typeof UI_EXPORT
  readonly def: DeclUIDefinition
}
export const uiExport = (def: DeclUIDefinition): DeclUIExport => ({
  uiTag: UI_EXPORT,
  def,
})

export type DeclUIModule = {
  readonly uiTag: typeof UI_MODULE
  readonly imports: readonly DeclImport[]
  readonly definitions: readonly (DeclUIExport | DeclUIDefinition)[]
  readonly description?: string
}
export const uiModule = (
  imports: readonly DeclImport[],
  definitions: readonly (DeclUIExport | DeclUIDefinition)[],
  description?: string
): DeclUIModule => ({
  uiTag: UI_MODULE,
  imports,
  definitions,
  description
})