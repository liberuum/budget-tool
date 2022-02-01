// Main Process
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const fs = require('fs/promises');
const { getSheetData, authorize } = require('./auth.js');


function createWindow() {
    // Browser Window <-- Renderer Process
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            //is a feature that ensures that both, your preload scripts and Electron
            //internal logic run in seperate context
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html');
    win.webContents.openDevTools();
}

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    })
}

app.whenReady().then(async () => {
    createWindow();
    // await getSheetData();


});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

ipcMain.on('save-credentials', async () => {
    const gSecretsPath = await dialog.showOpenDialog({ properties: ['openFile'] })
    const gSecrets = JSON.parse(await fs.readFile(gSecretsPath.filePaths[0], 'utf-8'));
    await fs.writeFile(path.resolve(__dirname, 'credentials.json'), JSON.stringify(gSecrets))
})

ipcMain.on('authorize-google', async () => {
    await authorize()
})


ipcMain.handle('checkCredentials', async (event, args) => {
    try {
        await fs.stat(path.resolve(__dirname, 'credentials.json'));
        return true;
    } catch (err) {
        return false
    }
})

ipcMain.handle('checkToken', async (event, args) => {
    try {
        await fs.stat(path.resolve(__dirname, 'token.json'));
        const auth = await authorize()
        return { state: true, authClient: auth };
    } catch (err) {
        return { state: false, authClient: null }
    }
})