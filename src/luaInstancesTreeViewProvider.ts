import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { LRDBAdapter, LRDBClient } from 'lrdb-debuggable-lua';
import { ConnectedNotify } from './lrdbDebug';
import { DebugSession } from '@vscode/debugadapter';

export class LuaInstancesTreeViewProvider implements vscode.TreeDataProvider<LuaRemoteDebuggerInstance> {
  
  openPorts: Map<number, LuaRemoteDebuggerInstance> = new Map<number, LuaRemoteDebuggerInstance>();

  constructor() {
    for(let i = 21110; i < 21120; i++) {
      this.openPorts.set(i, new LuaRemoteDebuggerInstance('localhost', i, this))
    }
  }

  refreshPorts(): void {
    for (const [key, value] of this.openPorts) {
        value.testAvailable()
    };
  }

  getTreeItem(element: LuaRemoteDebuggerInstance): vscode.TreeItem {
    return element;
  }

  getAvailableInstances(): LuaRemoteDebuggerInstance[] {
    let res: LuaRemoteDebuggerInstance[] = []
    for (const [key, di] of this.openPorts) {
      if(di.available || (di.debugSession !== undefined)) {
        res.push(di);
      }
    }
    return res
  }

  getChildren(element?: LuaRemoteDebuggerInstance): Thenable<LuaRemoteDebuggerInstance[]> {
    return Promise.resolve(this.getAvailableInstances());
  }

  private _onDidChangeTreeData: vscode.EventEmitter<LuaRemoteDebuggerInstance | undefined | null | void> = new vscode.EventEmitter<LuaRemoteDebuggerInstance | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<LuaRemoteDebuggerInstance | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  refreshCommand(): void {
    this.refreshPorts();
    this.refresh();
  }
}


class LuaRemoteDebuggerInstance extends vscode.TreeItem {
  testClient: LRDBClient.Client | undefined
  port: number
  hostname: string
  tree: LuaInstancesTreeViewProvider

  collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None

  label: string = ""

  luaVersion: string = ""
  productName: string = ""
  productVersion: string = ""
  shipping: boolean = false
  vmType: string = ""
  
  iconPath = new vscode.ThemeIcon('debug-alt')
  available: boolean = false;

  debugSession: vscode.DebugSession | undefined = undefined

  _debugSessionChanged(e?: vscode.DebugSession): void {
    this.refreshUI();
  }

  constructor(hostname: string, port: number, tree: LuaInstancesTreeViewProvider) {
    super("", undefined)
    this.port = port
    this.hostname = hostname
    this.tree = tree
    this.testAvailable()

    vscode.debug.onDidStartDebugSession((e?: vscode.DebugSession) => {
      if(this.debugSession === undefined && e?.configuration.host === this.hostname && e?.configuration.port === this.port) {
        this.debugSession = e
        this.refreshUI()
      }
    })
    vscode.debug.onDidTerminateDebugSession((e?: vscode.DebugSession) => {
      if(this.debugSession == e) {
        this.debugSession = undefined
        this.refreshUI()
      }
    })

  }

  refreshUI(): void {
    this.iconPath = (this.debugSession !== undefined) ? new vscode.ThemeIcon('close-all') : new vscode.ThemeIcon('debug-alt')
    this.label = this.hostname + ':' + this.port.toString() + " - " + this.vmType + ((this.debugSession !== undefined) ? " [active]" : "");
    this.tooltip = this.hostname + this.port.toString() + '\n' + this.productName + '\n' + this.productVersion + '\n' + this.vmType + '\n' + this.luaVersion + '\n' + (this.shipping ? "shipping" : "")
    this.tree.refresh();
  }

  testAvailable(): void {
    this.available = false
    this.testClient = new LRDBClient.Client(
      new LRDBAdapter.TcpAdapter(this.port, this.hostname)
    )
    this.testClient.onNotify.on((event) => {
      if(event.method == 'connected') {
        const ce = event as unknown as ConnectedNotify;
        if(ce.params && ce.params.lua) {
          if(ce.params.lua.version) this.luaVersion = ce.params.lua.version
          if(ce.params.lua.productName) this.productName = ce.params.lua.productName
          if(ce.params.lua.productVersion) this.productVersion = ce.params.lua.productVersion
          if(ce.params.lua.shipping) this.shipping = ce.params.lua.shipping
          if(ce.params.lua.vmType) this.vmType = ce.params.lua.vmType
          
          this.available = true
          // pause the execution again as this is only a check
          this.testClient?.pause()
          this.testClient?.end()
          this.refreshUI()
        }
      }
    })

    this.testClient.onClose.on(() => {
      this.testClient = undefined
      this.refreshUI();
    })

    this.command = {
      title: "open",
      command: "lrdb.startDebugging",
      arguments: [this.hostname, this.port]
    }

    this.command = {
      title: "open",
      command: "lrdb.toggleDebugging",
      arguments: [this.hostname, this.port]
    }
  }
}
