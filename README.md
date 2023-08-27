# Tiny Typescript Demo

This is a tiny, simple example app that uses TypeScript on client and server for learning purposes. It uses Express.js on the server and vanilla JS on the client. I was originally going to use React on the client, but the setup took so long with just TypeScript that I ended up postponing on React.

Here's are the tips:

## Tell VSCode to use the project's TypeScript install

I can't imagine why this isn't the default behavior. When I started, VSCode was using it's own version of TypeScript, which was on a different version than the TypeScript installed in node_modules and, therefore, being used in the project via the `tsc` command. It's easy to change this:

1. Open a `*.ts` file
2. Clicking the `{}` button in the status bar immediately to the left of `TypeScript`
3. Click "Select Version"
4. Click "Use Workspace Version" (NOT "Use VS Code's Version")

To-Do: Fill out the rest of these

## Use [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) to have separate typescript configs for client & server code

* Requires `"files": []` (contra one piece of documentation?)
* Require `composite: true` in child tsconfig's
* Does it require `rootDir` to be set? Or is `.` the default?
* Requires running `tsc --build` every time (set in package.json)

## Use `<script type="module" ...>` so your main script can import ESModules

## Use "./" prefixes and ".js" suffixes to reference local modules

## tsc doesn't copy assets

* So I went with a parallel files in same folder (vs. /src/ and /dist/ folders)

## Use the recommended nodeXX base for server-side TypeScript

## Use `module: 'es2022'` and `lib: ['dom']` for native ESM in the browser


