# TypeScript Namespace Merging Issue with Bundlers

This repo demonstrates that **TypeScript namespace merging fails** when using modern bundlers (Turbopack, Webpack with SWC/esbuild, etc.).

## The Problem

TypeScript allows declaring the same namespace multiple times — they get merged:

```typescript
// lib/index.ts
export namespace Test {
    export const a = 1;
}

export namespace Test {
    export const b = a + 1;  // ❌ Fails with bundlers
}
```

This is **valid TypeScript** and compiles fine with `tsc`. However, bundlers that use single-file transpilation (SWC, esbuild, Babel) fail because they process each namespace block in isolation without understanding the merged scope.

### Error

```
ReferenceError: a is not defined
```

## Why This Happens

| Tool | Works? | Reason |
|------|--------|--------|
| `tsc` | ✅ | Full program analysis, understands merging |
| Webpack + `ts-loader` (transpileOnly: false) | ✅ | Uses tsc under the hood |
| Webpack + SWC/esbuild-loader | ❌ | Single-file transpilation |
| Turbopack (SWC) | ❌ | Single-file transpilation |
| Bun | ❌ | Single-file transpilation |

## Repo Structure

```
lib/          # Local TypeScript library with namespace merging
  index.ts    # Contains the problematic namespace code
client/       # Next.js app consuming the library
```

## Reproduction

```bash
cd client
bun install
bun run dev   # Error: a is not defined
```

## Workarounds

1. **Consolidate namespaces** into a single block:
   ```typescript
   export namespace Test {
       export const a = 1;
       export const b = a + 1;
   }
   ```

2. **Use fully qualified names**:
   ```typescript
   export namespace Test {
       export const b = Test.a + 1;
   }
   ```

3. **Avoid namespaces** — use ES modules instead (recommended)