# Lua Remote Debugger for Visual Studio Code

How to work on this VS Code extension :)

## Architecture

This is a quick summary of how all of this is supposed to work together.

- The embedded Lua is compiled with custom debug extensions: see `scripting/debugger`. This is the debugger for lua and it is opening a TCP server and listen for debuggers to attach to.

- VS Code is having two components that it needs to take care of:
  - the extension via [extension.ts](src/extension.ts) that manages the session on the VS Code side
  - the Debug adapter which relays messages from the VS Code frontend to the C++ server backend.

For more information about the VS Code side of things, please read [debugger-extension](https://code.visualstudio.com/api/extension-guides/debugger-extension).


## Prerequisites

### Windows

1) Install [Node.js](https://nodejs.org/en/download/current)

## How to debug

This is quite complex, so be aware of the global picture before you try.

1) Open this folder as workspace in VS Code
2) run `npm i`
3) Change code to force VS Code to run the debugger adapter in server mode, so you can actually see what's going on. If you do not do this, a separate instance is started no matter if you start one. You'll not see the xceptions and breakpoints will not work.

in [extension.ts](src/extension.ts) around line 11, change the `runMode` to `server` like this:
```ts
const runMode: 'external' | 'server' | 'inline' = 'server'
```
Please do not commit this change, it will break in production.

4) On the left side of VS Code, switch to the "Run and Debug" Tab

## Submitting Contribution

### Accepting the Contributor License Agreement

When you create a new pull request, our CLA-bot will prompt you to sign the [BeamNG Contributor License Agreement](https://docs.google.com/forms/d/17eWfaz6Xbn120hnYTaZnhGX1Lzg-LGNaN3VklrjXCyY/viewform?edit_requested=true).

### Submitting Your Contribution

1. Create a fork of the repository.
2. Modify/add existing code and add tests where appropriate.
3. Create a pull request. Posting the pull request will trigger a git action requesting you to accept the contribution license agreement.

Congratulations :tada::tada: The BeamNG team thanks you :sparkles:.

Once your PR is merged, your contributions will be publicly visible on the [Contributors page](https://github.com/BeamNG/vscode-lrdb/graphs/contributors).

5) Launch `Extension + Server`. Extension is the frontend, Server is your Debug adapter
6) In the newly opened VS Code window, try to reproduce the crash or error, your exceptions should be logged.

## Publishing (only for project maintainers)

1) Please read the [offical guideline](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
2) Package it:
```
npm install -g vsce
vsce package
```

3) Log into the [marketplace backend](https://marketplace.visualstudio.com/manage)
3) Update the extension by uploading the `.vsix` file
