# Garry's Mod Remote DeBugger for Visual Studio Code

## Introduction

This extension allows debugging Lua code and using the Source engine console
of Garry's Mod clients or SRCDS (SouRCe Dedicated Server) instances,
through Visual Studio Code.

This fork works only with the Garry's Mod module
[danielga/gm_rdb](https://github.com/danielga/gm_rdb).

Based on the work from
[satoren/vscode-lrdb](https://github.com/satoren/vscode-lrdb) and
[kapecp/vscode-lrdb](https://github.com/kapecp/vscode-lrdb).

![Lua debug](https://raw.githubusercontent.com/danielga/vscode-gmrdb/master/images/lrdb.gif)

## Features

- Supports Windows, macOS and Linux
- Add/remove breakpoints
- Conditional breakpoints
- Continue, pause, step over, step in, step out
- Local, global, \_ENV, upvalue variables and arguments
- Watch window
- Evaluate expressions
- Remote debugging over TCP

## Extension settings

launch.json example:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "gmrdb",
      "request": "attach",
      "host": "localhost",
      "port": 21111,
      "name": "Attach to remote debugger",
      "sourceFileMap": {
        "${workspaceFolder}": "."
      }
    }
  ]
}
```
