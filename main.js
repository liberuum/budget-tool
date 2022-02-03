// Main Process
const { app, BrowserWindow, ipcMain, dialog, Menu, Tray } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const fs = require('fs/promises');
const { fetchData, authorize, parseSpreadSheetLink } = require('./auth.js');

const dockIcon = path.join(__dirname, 'assets', 'images', 'budgetToolLogo.png');
const trayIcon = path.join(__dirname, 'assets', 'images', 'budget_icon.jpg');


function createSplashWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 200,
        backgroundColor: '#6e707e',
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            //is a feature that ensures that both, your preload scripts and Electron
            //internal logic run in seperate context
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('splash.html');
    // win.webContents.openDevTools();
    return win;
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: 'white',
        show: false,
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
    // win.webContents.openDevTools();
    return win;
}

if (isDev) {
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

    const splash = createSplashWindow()
    const mainApp = createWindow();

    mainApp.once('ready-to-show', () => {
        setTimeout(() => {
            splash.destroy();
            mainApp.show()
        }, 2000)
    })
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

ipcMain.handle('getSheetInfo', async (evemt, args) => {
    // console.log('Getting Link in Main:', await args)
    const { spreadSheetTitle, sheetName, spreadsheetId } = await parseSpreadSheetLink(args);
    const rawData = await fetchData(spreadsheetId, sheetName);
    return { spreadSheetTitle, sheetName, spreadsheetId, rawData }
})