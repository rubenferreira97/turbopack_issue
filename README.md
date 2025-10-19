### Repo Layout
- `lib/` — local library package (`name: "lib"`, ESM, TypeScript entry `index.ts`).
- `next/` — Next.js application that depends on `lib` via a local link.

### Environment (from package manifests)
- App `next/package.json`:
  - `next`: `^16.1.0`
  - `react`: `^19.2.3`, `react-dom`: `^19.2.3`
  - `lib` dependency: `"link:lib"`
  - Scripts:
    - `dev`: `next dev`
    - `build`: `next build`
    - `start`: `next start`
- Library `lib/package.json`:
  - `name`: `lib`
  - `type`: `module`
  - `module`: `index.ts`
  - Peer: `typescript ^5`

Note: The dependency uses the `link:` protocol. This is supported by bun.

### Notes

- The `next/next.config.ts` file configures Turbopack to set the root directory to the monorepo root. This ensures that Turbopack can correctly resolve the local library package.

```ts
const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};
```