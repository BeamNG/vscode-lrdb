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

![Garry's Mod debug](https://raw.githubusercontent.com/danielga/vscode-gmrdb/master/images/gmrdb.gif)

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
      "name": "Attach to Garry's Mod",
      "sourceRoot": "C:/Program Files (x86)/Steam/steamapps/common/GarrysMod/garrysmod",
      "sourceFileMap": {
        "${workspaceFolder}": "addons/test"
      },
      "stopOnEntry": true
    },
    {
      "type": "gmrdb",
      "request": "launch",
      "name": "Launch Garry's Mod",
      "program": "C:/steamcmd/garrysmod_windows_server_beta/srcds_win64.exe",
      "cwd": "C:/steamcmd/garrysmod_windows_server_beta",
      "args": [
        "-console",
        "-game", "garrysmod",
        "-ip", "localhost",
        "-port", "27015",
        "+map", "gm_construct",
        "+maxplayers", "2"
      ],
      "sourceRoot": "C:/steamcmd/garrysmod_windows_server_beta/garrysmod",
      "port": 21111,
      "sourceFileMap": {
        "${workspaceFolder}": "addons/test"
      },
      "stopOnEntry": true
    }
  ]
}
```

## Icon licensing

[Lua icon](https://www.lua.org/images)
[Search for virus (modified)](https://www.flaticon.com/free-icon/search-for-virus_95496)
