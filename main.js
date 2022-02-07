// Main Process
const { app, BrowserWindow, ipcMain, dialog, Menu, Tray } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const fs = require('fs/promises');
const { fetchData, authorize, parseSpreadSheetLink } = require('./auth.js');
const settings = require('electron-settings');

const dockIcon = path.join(__dirname, 'assets', 'images', 'budgetToolLogo.png');
const trayIcon = path.join(__dirname, 'assets', 'images', 'budget_icon.jpg');

function createWindow() {
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
    isDev && win.webContents.openDevTools();
    return win;
}

if (isDev) {
    if (process.platform !== 'darwin')
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
        })
}

if (process.platform === 'darwin') {
    app.dock.setIcon(dockIcon);
}

let tray = null;

app.whenReady().then(async () => {
    const template = require('./utils/menu').createTemplate(app);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    tray = new Tray(trayIcon)
    tray.setContextMenu(menu)

    createWindow();

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

ipcMain.handle('save-credentials', async () => {
    try {
        const gSecretsPath = await dialog.showOpenDialog({ properties: ['openFile'] })
        const gSecrets = JSON.parse(await fs.readFile(gSecretsPath.filePaths[0], 'utf-8'));
        await settings.set('credentials', JSON.stringify(gSecrets))
        return true;
    } catch (error) {
        console.error(error)
        return false;
    }
})

ipcMain.handle('authorize-google', async () => {
    try {
        await authorize()
        return true;
    } catch (error) {
        console.error(error)
        return false;
    }
})


ipcMain.handle('checkCredentials', async (event, args) => {
    try {
        return await settings.has('credentials');
    } catch (err) {
        return false
    }
})

ipcMain.handle('checkToken', async (event, args) => {
    try {
        const state = await settings.has('token');
        let auth = null;
        if (state)
            auth = await authorize();
        return { state, authClient: auth };
    } catch (err) {
        return { state: false, authClient: null }
    }
})

ipcMain.handle('getSheetInfo', async (evemt, args) => {
    // console.log('Getting Link in Main:', await args)
    const { spreadSheetTitle, sheetName, spreadsheetId } = await parseSpreadSheetLink(args);
    const rawData = await fetchData(spreadsheetId, sheetName);
    return { spreadSheetTitle, sheetName, spreadsheetId, rawData }
})

ipcMain.handle('reset-credentials', async () => {
    try {
        await settings.unset();
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
})

ipcMain.on('open-link', () => {
    require('electron').shell.openExternal('https://developers.google.com/workspace/guides/create-credentials#oauth-client-id')
})