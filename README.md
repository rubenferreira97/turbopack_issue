## Turbopack Module Resolution Issue Repro

This repository reproduces a Turbopack resolution failure when importing a local package by its package name (`lib`) from a Next.js app. The same setup runs fine with the default (webpack) dev server.

### Repo Layout
- `lib/` — local library package (`name: "lib"`, ESM, TypeScript entry `index.ts`).
- `next/` — Next.js application that depends on `lib` via a local link.

### Environment (from package manifests)
- App `next/package.json`:
  - `next`: `15.5.6`
  - `react`: `19.1.0`, `react-dom`: `19.1.0`
  - `lib` dependency: `"link:lib"`
  - Scripts:
    - `dev`: `next dev`
    - `dev:turbopack`: `next dev --turbopack`
    - `build`: `next build`
    - `build:turbopack`: `next build --turbopack`
- Library `lib/package.json`:
  - `name`: `lib`
  - `type`: `module`
  - `module`: `index.ts`
  - Peer: `typescript ^5`

Note: The dependency uses the `link:` protocol. This is supported by bun. If using npm, prefer `file:../lib`.

### Installation
Run installs in both packages:

- In `lib/`:
  - `bun link` to register the package globally
  - `bun i` or `npm i` (optional build step if you have one)
- In `next/`:
  - `bun i` or `npm i`

If you prefer npm, change the app’s `lib` dependency to `file:../lib` resolves correctly.

### Run (webpack, works)
- From `next/`: `bun run dev` (or `npm run dev`)
- Expected: App starts successfully.

### Run (Turbopack, fails)
- From `next/`:
  - Using existing script: `bun run dev:turbopack` (or `npm run dev:turbopack`)

### Error Output
When running with Turbopack, the app errors on a bare import of the local package:

```
./src/app/page.tsx:1:1
Module not found: Can't resolve 'lib'
> 1 | import { libNumber } from "lib";
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  2 |
  3 | export default function Home() {
  4 |   return (

https://nextjs.org/docs/messages/module-not-found

    at <unknown> (./src/app/page.tsx:1:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
    at <unknown> (./src/app/page.tsx:1:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
error: script "dev:turbopack" exited with code 1
```

### Expected vs Actual
- Expected: Turbopack resolves the local package `lib` the same way webpack does, allowing `import { libNumber } from "lib"` to work.
- Actual: Turbopack reports `Module not found: Can't resolve 'lib'`, while webpack runs fine.

### Minimal Source Context
- Import in `next/src/app/page.tsx`:
  - `import { libNumber } from "lib"`

### Notes
- Ensure the package manager links `lib` under `next/node_modules/lib` (bun `link:` or npm `file:`/`npm link`).