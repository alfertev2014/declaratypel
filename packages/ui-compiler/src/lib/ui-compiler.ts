import type { DeclDefinition, DeclTypeDefinition } from "@declaratypel/ast";
import { definition, defVar, exportDef, id, moduleTopLevel, typeDefinition, type DeclExpression, type DeclModule, type DeclTopLevel, type DeclType } from "@declaratypel/ast";

import { COMPONENT, COMPUTED_VALUE, PURE_FUNCTION, STATE, UI_DEFINITION, UI_EXPORT, UI_TYPEDEF, UI_VALUE, type DeclUIComponent, type DeclUIDefinition, type DeclUIModule } from "@declaratypel/ui-model";


const unreachable = (): never => {
  throw new Error("BUG: Unreachable code")
}

const transformReactiveType = (reactiveType: DeclType): DeclType => {

}

const transformState = (stateExpression: DeclExpression, type?: DeclType): DeclExpression => {

}

const transformComputed = (computedExpression: DeclExpression, type?: DeclType): DeclExpression => {

}

const transformPureFunction = (pureExpression: DeclExpression, type?: DeclType): DeclExpression => {

}

const transformComponent = (component: DeclUIComponent): DeclExpression => {

}

const transformDefinition = (def: DeclUIDefinition): DeclDefinition| DeclTypeDefinition => {
  const {name, value} = def
  switch (value.uiTag) {
    case UI_TYPEDEF: {
      return typeDefinition(name, transformReactiveType(value.type), value.description)
    }
    case UI_VALUE: {
      switch (value.kind) {
        case STATE: {
          return definition([{ pattern: defVar(id(name), transformState(value.expression, value.type))}])
        }
        case COMPUTED_VALUE: {
          return definition([{ pattern: defVar(id(name), transformComputed(value.expression))}])
        }
        case PURE_FUNCTION: {
          return definition([{ pattern: defVar(id(name), transformPureFunction(value.expression))}])
        }
        default:
          return unreachable()
      }
    }
    case COMPONENT: {
      return definition([{ pattern: defVar(id(name), transformComponent(value))}])
    }
    default:
      return unreachable()
  }
}

export const transformModule = (uiModule: DeclUIModule): DeclModule => {
  const { imports, definitions } = uiModule;
  const topLevel: DeclTopLevel[] = [...imports]

  for (const def of definitions) {
    switch (def.uiTag) {
      case UI_EXPORT: {
        topLevel.push(exportDef(transformDefinition(def.def)))
        break
      }
      case UI_DEFINITION: {
        topLevel.push(transformDefinition(def))
        break;
      }
    }
  }
  return moduleTopLevel(topLevel)
}