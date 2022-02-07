const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  authenticate: () => ipcRenderer.invoke('authorize-google'),
  saveOAuthCredentials: () => ipcRenderer.invoke('save-credentials'),
  resetCredentials: () => ipcRenderer.invoke('reset-credentials'),
  checkCredentials: () => ipcRenderer.invoke('checkCredentials'),
  checkToken: () => ipcRenderer.invoke('checkToken'),
  getSheetInfo: (link) => ipcRenderer.invoke('getSheetInfo', { link })
})
