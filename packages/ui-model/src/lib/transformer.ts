import { DEFINITION, EXPORT, IMPORT, TYPE_DEFINITION, type DeclDefinition, type DeclImport, type DeclModule, type DeclTypeDefinition } from "@declaratypel/ast";
import { uiExport, uiModule, type DeclUIDefinition, type DeclUIExport, type DeclUIModule } from "./template.ts";

const transformDefinition = (def: DeclDefinition): DeclUIDefinition => {
  throw new Error("Not implemented")
}

const transformTypeDefinition = (def: DeclTypeDefinition): DeclUIDefinition => {
  throw new Error("Not implemented")
}

export const astToUi = (module: DeclModule): DeclUIModule => {
  const { topLevel, description } = module
  const imports: DeclImport[] = []
  const definitions: (DeclUIExport | DeclUIDefinition)[] = []
  for (const top of topLevel) {
    switch (top.tag) {
      case IMPORT: {
        imports.push(top)
        break
      }
      case EXPORT: {
        switch (top.def.tag) {
          case DEFINITION: {
            definitions.push(uiExport(transformDefinition(top.def)))
            break;
          }
          case TYPE_DEFINITION: {
            definitions.push(uiExport(transformTypeDefinition(top.def)))
            break;
          }
        }
        break
      }
      case DEFINITION: {
        break
      }
      default:
        throw new Error(`Unsupported top level syntax ${top.tag}`)
    }
  }
  return uiModule(imports, definitions, description)
}