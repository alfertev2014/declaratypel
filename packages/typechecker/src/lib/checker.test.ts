import assert from 'node:assert'
import test, { describe } from 'node:test'
import { inferType } from './checker.ts'
import { decl, defVar, id, lambda, literal, obj, propValue, VAR_DEFINITION } from "@declaratypel/ast"
import { BUILTIN, builtinType, FUNCTIONAL, LITERAL_TYPE, NUMBER, OBJECT } from "@declaratypel/ast"

describe("inferType", () => {
  test("for literals should return literal type", t => {
    for (const lit of ["", "bla", 42, true, false, 100500n, null, undefined]) {
      t.test(`for literal '${lit}'`, () => {
        const inferred = inferType(literal(lit), null)
        assert.strictEqual(inferred.tctor, LITERAL_TYPE)
        assert.strictEqual(inferred.value, lit)
      })
    }
  })

  describe("of object template", () => {
    test("for empty object", () => {
      const inferred = inferType(obj([]), null)
      assert.strictEqual(inferred.tctor, OBJECT)
      assert.strictEqual(inferred.props.length, 0)
      assert.strictEqual(inferred.indexer, undefined)
    })

    test("with props of literal types", t => {
      t.test("with one prop should return object type with this prop and literal type as value type", () => {
        const inferred = inferType(obj([propValue("foo", literal("bar"))]), null)
        assert.strictEqual(inferred.tctor, OBJECT)
        assert.strictEqual(inferred.props.length, 1)
        assert.strictEqual(inferred.indexer, undefined)
        assert.strictEqual(inferred.props[0].name, "foo")
        const propType = inferred.props[0].type
        assert.strictEqual(propType.tctor, LITERAL_TYPE)
        assert.strictEqual(propType.value, "bar")
      })

      t.test("with two props should return object type with these props in the same order and literal types as value types", () => {
        const inferred = inferType(obj([propValue("foo1", literal("bar1")), propValue("foo2", literal("bar2"))]), null)
        assert.strictEqual(inferred.tctor, OBJECT)
        assert.strictEqual(inferred.props.length, 2)
        assert.strictEqual(inferred.indexer, undefined)
        assert.strictEqual(inferred.props[0].name, "foo1")
        const propType1 = inferred.props[0].type
        assert.strictEqual(propType1.tctor, LITERAL_TYPE)
        assert.strictEqual(propType1.value, "bar1")
        assert.strictEqual(inferred.props[1].name, "foo2")
        const propType2 = inferred.props[1].type
        assert.strictEqual(propType2.tctor, LITERAL_TYPE)
        assert.strictEqual(propType2.value, "bar2")
      })
    })
  })

  describe("for function type", () => {
    test("lambda of zero parameters returning literal", () => {
      const inferred = inferType(lambda([], literal("foo")), null)
      assert.strictEqual(inferred.tctor, FUNCTIONAL)
      assert.strictEqual(inferred.args.length, 0)
      assert.strictEqual(inferred.rest, undefined)
      assert.strictEqual(inferred.result.tctor, LITERAL_TYPE)
      assert.strictEqual(inferred.result.value, "foo")
    })

    test("lambda of one parameter with annotation and returning literal", () => {
      const inferred = inferType(lambda([decl(defVar(id("arg")), builtinType(NUMBER))], literal("foo")), null)
      assert.strictEqual(inferred.tctor, FUNCTIONAL)
      assert.strictEqual(inferred.args.length, 1)
      assert.strictEqual(inferred.rest, undefined)
      assert.strictEqual(inferred.result.tctor, LITERAL_TYPE)
      assert.strictEqual(inferred.result.value, "foo")
      const { pattern, type } = inferred.args[0]
      assert.strictEqual(pattern.tag, VAR_DEFINITION)
      assert.strictEqual(pattern.name.name, "arg")
      assert.strictEqual(type.tctor, BUILTIN)
      assert.strictEqual(type.tag, NUMBER)
    })
  })
})