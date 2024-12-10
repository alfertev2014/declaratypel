import { DeclExpression, DeclType } from "./ast"

export type DeclNode = {
  expression: DeclExpression;
  expectedType?: DeclType;
  inferedType?: DeclType;
}