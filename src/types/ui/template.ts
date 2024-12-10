import { DeclExpression, DeclPrimitiveValue, DeclType, DeclValue, DeclVarDefinition } from "../ast";

export enum DeclUITag {
  ELEMENT = 'element',
  COMPONENT = 'component',
}

export interface DeclUITemplateNode {
  uiTag: string;
}

export type DeclUITemplateNativeElement = {
  uiTag: 'NativeElement';
  name: string;
  attrs: Record<string, DeclPrimitiveValue>;
  children: DeclUITemplateElement[];
}

export type DeclUIComponentPropExpression = DeclExpression | DeclUITemplateComponentElement;

export type DeclUITemplateComponentElement = {
  uiTag: 'UIComponentElement';
  component: DeclComponent;
  props: Record<string, DeclUIComponentPropExpression>;
  children: DeclUITemplateElement[];
}

export type DeclUITemplateElement = DeclUITemplateNativeElement | DeclUITemplateComponentElement;

export type DeclComponent = {
  tag: 'ui';
  name: string;
  description?: string;
  props: DeclVarDefinition[];
  return: DeclType;
  body: DeclValue;
}

export type DeclUIRule = {
  tag: 'uirule';
  selector: string;
  type: DeclType;
  editor: DeclUITemplateElement;
}
