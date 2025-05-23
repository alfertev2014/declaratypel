import { defineConfig } from "eslint/config"
import baseConfig from "../../eslint.config.mjs"
import pureflang from "../eslint-config-pureflang/src/index.ts"

export default defineConfig([
  ...baseConfig,
  {
    files: ["**/*.ts"],
    extends: [pureflang]
  },
  {
    files: ["**/*.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          ignoredFiles: ["{projectRoot}/eslint.config.{js,cjs,mjs}"],
        },
      ],
    },
    languageOptions: {
      parser: await import("jsonc-eslint-parser"),
    },
  },
])
