import {
  ARRAY_DESTRUCT,
  DeclArrayDestruct,
  DeclDefinition,
  DeclDestruct,
  DeclExpression,
  DeclIdentifier,
  DeclVarDefinition,
  ELLIPSIS,
  IDENTIFIER,
  INDEXER,
  LAMBDA,
  LITERAL,
  OBJECT_DESTRUCT,
  OBJECT_TEMPLATE,
  PROPERTY,
  VAR_DEFINITION,
} from "../types/ast/sourceExpressions"
import {
  ARRAY,
  arrayType,
  BIGINT,
  BOOLEAN,
  BUILTIN,
  builtinType,
  DeclArgDefinition,
  DeclIndexerDefinition,
  DeclObjectType,
  DeclPropDefinition,
  DeclType,
  DeclTypeIdentifier,
  funcType,
  LITERAL_TYPE,
  literalType,
  NEVER,
  NUMBER,
  OBJECT,
  objectType,
  STRING,
  TUPLE,
  TYPE_IDENTIFIER,
  UNKNOWN,
} from "../types/ast/typeExpressions"

export type TypeBounds = {
  readonly scope: ScopeFrame
  /*mutable*/ upperBound: DeclType
  /*mutable*/ lowerBound: DeclType
}
export const typeBounds = (
  scope: ScopeFrame,
  upperBound: DeclType = builtinType(UNKNOWN),
  lowerBound: DeclType = builtinType(NEVER),
): TypeBounds => ({
  scope,
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

const withVar = (scope: ScopeFrame, identifier: DeclIdentifier, bounds: TypeBounds): ScopeFrame => ({
  parent: scope,
  var: identifier,
  bounds,
})

const lookupType = (scope: ScopeFrame, identifier: DeclTypeIdentifier): TypeScopeFrame => {
  while (scope) {
    if ("type" in scope && scope.type.name === identifier.name) {
      return scope
    }
    scope = scope.parent
  }
  throw new Error(`Unknown type identifier "${identifier.name}"`)
}

const withTypeVar = (scope: ScopeFrame, identifier: DeclTypeIdentifier, bounds: TypeBounds): ScopeFrame => ({
  parent: scope,
  type: identifier,
  bounds,
})

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

const unifyTypes = (expected: TypeBounds, inferred: TypeBounds): void => {
  if (expected.upperBound.tctor === TYPE_IDENTIFIER) {
    const expectedFrame = lookupType(scope, expected.upperBound)
    if (inferred.lowerBound.tctor === TYPE_IDENTIFIER) {
      const inferredFrame = lookupType(scope, inferred.lowerBound)
      unifyTypes(expected, inferredFrame.bounds, scope)
    } else {
      unifyTypes(expectedFrame.bounds, inferred, scope)
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
      return lookupVar(scope, expr).bounds.lowerBound
    }
    case LITERAL: {
      return literalType(expr.value)
    }
    case OBJECT_TEMPLATE: {
      const props: /*mutable*/ DeclPropDefinition[] = []
      let indexer: DeclIndexerDefinition | undefined = undefined
      for (const prop of expr.items) {
        if (prop.tag === PROPERTY) {
          props.push({
            name: prop.key,
            type: inferType(prop.value, scope),
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
    case LAMBDA: {
      let bodyScope = scope
      const argTypes: /*mutable*/ DeclArgDefinition[] = []
      let argNumber = 0
      const checkArg = (arg: DeclDestruct, expected: DeclType): void => {
        switch (arg.tag) {
          case VAR_DEFINITION: {
            bodyScope = withVar(bodyScope, arg.name, typeBounds(bodyScope, expected))
            break
          }
          case ARRAY_DESTRUCT: {
            if (expected.tctor === ARRAY) {
              for (const item of arg.items) {
                checkArg(item, expected.items)
              }
            } else if (expected.tctor === TUPLE) {
              let i = 0
              for (const item of arg.items) {
                // TODO: rest of tuple
                checkArg(item, expected.items[i] ?? literalType(undefined))
                ++i
              }
            }
            return typeMismatch(expected, arrayType(builtinType(UNKNOWN)))
          }
          case OBJECT_DESTRUCT: {
            if (expected.tctor !== OBJECT) {
              return typeMismatch(expected, objectType([]))
            }
            for (const prop of arg.props) {
              // TODO
            }
            break
          }
          default:
            return unreachable()
        }
      }

      for (const arg of expr.args) {
        const type = arg.type ?? (arg.pattern.value ? inferType(arg.pattern.value, bodyScope) : builtinType(UNKNOWN))
        checkArg(arg.pattern, type)
        argTypes.push({
          name: arg.pattern.tag === VAR_DEFINITION ? arg.pattern.name.name : argNumber.toString(),
          optional: !!arg.pattern.value || arg.pattern.tag === VAR_DEFINITION && !!arg.pattern.optional,
          type,
          description: arg.description
        })
        ++argNumber
      }

      if (expr.rest) {
        checkArg(expr.rest, expr.restType ?? builtinType(UNKNOWN))
      }
      
      return funcType(expr.resultType ?? inferType(expr.body, bodyScope), argTypes, expr.restType ? {
        name: '...',
        type: expr.restType,
        optional: true
      } : undefined)
    }
    default:
      return unreachable()
  }
}
