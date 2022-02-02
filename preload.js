const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  fileApi: {
    saveOAuthCredentials() {
      ipcRenderer.send('save-credentials')
    },
    authenticate() {
      ipcRenderer.send('authorize-google');
    }
  },

  checkCredentials: () => ipcRenderer.invoke('checkCredentials'),
  checkToken: () => ipcRenderer.invoke('checkToken'),
  getSheetInfo: ( link) => ipcRenderer.invoke('getSheetInfo', { link })
})
