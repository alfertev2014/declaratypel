import { DeclPrimitiveValue } from "./literalValues"
import { DeclType, DeclVarDefinition } from "./typeExpressions"

export const UNARY = "unary"
export const BINARY = "binary"
export const LITERAL = "literal"
export const ELLIPSIS = "ellipsis"
export const IF = "if"
export const LAMBDA = "lambda"
export const CALL = "call"
export const OBJECT_TEMPLATE = "obj"
export const ARRAY_TEMPLATE = "arr"
export const SCOPE = "scope"
export const TYPEDEF = "typedef"
export const IDENTIFIER = "identifier"
export const AS = "as"

export type DeclASTTag =
  | typeof UNARY
  | typeof BINARY
  | typeof IF
  | typeof LITERAL
  | typeof ELLIPSIS
  | typeof LAMBDA
  | typeof CALL
  | typeof SCOPE
  | typeof TYPEDEF
  | typeof IDENTIFIER
  | typeof AS

export type DeclUnaryOperator = "+" | "-" | "!" | "~" | "typeof"

export type DeclUnaryExpression = {
  tag: typeof UNARY
  name: DeclUnaryOperator
  body: DeclExpression
}

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
  tag: typeof BINARY
  name: DeclBinaryOperator
  left: DeclExpression
  right: DeclExpression
}

export type DeclIfExpression = {
  tag: typeof IF
  condition: DeclExpression
  left: DeclExpression
  right: DeclExpression
}

export type DeclLiteral = {
  tag: typeof LITERAL
  value: DeclPrimitiveValue
}

export type DeclEllipsisExpression = {
  tag: typeof ELLIPSIS
  body: DeclExpression
}

export type DeclCallExpression = {
  tag: typeof CALL
  args: (DeclExpression | DeclEllipsisExpression)[]
}

export type DeclArray = {
  tag: typeof ARRAY_TEMPLATE
  items: (DeclExpression | DeclEllipsisExpression)[]
}

export type DeclKeyValue = {
  key: string | number
  value: DeclExpression
}

export type DeclIndexValue = {
  index: DeclExpression
  value: DeclExpression
}

export type DeclObject = {
  tag: typeof OBJECT_TEMPLATE
  items: (DeclKeyValue | DeclIndexValue | DeclEllipsisExpression)[]
}

export type DeclLambdaExpression = {
  tag: typeof LAMBDA
  args: DeclVarDefinition[]
  body: DeclExpression
}

export type DeclDefinition = {
  name: string
  description?: string
  value: DeclExpression
  type?: DeclType
}

export type DeclTypeDefinition = {
  name: string
  description?: string
  value: DeclType
}

export type DeclScope = {
  tag: typeof SCOPE
  let: DeclDefinition[]
  in: DeclExpression
}

export type DeclTypeDef = {
  tag: typeof TYPEDEF
  typedef: DeclTypeDefinition[]
  in: DeclExpression
}

export type DeclIdentifier = {
  tag: typeof IDENTIFIER
  name: string
}

export type DeclTypeAnnotation = {
  tag: typeof AS
  body: DeclExpression
  type: DeclType
}

export type DeclExpression =
  | DeclLiteral
  | DeclUnaryExpression
  | DeclBinaryExpression
  | DeclIfExpression
  | DeclLambdaExpression
  | DeclScope
  | DeclTypeAnnotation
