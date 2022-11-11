# fracpack

Easy `npm` packages with [svelte-package](https://kit.svelte.dev/docs/packaging) and  [changesets](https://github.com/changesets/changesets).

> see [fracpack-auth](https://github.com/fractalhq/fracpack-auth) for private packages and a password-protected demo/docs site.

<br>

## Running locally

```bash
npx degit fractalhq/fracpack my-package

cd my-package

pnpm install

pnpm run dev
```

navigate to http://localhost:3333

<br>

## Setup

- Add your `npm` token to your Github environment variables.
- Update the `repo` field in `.changeset/config.json`
- Update the `github.repository` field in `.github/workflows/release.yml`

<br>

## Usage

`pnpm build` - Build the demo/docs site.

`pnpm package` - Build the package into `dist`.

`pnpm package-watch` - Watch for changes in the package, and rebuild it automatically.

`npx changset` - [Publish](#publishing) the build.

Anything exported from [src/package/index.ts]() will be included in the npm package (with type declaration files automatically generated). Markdown can be used anywhere (see [src/routes/docs/+page.md]()). I like to use the home page ([src/routes/+page.svelte]()) for demos. See [svelte.config.js]() and [vite.config.js]() for further configuration.

<br>

## Publishing

- To publish a package update, run `npx changeset` and follow the instructions.
- Commit the generated changelog, and merge the changeset bot's PR.
- Profit.
