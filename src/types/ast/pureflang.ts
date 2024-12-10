// Type expressions

import type { DeclPrimitiveValue } from "../value";

export type DeclBuiltinType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

export type DeclTypeCtor = 'struct'| 'array' | 'function' |'tagged' | 'union' | 'intersection' | 'generic' | 'name'

export interface DeclCompoundType {
  tctor: DeclTypeCtor;
}

export type DeclVarDefinition = {
  name: string;
  description?: string;
  type: DeclType;
}

export type DeclStructType = {
  tctor: 'struct';
  props: DeclVarDefinition[];
}

export type DeclArrayType = {
  tctor: 'array';
  items: DeclType;
}

export type DeclFunctionType = {
  tctor: 'function';
  args: DeclVarDefinition[];
  result: DeclType;
}

export type DeclTaggedType = {
  tctor: 'tagged';
  tag: string;
  body: DeclType;
}

export type DeclUnionType = {
  tctor: 'union';
  args: DeclType[];
}

export type DeclIntersectionType = {
  tctor: 'intersection';
  args: DeclType[];
}

export type DeclTypeVarDefinition = {
  name: string;
  description?: string;
  upperBound?: DeclType;
  lowerBound?: DeclType;
}

export type DeclGenericType = {
  tctor: 'generic';
  targs: DeclTypeVarDefinition[];
  body: DeclType;
}

export type DeclNameRefType = {
  tctor: 'name';
  name: string;
  args?: DeclType[];
}

export type DeclType = DeclBuiltinType | DeclCompoundType;

export type DeclASTTag = 'tagged' | 'literal' | 'lambda' | 'let' | 'typedef' | 'name' | 'as'

// Abstract syntax trees of sources (serializable to JSON)

export type DeclTaggedExpression = {
  tag: 'tagged';
  name: string;
  body: DeclExpression;
}

export type DeclLiteral = {
  tag: 'literal';
  value: DeclPrimitiveValue | Array<DeclExpression> | Record<string, DeclExpression>;
  type?: DeclType;
}

export type DeclLambdaExpression = {
  tag: 'lambda';
  args: DeclVarDefinition[];
  body: DeclExpression;
}

export type DeclLetDefinition = {
  name: string;
  description?: string;
  value: DeclExpression;
  type?: DeclType;
}

export type DeclLet = {
  tag: 'let';
  let: DeclLetDefinition[];
  in: DeclExpression;
}

export type DeclTypeDefinition = {
  name: string;
  description?: string;
  value: DeclType;
}

export type DeclTypeDef = {
  tag: 'typedef';
  typedef: DeclTypeDefinition[];
  in: DeclExpression;
}

export type DeclNameReference = {
  tag: 'name';
  name: string;
  args?: DeclExpression;
}

export type DeclTypeAssertion = {
  tag: 'as';
  body: DeclExpression;
  type: DeclType;
}

export type DeclExpression = DeclLiteral | DeclTaggedExpression | DeclLambdaExpression | DeclLet | DeclTypeAssertion;
