const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFolder: () => ipcRenderer.invoke('open-folder-dialog')
});