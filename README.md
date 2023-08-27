# Tiny Typescript Demo

This is a tiny, simple example app that uses TypeScript on client and server for learning purposes. It uses Express.js on the server and vanilla JS on the client. I was originally going to use React on the client, but the setup took so long with just TypeScript that I ended up postponing on React.

Here are the tips:

## Tell VSCode to use the project's TypeScript install

I can't imagine why this isn't the default behavior. When I started, VSCode was using it's own version of TypeScript, which was on a different version than the TypeScript installed in `/node_modules/` and, therefore, being used in the project via the `tsc` command. It's easy to change this:

1. Open a `*.ts` file
2. Clicking the `{}` button in the status bar immediately to the left of `TypeScript`
3. Click "Select Version"
4. Click "Use Workspace Version" (NOT "Use VS Code's Version")

## Use [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) to have separate typescript configs for client & server code

* Requires `"files": []` in the root tsconfig (without this, the root tsconfig is also used to transpile all files, even ones in child references, and fails because it doesn't have the correct config)
* Require `composite: true` in the child tsconfig's
* Requires running `tsc --build` every time (set in package.json)

## Use a nodeXX base for server-side TypeScript

* TypeScript provides [base configurations](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases) for each version of node. For your `/server/` code, you'll want to use the one that matches the major version of Node that you're using.

## Use `module: 'es2022'` and `lib: ['dom']` for native ESM in the browser

* There isn't a base config that's explicitly for browser use -- for this, use the "recommended" base. But along with it, you'll need to specify `module: 'es2022'` (or similar), assuming you're using ECMAScript Modules, and `lib: ['dom']` in order to directly or indirectly reference browser DOM APIs.

## Transpile to the same folder if you're not using a bundler or build tool

It is a common convention to use `/src/` and `/dist/` folders for the source and target folders, respectively. When doing a combined client/server project, some examples use `/src/client/` and `/src/server/`, which target `/dist/client/` and `/dist/server/`.

However, tsc will *only* transpile your JS files to TS files. If you have other files -- HTML, CSS, images, etc -- it will not copy these from `/src/` to `/dist/`. This can be done via a bundler (like Webpack) or a build tool (gulp, grunt or simple npm scripts), but I didn't want to add that (unrelated) complexity to this demo learning app. Instead, the files are simply transpiled side-by-side, with the `.ts` and their corresponding `.js` (and `.d.ts`) files in the same folder.

* So I went with a parallel files in same folder (vs. /src/ and /dist/ folders)

## Use `<script type="module" ...>` so your main script can import ESModules

* This is more related to ECMAScript Modules (ESM) than TypeScript, but you need to decorate your `<script>` tag with `type="module"` in order for your main browser script to import *other* modules.

## Use "./" prefixes and ".js" suffixes to reference local modules

* When importing local modules in the browser, you need to use full paths, including the file extension, for example, `import { assert, renderHeader } from "./utils.js";`
* Note that you need to use the `.js` suffix, even when importing from a `.ts` file. TypeScript will not convert a `.ts` import into a `.js` import when transpiling. However, it does know how to find the relevant types for a `.js` import (I assume this is via the `.d.ts` file that was generated with the `.js` file).

## TypeScript has robust support for assert()-based Type Narrowing

If you have code that depends on a `.navbar` element in the DOM, TypeScript will (rightly) error out, saying that the element may or may not be present (`querySelector()` may return `null`):

```javascript
let navbar = document.querySelector('.navbar');
navbar.innerHTML = 'New Navbar Contents';
```

One way to address this is to assert that the navbar exists by throwing an error if it doesn't:

```javascript
let navbar = document.querySelector('.navbar');
if (!navbar) {
  throw new Error('Assertion Failed: Navbar not found in the DOM');
}
navbar.innerHTML = 'New Navbar Contents';
```

TypeScript's code flow analysis detects what is going on here via [Truthiness Type Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing). It knows that `querySelector()` may return `null`, but that if it does, the error will be thrown, so all subsequent code (`navbar.innerHTML = ...`) is good.

Aside: note that TypeScript does not (and cannot) actually make this style of old-school DOM-manipulation code "safe". But it does draw attention to the "unsafe" code (dependence on something that the API doesn't guarantee), and requires the developer to explicitly assert dependencies.

The problem comes when you attempt to pull out the check into an `assert()` function. TypeScript's code flow analysis can no longer follow this:

```typescript
let navbar = document.querySelector('.navbar');
assert(navbar);
navbar.innerHTML = 'New Navbar Contents';

function assert(val: unknown) {
  if (!val) {
    throw new Error('Assertion failed');
  }
}
```

However, TypeScript added support to decorate these sorts of assertion functions with the `asserts` keyword in TypeScript 3.7, so that it can follow them:

```typescript
let navbar = document.querySelector('.navbar');
assert(navbar);
navbar.innerHTML = 'New Navbar Contents';

function assert(val: unknown): asserts val {
  if (!val) {
    throw new Error('Assertion failed');
  }
}
```

It makes me a little nervous to use this, since it is underdocumented. It's only documentd in the [TypeScript 3.7 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) and in the [Assertion Function Examples](https://www.typescriptlang.org/play#example/assertion-functions).

That said, I suspect that this underdocumentation isn't a problem specific to this feature, but rather that many TypeScript features are only documented in the release notes of a particular version, as one of the maintainers admits [here](https://github.com/microsoft/TypeScript/issues/31983#issuecomment-513977239). My impression is that this is in part due to TypeScript's sprawling number of features and options.
