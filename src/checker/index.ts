import {
  DeclExpression,
  DeclIdentifier,
  ELLIPSIS,
  IDENTIFIER,
  INDEXER,
  LITERAL,
  OBJECT_TEMPLATE,
  PROPERTY,
} from "../types/ast/sourceExpressions"
import {
  BIGINT,
  BOOLEAN,
  BUILTIN,
  builtinType,
  DeclIndexerDefinition,
  DeclObjectType,
  DeclPropDefinition,
  DeclType,
  DeclTypeIdentifier,
  LITERAL_TYPE,
  literalType,
  NEVER,
  NUMBER,
  OBJECT,
  objectType,
  STRING,
  TYPE_IDENTIFIER,
  UNKNOWN,
} from "../types/ast/typeExpressions"

export type TypeBounds = {
  /*mutable*/ upperBound: DeclType
  /*mutable*/ lowerBound: DeclType
}
export const typeBounds = (
  upperBound: DeclType = builtinType(UNKNOWN),
  lowerBound: DeclType = builtinType(NEVER),
): TypeBounds => ({
  upperBound,
  lowerBound,
})

type VarScopeFrame = {
  readonly parent: ScopeFrame
  /*mutable*/ bounds: TypeBounds
  readonly var: DeclIdentifier
}

type TypeScopeFrame = {
  readonly parent: ScopeFrame
  /*mutable*/ bounds: TypeBounds
  readonly type: DeclTypeIdentifier
}

type RefinementScopeFrame = {
  readonly parent: ScopeFrame
  /*mutable*/ bounds: TypeBounds
  readonly refinement: DeclExpression
}

type ScopeFrame = VarScopeFrame | TypeScopeFrame | RefinementScopeFrame | null

const lookupVar = (scope: ScopeFrame, identifier: DeclIdentifier): VarScopeFrame => {
  while (scope) {
    if ("var" in scope && scope.var.name === identifier.name) {
      return scope
    }
    scope = scope.parent
  }
  throw new Error(`Unknown variable identifier "${identifier.name}"`)
}

const lookupType = (scope: ScopeFrame, identifier: DeclTypeIdentifier): TypeScopeFrame => {
  while (scope) {
    if ("type" in scope && scope.type.name === identifier.name) {
      return scope
    }
    scope = scope.parent
  }
  throw new Error(`Unknown type identifier "${identifier.name}"`)
}

const typeMismatch = (expected: DeclType, inferred: DeclType): never => {
  // TODO: type to string
  throw new Error(`Type '${inferred.tctor}' is not assignable to type '${expected.tctor}'`)
}

const propMissed = (
  expected: DeclObjectType,
  inferred: DeclObjectType,
  prop: string | number,
): never => {
  // TODO: type to string
  throw new Error(
    `Property '${prop} is missed in type '${inferred.tctor}' and required in type '${expected.tctor}'`,
  )
}

const propReadonly = (
  expected: DeclObjectType,
  inferred: DeclObjectType,
  prop: string | number,
): never => {
  // TODO: type to string
  throw new Error(
    `Property '${prop} is readonly in type '${inferred.tctor}' but writable in type '${expected.tctor}'`,
  )
}

const propOptional = (
  expected: DeclObjectType,
  inferred: DeclObjectType,
  prop: string | number,
): never => {
  // TODO: type to string
  throw new Error(
    `Property '${prop} is optional in type '${inferred.tctor}' but required in type '${expected.tctor}'`,
  )
}

const unreachable = (): never => {
  throw new Error("BUG: Unreachable code")
}

const unifyTypes = (expected: DeclType, inferred: DeclType, scope: ScopeFrame): void => {
  if (expected.tctor === TYPE_IDENTIFIER) {
    const expectedFrame = lookupType(scope, expected)
    if (inferred.tctor === TYPE_IDENTIFIER) {
      const inferredFrame = lookupType(scope, inferred)

      // TODO: unify bounds
      inferredFrame.bounds = expectedFrame.bounds
    } else {
      unifyTypes(expectedFrame.bounds.upperBound, inferred, scope)
    }
    return
  }
  if (inferred.tctor === TYPE_IDENTIFIER) {
    const inferredFrame = lookupType(scope, inferred)
    unifyTypes(expected, inferredFrame.bounds.lowerBound, scope)
    return
  }
  if (inferred.tctor === BUILTIN && inferred.tag === NEVER) {
    // never is assignable to everything
    return
  }
  switch (expected.tctor) {
    case BUILTIN: {
      switch (expected.tag) {
        case NEVER: {
          return typeMismatch(expected, inferred)
        }
        case UNKNOWN: {
          // Everything is assignable to unknown
          return
        }
        case NUMBER:
        case BIGINT:
        case BOOLEAN:
        case STRING: {
          if (
            (inferred.tctor === BUILTIN && inferred.tag === expected.tag) ||
            (inferred.tctor === LITERAL_TYPE && typeof inferred.value === expected.tag)
          ) {
            return
          } else {
            return typeMismatch(expected, inferred)
          }
        }
        default:
          return unreachable()
      }
    }
    case LITERAL_TYPE: {
      if (inferred.tctor === LITERAL_TYPE && inferred.value === expected.value) {
        return
      } else {
        return typeMismatch(expected, inferred)
      }
    }
    case OBJECT: {
      if (inferred.tctor === OBJECT) {
        for (const expectedProp of expected.props) {
          const name = expectedProp.name
          const inferredProp = inferred.props.find((p) => p.name === name)
          if (!inferredProp) {
            return propMissed(expected, inferred, name)
          }
          if (!expectedProp.readonly && inferredProp.readonly) {
            return propReadonly(expected, inferred, name)
          }
          if (!expectedProp.optional && inferredProp.optional) {
            return propOptional(expected, inferred, name)
          }
          unifyTypes(expectedProp.type, inferredProp.type, scope)
        }
      } else {
        return typeMismatch(expected, inferred)
      }
      return
    }
  }
}

export const indexTypeMismatch = (index: DeclExpression): never => {
  // TODO: Expression to string
  throw new Error(`Type of index expression '${index}' must be assignable to 'string | number'.`)
}

export const inferType = (expr: DeclExpression, scope: ScopeFrame): DeclType => {
  switch (expr.tag) {
    case IDENTIFIER: {
      const inferredType = lookupVar(scope, expr)
      return inferredType.bounds.lowerBound
    }
    case LITERAL: {
      return literalType(expr.value)
    }
    case OBJECT_TEMPLATE: {
      const props: DeclPropDefinition[] = []
      let indexer: DeclIndexerDefinition | undefined = undefined
      for (const prop of expr.items) {
        if (prop.tag === PROPERTY) {
          const type = inferType(prop.value, scope)
          props.push({
            name: prop.key,
            type,
            optional: false,
            readonly: false,
          })
        } else if (prop.tag === INDEXER) {
          const indexType = inferType(prop.index, scope)
          const type = inferType(prop.value, scope)
          if (indexType.tctor === LITERAL_TYPE) {
            if (typeof indexType.value === "string" || typeof indexType.value === "number") {
              props.push({
                name: indexType.value,
                type,
                optional: false,
                readonly: false,
              })
            } else {
              return indexTypeMismatch(prop.index)
            }
          } else if (
            indexType.tctor === BUILTIN &&
            (indexType.tag === "string" || indexType.tag === "number")
          ) {
            indexer = {
              indexType,
              type,
              optional: false,
              readonly: false,
            }
          } else {
            throw new Error("TODO: Check indexType is subtype of string | number.")
          }
        } else if (prop.tag === ELLIPSIS) {
          throw new Error("TODO: Need exact types")
        }
      }
      return objectType(props, indexer)
    }
    default:
      return unreachable()
  }
}
