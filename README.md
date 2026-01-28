# TypeScript Namespace Merging Issue with Turbopack

This repo demonstrates that **TypeScript namespace merging fails** when using Turbopack bundler.

## The Problem

TypeScript allows declaring the same namespace multiple times — they get merged:

```typescript
// lib/index.ts
export namespace Test {
    export const a = 1;
}

export namespace Test {
    export const b = a + 1;  // ❌ Fails
}
```

This is **valid TypeScript** and compiles fine with `tsc`.

### Error

```
ReferenceError: a is not defined
```

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
