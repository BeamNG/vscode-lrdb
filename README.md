# Lua Remote DeBugger for Visual Studio Code

This extension allows debugging embedded Lua VMs through Visual Studio Code.

This works by running a [remote debugging server](https://github.com/danielga/gm_rdb)
on SRCDS listening on a port. The VSCode extension is then used to attach a
debugger to provide breakpoints.

Based on the work from:
- [danielga/vscode-gmrdb](https://github.com/danielga/vscode-gmrdb)
- [satoren/vscode-lrdb](https://github.com/satoren/vscode-lrdb)
- [kapecp/vscode-lrdb](https://github.com/kapecp/vscode-lrdb)

![Lua debug](images/demo.gif)

## Features

- Supports Windows, macOS and Linux
- Add/remove breakpoints
- Conditional breakpoints
- Continue, pause, step over, step in, step out
- Local, global, \_ENV, upvalue variables and arguments
- Watch window
- Evaluate expressions
- Remote debugging over TCP

## Requirements

One of those lua Remote Debugger:
- [Garry's Mod Lua Remote Debugger](https://github.com/danielga/gm_rdb/releases)
- [Lua Remote Debugger](https://github.com/satoren/vscode-lrdb)

## Usage

Start the debugger server in your embedded Lua, then attach VS Code to it.

How to use:
- in [BeamNG](Readme_BeamNG.md)
- in [Garry's Mod](Readme_GM.md)
