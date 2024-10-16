import { Injectable } from '@angular/core';
declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private ipcRenderer: any;

  constructor() {
    // Make sure we are in Electron context
    if (window && window.require) {
      try {
        this.ipcRenderer = window.require('electron').ipcRenderer;
      } catch (e) {
        console.error('Electron\'s IPC was not loaded', e);
      }
    }
  }

  // Send messages to Electron main process
  send(channel: string, data?: any) {
    if (this.ipcRenderer) {
      this.ipcRenderer.send(channel, data);
     }
  }

  // Listen to messages from Electron main process
  on(channel: string, callback: (event: any, ...args: any[]) => void) {

    if (this.ipcRenderer) {
       this.ipcRenderer.on(channel, callback);
    }
  }
}
