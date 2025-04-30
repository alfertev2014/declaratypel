import { DeclPrimitiveValue } from "./literalValues"
import { DeclType } from "./typeExpressions"

export const UNARY = "unary"
export const BINARY = "binary"
export const TERNARY = "if"
export const LITERAL = "literal"
export const ELLIPSIS = "ellipsis"
export const PROPERTY = "property"
export const INDEXER = "indexer"
export const LAMBDA = "lambda"
export const CALL = "call"
export const OBJECT_TEMPLATE = "obj"
export const ARRAY_TEMPLATE = "arr"
export const VAR_DEFINITION = "var"
export const OBJECT_DESTRUCT = "objDestruct"
export const ARRAY_DESTRUCT = "arrDestruct"
export const SCOPE = "scope"
export const TYPE_SCOPE = "typeScope"
export const IDENTIFIER = "identifier"
export const AS = "as"

export type DeclUnaryOperator = "+" | "-" | "!" | "~" | "typeof"

export type DeclUnaryExpression = {
  readonly tag: typeof UNARY
  readonly name: DeclUnaryOperator
  readonly body: DeclExpression
}
export const unary = (name: DeclUnaryOperator, body: DeclExpression): DeclUnaryExpression => ({
  tag: UNARY,
  name,
  body,
})

export type DeclBinaryOperator =
  | "+"
  | "-"
  | "*"
  | "/"
  | "**"
  | "<<"
  | ">>"
  | ">>>"
  | "."
  | "[]"
  | "&"
  | "|"
  | "&&"
  | "||"
  | "??"
  | "<"
  | ">"
  | "<="
  | ">="
  | "=="
  | "!="
  | "==="
  | "!=="

export type DeclBinaryExpression = {
  readonly tag: typeof BINARY
  readonly left: DeclExpression
  readonly name: DeclBinaryOperator
  readonly right: DeclExpression
}
export const binary = (
  left: DeclExpression,
  name: DeclBinaryOperator,
  right: DeclExpression,
): DeclBinaryExpression => ({
  tag: BINARY,
  left,
  name,
  right,
})

export type DeclTernaryExpression = {
  readonly tag: typeof TERNARY
  readonly condition: DeclExpression
  readonly trueBranch: DeclExpression
  readonly falseBranch: DeclExpression
}
export const ternary = (
  condition: DeclExpression,
  trueBranch: DeclExpression,
  falseBranch: DeclExpression,
): DeclTernaryExpression => ({
  tag: TERNARY,
  condition,
  trueBranch,
  falseBranch,
})

export type DeclLiteral = {
  readonly tag: typeof LITERAL
  readonly value: DeclPrimitiveValue
}
export const literal = (value: DeclPrimitiveValue): DeclLiteral => ({
  tag: LITERAL,
  value,
})

export type DeclEllipsisExpression = {
  readonly tag: typeof ELLIPSIS
  readonly body: DeclExpression
}
export const ellipsis = (body: DeclExpression): DeclEllipsisExpression => ({
  tag: ELLIPSIS,
  body,
})

export type DeclCallExpression = {
  readonly tag: typeof CALL
  readonly func: DeclExpression
  readonly args: readonly (DeclExpression | DeclEllipsisExpression)[]
}
export const call = (
  func: DeclExpression,
  args: readonly (DeclExpression | DeclEllipsisExpression)[],
): DeclCallExpression => ({
  tag: CALL,
  func,
  args,
})

export type DeclArray = {
  readonly tag: typeof ARRAY_TEMPLATE
  readonly items: readonly (DeclExpression | DeclEllipsisExpression)[]
}
export const arr = (items: readonly (DeclExpression | DeclEllipsisExpression)[]): DeclArray => ({
  tag: ARRAY_TEMPLATE,
  items,
})

export type DeclKeyValue = {
  readonly tag: typeof PROPERTY
  readonly key: string | number
  readonly value: DeclExpression
}

export type DeclIndexValue = {
  readonly tag: typeof INDEXER
  readonly index: DeclExpression
  readonly value: DeclExpression
}

export type DeclObjectItem = DeclKeyValue | DeclIndexValue | DeclEllipsisExpression

export type DeclObject = {
  readonly tag: typeof OBJECT_TEMPLATE
  readonly items: readonly DeclObjectItem[]
}
export const obj = (
  items: readonly DeclObjectItem[],
): DeclObject => ({
  tag: OBJECT_TEMPLATE,
  items,
})

export type DeclVarDefinition = {
  readonly tag: typeof VAR_DEFINITION
  readonly name: DeclIdentifier
  readonly value?: DeclExpression
  readonly optional?: boolean
}
export const defVar = (name: DeclIdentifier, value?: DeclExpression): DeclVarDefinition => ({
  tag: VAR_DEFINITION,
  name,
  value,
})

export type DeclObjectDestruct = {
  readonly tag: typeof OBJECT_DESTRUCT
  readonly props: readonly DeclDestruct[]
  readonly rest?: DeclIdentifier
  readonly value?: DeclExpression
}
export const defObj = (
  props: readonly DeclDestruct[],
  rest?: DeclIdentifier,
  value?: DeclExpression,
): DeclObjectDestruct => ({
  tag: OBJECT_DESTRUCT,
  props,
  rest,
  value,
})

export type DeclArrayDestruct = {
  readonly tag: typeof ARRAY_DESTRUCT
  readonly items: readonly DeclDestruct[]
  readonly rest?: DeclIdentifier
  readonly value?: DeclExpression
}
export const defArr = (
  items: readonly DeclDestruct[],
  rest?: DeclIdentifier,
  value?: DeclExpression,
): DeclArrayDestruct => ({
  tag: ARRAY_DESTRUCT,
  items,
  rest,
  value,
})

export type DeclDestruct = DeclVarDefinition | DeclObjectDestruct | DeclArrayDestruct

export type DeclDefinition = {
  readonly pattern: DeclDestruct
  readonly description?: string
  readonly type?: DeclType
}

export type DeclLambdaExpression = {
  readonly tag: typeof LAMBDA
  readonly args: readonly DeclDefinition[]
  readonly body: DeclExpression
  readonly resultType?: DeclType
  readonly rest?: DeclVarDefinition | DeclArrayDestruct
  readonly restType?: DeclType
}
export const lambda = (
  args: readonly DeclDefinition[],
  body: DeclExpression,
  resultType?: DeclType,
  rest?: DeclVarDefinition | DeclArrayDestruct,
  restType?: DeclType,
): DeclLambdaExpression => ({
  tag: LAMBDA,
  args,
  body,
  resultType,
  rest,
  restType,
})

export type DeclScope = {
  readonly tag: typeof SCOPE
  readonly def: readonly DeclDefinition[]
  readonly body: DeclExpression
  readonly mutable: boolean
}
export const scope = (
  def: readonly DeclDefinition[],
  body: DeclExpression,
  mutable: boolean = false,
): DeclScope => ({
  tag: SCOPE,
  def,
  body,
  mutable,
})

export type DeclTypeDefinition = {
  readonly name: string
  readonly description?: string
  readonly value: DeclType
}

export type DeclTypeScope = {
  readonly tag: typeof TYPE_SCOPE
  readonly def: readonly DeclTypeDefinition[]
  readonly body: DeclExpression
}
export const typeScope = (def: readonly DeclTypeDefinition[], body: DeclExpression): DeclTypeScope => ({
  tag: TYPE_SCOPE,
  def,
  body,
})

export type DeclIdentifier = {
  readonly tag: typeof IDENTIFIER
  readonly name: string
}
export const id = (name: string): DeclIdentifier => ({
  tag: IDENTIFIER,
  name,
})

export type DeclTypeAnnotation = {
  readonly tag: typeof AS
  readonly body: DeclExpression
  readonly type: DeclType
}
export const cast = (body: DeclExpression, type: DeclType): DeclTypeAnnotation => ({
  tag: AS,
  body,
  type,
})

export type DeclExpression =
  | DeclLiteral
  | DeclIdentifier
  | DeclUnaryExpression
  | DeclBinaryExpression
  | DeclTernaryExpression
  | DeclArray
  | DeclObject
  | DeclLambdaExpression
  | DeclScope
  | DeclTypeAnnotation
