
// Meta objects of types

export enum DeclBuiltinType {
  STRING,
  NUMBER,
  BOOLEAN,
  NULL
}

export enum DeclTypeCtor {
  STRUCT,
  ARRAY,
  NAMED
}

export interface DeclCompoundType {
  tctor: DeclTypeCtor;
}

export type DeclKeyValueType = {
  key: string;
  description?: string;
  type: DeclType;
}

export type DeclStructType = {
  tctor: DeclTypeCtor.STRUCT;
  props: DeclKeyValueType[];
}

export type DeclArrayType = {
  tctor: DeclTypeCtor.ARRAY;
  items: DeclType;
}

export type DeclNamedType = {
  tctor: DeclTypeCtor.NAMED;
  name: string;
  description?: string;
  body: DeclType;
}

export type DeclType = DeclBuiltinType | DeclCompoundType;


// Values of data in process of evaluations

export type DeclPrimitiveValue = string | number | boolean | null;

export type DeclAnyValue = DeclPrimitiveValue | object

export type DeclStructValue = Record<string, DeclAnyValue>;

export type DeclValue = DeclPrimitiveValue | Array<DeclAnyValue> | DeclStructValue;


// Abstract syntax trees of sources (serializable to JSON)

export interface DeclASTNode {
  tag: string;
}

export interface DeclNamedExpression {
  tag: 'named';
  name: string;
  body: DeclLiteral;
}

export type DeclLiteral = {
  tag: 'literal';
  value: DeclPrimitiveValue | Array<DeclExpression> | Record<string, DeclExpression>;
}

export type DeclExpression = DeclLiteral | DeclNamedExpression;


// UI

type DeclUINativeElement = {
  ctor: 'NativeElement';
  attrs: Record<string, DeclPrimitiveValue>;
  children: DeclUIElement[];
}

type DeclUIComponentPropValue = DeclPrimitiveValue | DeclUIComponentElement;

type DeclUIComponentElement = {
  ctor: 'component';
  component: DeclComponent;
  props: Record<string, DeclUIComponentPropValue>;
  children: DeclUIElement[];
}

type DeclUIElement = DeclUINativeElement | DeclUIComponentElement;

type DeclComponent = {
  name: string;
  description?: string;
  props: DeclKeyValueType[];
  return: DeclType;
  body: DeclValue;
}