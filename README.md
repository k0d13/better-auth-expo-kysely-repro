# better-auth#12312 repro

```sh
pnpm install
node build.js
```

`index.js` only imports `expo` from `@better-auth/expo`. With `splitting: true`, esbuild writes the Kysely adapter and Kysely itself to `dist`:

```
dist/index.js 31312
dist/kysely-adapter-PPCSIM5D.js 233209
dist/d1-sqlite-dialect-BgJMzZQp-GN7MDPEI.js 5486
dist/chunk-JCEVYBDJ.js 303038
...
```

`@better-auth/expo` imports from the `better-auth` root, which reaches `getAdapter` in `context/init`. That has `import("../adapters/kysely-adapter/index.mjs")`. esbuild drops `getAdapter`, but with splitting it still emits every dynamic import target as a chunk. Set `splitting: false` and only `dist/index.js` is left, with no Kysely in it.

Nothing imports those chunks, but on Cloudflare Workers with `find_additional_modules` (needed to ship split chunks) wrangler uploads them all, so they count against the Worker size limit.
