import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { LRDBAdapter, LRDBClient } from 'lrdb-debuggable-lua';
import { ConnectedNotify } from './lrdbDebug';

export class LuaInstancesTreeViewProvider implements vscode.TreeDataProvider<LuaRemoteDebuggerInstance> {
  
  openPorts: Map<number, LuaRemoteDebuggerInstance> = new Map<number, LuaRemoteDebuggerInstance>();

  constructor() {
    for(let i = 21110; i < 21120; i++) {
      this.openPorts.set(i, new LuaRemoteDebuggerInstance(i, this))
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
    for (const [key, value] of this.openPorts) {
      if(value.available) {
        res.push(value);
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
  tree: LuaInstancesTreeViewProvider

  constructor(port: number, tree: LuaInstancesTreeViewProvider) {
    super("", undefined)
    this.port = port
    this.tree = tree
    this.testAvailable()
  }

  testAvailable(): void {
    this.available = false
    
    this.testClient = new LRDBClient.Client(
      new LRDBAdapter.TcpAdapter(this.port, 'localhost')
    )
    this.testClient.onNotify.on((event) => {
      if(event.method == 'connected') {
        const ce = event as unknown as ConnectedNotify;
        if(ce.params && ce.params.lua && ce.params.lua.version) {
          this.luaVersion = ce.params.lua.version;
          this.label = 'localhost : ' + this.port.toString() + " - " + ce.params.lua.version;
          this.available = true
          this.testClient?.end()
        }
      }
    })

    this.testClient.onClose.on(() => {
      this.tree.refresh();
    })

    this.testClient.onOpen.on(() => {
    })
  }
  collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  label: string = ""
  luaVersion: string = ""
  iconPath = new vscode.ThemeIcon('vm')
  available: boolean = false;
}
