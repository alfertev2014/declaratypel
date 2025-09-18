import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        "FunctionExpression",
        "WithStatement",
        "BinaryExpression[operator='in']",
        "UnaryExpression[operator='delete']",
        "AssignmentExpression",
        "TSAsExpression",
        "ObjectExpression SpreadElement",
        "VariableDeclaration[kind='let']",
        "UpdateExpression",
        "TSEnumDeclaration",
        "ClassDeclaration",
        "TSInterfaceDeclaration",
        "ThisExpression"
      ]
    }
  }
])