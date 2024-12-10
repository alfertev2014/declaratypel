
// Type expressions

export enum DeclBuiltinType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  NULL = 'null',
  TOP = 'top',
  BOTTOM = 'bottom'
}

export enum DeclTypeCtor {
  STRUCT = 'struct',
  ARRAY = 'array',
  TAGGED = 'tagged',
  UNION = 'union',
  INTERSECTION = 'intersection',
  GENERIC = 'generic',
  NAMEREF = 'nameref'
}

export interface DeclCompoundType {
  tctor: DeclTypeCtor;
}

export type DeclVarDefinition = {
  name: string;
  description?: string;
  type: DeclType;
}

export type DeclStructType = {
  tctor: DeclTypeCtor.STRUCT;
  props: DeclVarDefinition[];
}

export type DeclArrayType = {
  tctor: DeclTypeCtor.ARRAY;
  items: DeclType;
}

export type DeclTaggedType = {
  tctor: DeclTypeCtor.TAGGED;
  tag: string;
  body: DeclType;
}

export type DeclUnionType = {
  tctor: DeclTypeCtor.UNION;
  args: DeclType[];
}

export type DeclIntersectionType = {
  tctor: DeclTypeCtor.INTERSECTION;
  args: DeclType[];
}

export type DeclTypeVarDefinition = {
  name: string;
  upperBound?: DeclType;
  lowerBound?: DeclType;
}

export type DeclGenericType = {
  tctor: DeclTypeCtor.GENERIC;
  targs: DeclTypeVarDefinition[];
  body: DeclType;
}

export type DeclNameRefType = {
  tctor: DeclTypeCtor.NAMEREF;
  name: string;
  args?: DeclType[];
}

export type DeclType = DeclBuiltinType | DeclCompoundType;


// Values of data in process of evaluations

export type DeclPrimitiveValue = string | number | boolean | null;

export type DeclAnyValue = DeclPrimitiveValue | object

export type DeclStructValue = Record<string, DeclAnyValue>;

export type DeclValue = DeclPrimitiveValue | Array<DeclAnyValue> | DeclStructValue;


export enum DeclASTTag {
  TAGGED = 'tagged',
  LITERAL = 'literal',
  LAMBDA = 'lambda',
  SCOPE = 'scope',
  TYPEDEF = 'typedef',
  REF = 'ref',
  ANNOTATION = 'oftype',
}


// Abstract syntax trees of sources (serializable to JSON)

export interface DeclASTNode {
  tag: string;
}

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

export type DeclDefinition = {
  name: string;
  description?: string;
  value: DeclExpression;
  type?: DeclType;
}

export type DeclTypeDefinition = {
  name: string;
  description?: string;
  value: DeclType;
}

export type DeclScope = {
  tag: 'scope';
  let: DeclDefinition[];
  in: DeclExpression;
}

export type DeclTypeDef = {
  tag: 'typedef';
  typedef: DeclTypeDefinition[];
  in: DeclExpression;
}

export type DeclNameReference = {
  tag: 'ref';
  name: string;
  args?: DeclExpression;
}

export type DeclTypeAnnotation = {
  tag: 'oftype';
  body: DeclExpression;
  type: DeclType;
}

export type DeclExpression = DeclLiteral | DeclTaggedExpression | DeclLambdaExpression | DeclScope | DeclTypeAnnotation;
