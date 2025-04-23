export const STRING = "string"
export const NUMBER = "number"
export const BOOLEAN = "boolean"
export const NULL = "null"
export const UNDEFINED = "undefined"
export const UNKNOWN = "unknown"
export const NEVER = "never"

export type DeclBuiltinType =
  | typeof STRING
  | typeof NUMBER
  | typeof BOOLEAN
  | typeof NULL
  | typeof UNDEFINED
  | typeof UNKNOWN
  | typeof NEVER

export const OBJECT = "object"
export const ARRAY = "array"
export const TUPLE = "tuple"
export const TAGGED = "tagged"
export const UNION = "union"
export const INTERSECTION = "intersection"
export const GENERIC = "generic"
export const TYPE_IDENTIFIER = "identifier"

export type DeclTypeCtor =
  | typeof OBJECT
  | typeof ARRAY
  | typeof TAGGED
  | typeof UNION
  | typeof INTERSECTION
  | typeof GENERIC
  | typeof TYPE_IDENTIFIER

export interface DeclCompoundType {
  tctor: DeclTypeCtor
}

export type DeclVarDefinition = {
  name: string
  description?: string
  type: DeclType
}

export type DeclObjectType = {
  tctor: typeof OBJECT
  props: DeclVarDefinition[]
}

export type DeclArrayType = {
  tctor: typeof ARRAY
  items: DeclType
}

export type DeclTaggedType = {
  tctor: typeof TAGGED
  tag: string
  body: DeclType
}

export type DeclUnionType = {
  tctor: typeof UNION
  args: DeclType[]
}

export type DeclIntersectionType = {
  tctor: typeof INTERSECTION
  args: DeclType[]
}

export type DeclTypeVarDefinition = {
  name: string
  upperBound?: DeclType
  lowerBound?: DeclType
}

export type DeclGenericType = {
  tctor: typeof GENERIC
  targs: DeclTypeVarDefinition[]
  body: DeclType
}

export type DeclTypeIdentifier = {
  tctor: typeof TYPE_IDENTIFIER
  name: string
  args?: DeclType[]
}

export type DeclType = DeclBuiltinType | DeclCompoundType
