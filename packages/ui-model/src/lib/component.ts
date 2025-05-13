import type { DeclPropDefinition, DeclType, DeclValue } from "@declaratypel/ast"

export const COMPONENT = "component"

export type DeclComponent = {
  uiTag: typeof COMPONENT
  name: string
  description?: string
  props: DeclPropDefinition[]
  return: DeclType
  body: DeclValue
}
