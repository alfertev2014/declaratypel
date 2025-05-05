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
  PROP_DEFINITION,
  PROPERTY,
  VAR_DEFINITION,
} from "../types/ast/sourceExpressions"
import {
  argArr,
  argObj,
  argVar,
  ARRAY,
  arrayType,
  BIGINT,
  BOOLEAN,
  BUILTIN,
  builtinType,
  DeclArgDefinition,
  DeclArgDestruct,
  DeclArgPropDestruct,
  DeclIndexerDefinition,
  DeclObjectType,
  DeclPropDefinition,
  DeclType,
  DeclTypeIdentifier,
  FUNCTIONAL,
  funcType,
  LITERAL_TYPE,
  literalType,
  NEVER,
  NUMBER,
  OBJECT,
  objectType,
  STRING,
  TUPLE,
  tupleType,
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

const unifyTypes = (expected: DeclType, inferred: DeclType, scope: ScopeFrame): void => {
  if (expected.tctor === TYPE_IDENTIFIER) {
    const expectedFrame = lookupType(scope, expected)
    if (inferred.tctor === TYPE_IDENTIFIER) {
      const inferredFrame = lookupType(scope, inferred)
      unifyTypes(expectedFrame.bounds.upperBound, inferredFrame.bounds.lowerBound, scope)
    } else {
      unifyTypes(expectedFrame.bounds.upperBound, inferred, scope)
      expectedFrame.bounds.lowerBound = inferred // TODO: Widen
    }
    return
  }
  if (inferred.tctor === TYPE_IDENTIFIER) {
    const inferredFrame = lookupType(scope, inferred)
    unifyTypes(expected, inferredFrame.bounds.lowerBound, scope)
    inferredFrame.bounds.upperBound = expected // TODO: Narrow
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
    case FUNCTIONAL: {
      if (inferred.tctor === FUNCTIONAL) {
        let i = 0
        for ( ; i < expected.args.length; ++i) {
          // contravariance!!!
          unifyTypes(inferred.args[i]?.type ?? builtinType(UNKNOWN), expected.args[i].type, scope)
        }
        if (expected.rest) {
          // contravariance!!!
          unifyTypes(inferred.rest?.type ?? builtinType(UNKNOWN), expected.rest.type, scope)
        }

        unifyTypes(expected.result, inferred.result, scope)
      } else {
        return typeMismatch(expected, inferred)
      }
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
      const checkArg = (arg: DeclDestruct, expected: DeclType): DeclArgDestruct => {
        switch (arg.tag) {
          case VAR_DEFINITION: {
            bodyScope = withVar(bodyScope, arg.name, typeBounds(bodyScope, expected))
            return argVar(arg.name)
          }
          case ARRAY_DESTRUCT: {
            if (expected.tctor === ARRAY) {
              const subargs: DeclArgDestruct[] = []
              for (const item of arg.items) {
                subargs.push(checkArg(item, expected.items))
              }
              const rest = arg.rest ? checkArg(arg.rest, expected.items) : undefined
              return argArr(subargs, rest)
            } else if (expected.tctor === TUPLE) {
              let i = 0
              const subargs: DeclArgDestruct[] = []
              for (const item of arg.items) {
                subargs.push(checkArg(item, expected.items[i] ?? literalType(undefined)))
                ++i
              }
              // TODO: nested and multiple rest of tuples
              return argArr(subargs)
            } else {
              return typeMismatch(expected, arrayType(builtinType(UNKNOWN)))
            }
          }
          case OBJECT_DESTRUCT: {
            if (expected.tctor !== OBJECT) {
              return typeMismatch(expected, objectType([]))
            }
            const subprops: DeclArgPropDestruct[] = []
            for (const prop of arg.props) {
              const expectedProp = expected.props.find(p => p.name === prop.name.name)
              if (prop.tag === VAR_DEFINITION) {
                if (expectedProp) {
                  checkArg(prop, expectedProp.type)
                  subprops.push(argVar(prop.name))
                } else if (expected.indexer) {
                  // TODO: optional and readonly
                  checkArg(prop, expected.indexer.type)
                  subprops.push(argVar(prop.name))
                } else {
                  return propMissed(expected, objectType([]), prop.name.name)
                }
              } else if (prop.tag === PROP_DEFINITION) {
                if (expectedProp) {
                  subprops.push({
                    tag: PROP_DEFINITION,
                    name: prop.name,
                    pattern: checkArg(prop.pattern, expectedProp.type)
                  })
                } else if (expected.indexer) {
                  // TODO: optional and readonly
                  subprops.push({
                    tag: PROP_DEFINITION,
                    name: prop.name,
                    pattern: checkArg(prop.pattern, expected.indexer.type)
                  })
                } else {
                  return propMissed(expected, objectType([]), prop.name.name)
                }
              } else {
                return unreachable()
              }
            }
            // TODO: rest destruct
            return argObj(subprops)
          }
          default:
            return unreachable()
        }
      }

      for (const arg of expr.args) {
        const type = arg.type ?? (arg.pattern.value ? inferType(arg.pattern.value, bodyScope) : builtinType(UNKNOWN))
        argTypes.push({
          pattern: checkArg(arg.pattern, type),
          optional: !!arg.pattern.value || arg.pattern.tag === VAR_DEFINITION && !!arg.pattern.optional,
          type,
          description: arg.description
        })
      }
      
      let restType: DeclArgDefinition | undefined = undefined
      if (expr.rest) {
        const type = expr.restType ?? (expr.restValue ? inferType(expr.restValue, bodyScope) : builtinType(UNKNOWN))
        restType = {
          pattern: checkArg(expr.rest, type),
          type,
          optional: true
        }
      }

      return funcType(expr.resultType ?? inferType(expr.body, bodyScope), argTypes, restType)
    }
    default:
      return unreachable()
  }
}
