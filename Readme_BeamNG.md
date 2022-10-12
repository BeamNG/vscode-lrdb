# Lua debugger

The Lua debugger is a feature of 0.27 and after.

## Architecture overview

This project consists of a c++ part that is compiled with the game and runs with it and a VScode extension that connects to it.

# Prerequisites

1) [Install VSCode](https://code.visualstudio.com)
2) Install the [`LRDB` (Lua Remote Debugger) extension](https://marketplace.visualstudio.com/items?itemName=satoren.lrdb) for VScode

# Quickstart

1) Open game folder in VScode as workspace: `File` > `Open Folder...` > `<select game folder>`
2) Place breakpoints in your Lua files. (Highlight a line and press `F9`)
3) Start the game separatly with the command line arguments
 `-luadebug -attachOnStart` - The game will hang and wait for VScode to connect.
4) Press `F5` in VScode (Launch in VScode to attach to the game).

Quick cheat sheet for the debug commands in VScode:
* `F5` - continue execution
* `Shift + F5` - stop debugging
* `F6` - pause execution
* `F9` - toggle breakpoint on current line
* `F10` - step over
* `F11` - step into
* `Shift + F11` - step out

# Documentation

The default debugger listen port is `21110` and it will listen on any IPv4 address. So you could theoretically debug from another computer as well.

## Command line arguments

* `-luadebug` - Enables the lua debugger. If this switch is missing, none of the other functions will work.
* `-attachOnStart` - Attaches and waits for VScode on startup

### Example game startup batch file

`BeamNG.drive.bat`
```batch
BeamNG.drive -console -nouserpath -luadebug -attachOnStart
```

## Lua API

* `attachDebugger(port)` - attach the debugger to a certain port dynamically. If port is `nil` then the default port of `21110` is used
* `detachDebugger()` - detach the debugger
* `debugBreak()` - break into the debugger via code

### Example Lua extension

As example, this loads the debugger when the extension is loaded and breaks when the test method is executed. VScode hangs in the debugbreak when connected.

`lua/ge/extensions/test/debugger.lua`
```lua
local M = {}
local function test()
  print('Hello world!')
  debugBreak()
  local testVar = 123
  dump{'testVar = ', testVar}
end
local function onExtensionLoaded()
  attachDebugger()
end
local function onExtensionUnloaded()
  detachDebugger()
end
M.test = test
M.onExtensionLoaded = onExtensionLoaded
M.onExtensionUnloaded = onExtensionUnloaded
return M
```

Run: `extensions.test_debugger.test()`

## VScode launch config

`launch.json`
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lrdb",
      "request": "attach",
      "name": "Attach",
      "host": "localhost",
      "port": 21110,
      "sourceRoot": "${workspaceFolder}",
      "stopOnEntry": false
    },
  ]
}
```

# Known problems

* It only works with the GameEngine Lua VM.
* It is slow
  * Possible solution: try to attach the debugger only when the code you want to debug is loaded and not for the game startup.
* It gets slower the more breakpoints you have
  * For now: Have only a minimal set of breakpoints defined.

# Common usage problems

* The debugger does not break in the file?
  * One potential issue is that the path of your lua file is containing something that makes it incompatible to vscode. For example:
    * `lua/ge/extensions//test/debugger.lua` - double slash
    * `../debugger.lua` - relative paths
    * `c:/.../debugger.lua` - paths outside of the vscode workspace
  * Solution: Please check how you require and load a module. Especially the package.path definition can result in problems that are not easily detectable.
    
# Source and License

The debugger is based on [LRDB-0.3.1](https://github.com/satoren/LRDB) but with heavy modifications for compatiblity and speed.

See [LICENSE_1_0.txt](LICENSE_1_0.txt)