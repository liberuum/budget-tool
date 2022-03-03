const { app, BrowserWindow } = require('electron');
const { google } = require('googleapis');
const fs = require('fs/promises');
const path = require('path');
const settings = require('electron-settings');

const TOKEN_PATH = 'token.json';

// console.log(app.getAppPath('userData'));
const userPath = app.getAppPath('userData')

const getSheetData = async () => {
    const auth = await authorize();
    // console.log('Auth', auth);
    await fetchData(auth);
};

async function getCredentials() {
    try {
        const credentials = await settings.get('credentials');
        return JSON.parse(credentials);
    } catch (error) {
        throw error;
    }
}

const getOAuthCodeByInteraction = (interactionWindow, authPageURL) => {
    interactionWindow.loadURL(authPageURL);
    return new Promise((resolve, reject) => {
        const onclosed = () => {
            reject('Interaction ended intentionally ;(');
        };
        interactionWindow.on('closed', onclosed);
        interactionWindow.on('page-title-updated', (ev) => {
            const url = new URL(ev.sender.getURL());
            if (url.searchParams.get('approvalCode')) {
                interactionWindow.removeListener('closed', onclosed);
                interactionWindow.close();
                return resolve(url.searchParams.get('approvalCode'));
            }
            if ((url.searchParams.get('response') || '').startsWith('error=')) {
                interactionWindow.removeListener('closed', onclosed);
                interactionWindow.close();
                return reject(url.searchParams.get('response'));
            }
        });
    });
};

const authorize = async () => {
    const credentials = await getCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oauth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    let token = {};

    // check if we have previously stored a token
    try {
        token = JSON.parse(await settings.get('token'));
        if (!token)
            throw new Error
    } catch (err) {
        const url = oauth2Client.generateAuthUrl({
            scope: ['https://www.googleapis.com/auth/spreadsheets.readonly']
        });
        // Create another window and get code;
        const authWindow = new BrowserWindow({ x: 60, y: 60, useContentSize: true });
        const code = await getOAuthCodeByInteraction(authWindow, url);
        try {
            let fetchedTokens = await oauth2Client.getToken(code)
            token = fetchedTokens.tokens
            await storeToken(token)
        } catch (err) {
            console.log('Error while trying to retrieve access token')
            throw err
        }
    }
    oauth2Client.setCredentials(token);
    return oauth2Client
}

async function storeToken(token) {
    try {
        await settings.set('token', JSON.stringify(token));
    } catch (error) {
        throw error;
    }
}


async function fetchData(spreadsheetId, sheetName) {
    try {
        const auth = await authorize();
        const sheets = google.sheets('v4');
        const range = `${sheetName}`
        const response = await sheets.spreadsheets.values.get({ auth, spreadsheetId, range, valueRenderOption: 'UNFORMATTED_VALUE', dateTimeRenderOption: 'SERIAL_NUMBER' })
        const rows = response.data.values
        if (rows.length == 0) {
            console.log('No data found.')
            return
        }
        return rows;
    } catch (err) {
        console.log(`The API returned an error: ${err}`)
        return
    }
}

async function parseSpreadSheetLink({ link }) {
    try {
        const auth = await authorize();
        const pattern = /\/spreadsheets\/d\/([^\/]+)\/edit[^#]*(?:#gid=([0-9]+))?/gm
        let result = pattern.exec(link)
        const spreadsheetId = result[1];
        const sheetId = Number(result[2])
        // Getting Sheet Name
        const sheets = google.sheets('v4');
        const sheetNameResponse = await sheets.spreadsheets.get({ auth, spreadsheetId });
        const spreadSheetTitle = sheetNameResponse.data.properties.title;
        const sheetData = sheetNameResponse.data.sheets.filter(item => {
            if (item.properties.sheetId == sheetId)
                return item.properties.title
        })
        const sheetName = sheetData[0].properties.title;

        return { spreadSheetTitle, sheetName, spreadsheetId }
    } catch (error) {
        console.log(`The API returned an error ${error}`)
    }
}

module.exports = {
    authorize,
    parseSpreadSheetLink,
    fetchData
}