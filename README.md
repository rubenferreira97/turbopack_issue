## Turbopack Module Resolution Issue Repro

This repository reproduces a Turbopack resolution failure when importing a local package using bun's `file:` protocol.

### Repo Layout
- `lib/` — local library package (`name: "lib"`, ESM, TypeScript entry `index.ts`).
- `next/` — Next.js application that depends on `lib` via a `file:` protocol.

### Environment (from package manifests)
- App `next/package.json`:
  - `next`: `^16.1.0`
  - `react`: `^19.2.3`, `react-dom`: `^19.2.3`
  - `lib` dependency: `"file:../lib"`
  - Scripts:
    - `dev`: `next dev`
    - `build`: `next build`
    - `start`: `next start`
- Library `lib/package.json`:
  - `name`: `lib`
  - `type`: `module`
  - `module`: `index.ts`
  - Peer: `typescript ^5`

Note: The dependency uses the `file:../lib` protocol. This is supported by bun.

### Installation
Run installs in both packages:

- In `lib/`:
  - `bun i`
- In `next/`:
  - `bun i`

### Run
- From `next/`: `bun run dev`

### Error Output
When running with Turbopack, the app errors:

```
## Error Type
Build Error

## Error Message
Error parsing package.json file

## Build Output
./next/node_modules/lib/package.json
Error parsing package.json file
package.json is not parseable: invalid JSON: a redirect can't be parsed as json

Next.js version: 16.1.0 (Turbopack)
```

### Expected vs Actual
- Expected: Turbopack resolves symlinked files correctly and imports `libNumber` from `lib`.
- Actual: Turbopack reports `Error parsing package.json file`.

### Notes
This issue appears specific to Turbopack's handling of symlinked packages via bun's `file:` protocol (bun symlinks files but not folders). Using bun's `link:` protocol (bun symlinks folder) works as expected.

Turbopack `root` was configured:

```ts
const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};
```