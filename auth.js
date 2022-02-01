const { BrowserWindow } = require('electron');
const { google } = require('googleapis');
const fs = require('fs/promises');
const path = require('path');

const TOKEN_PATH = 'token.json'

const getSheetData = async () => {
    const auth = await authorize();
    // console.log('Auth', auth);
    await fetchData(auth);
};

async function getCredentials() {
    const credentials = await fs.readFile(path.resolve(__dirname, 'credentials.json'), 'utf-8');
    return JSON.parse(credentials);
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
        token = JSON.parse(await fs.readFile(path.resolve(__dirname, TOKEN_PATH), 'utf-8'));
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
    // console.log('Token in credentials:', token)
    oauth2Client.setCredentials(token);
    return oauth2Client
}

async function storeToken(token) {
    await fs.writeFile(path.resolve(__dirname, TOKEN_PATH), JSON.stringify(token))
    // console.log(`Token stored to ${TOKEN_PATH}`)
}


async function fetchData(auth) {
    try {
        const sheets = google.sheets('v4');
        const spreadsheetId = '1N4kcF0TiMmDlKE4K5TLT7jw48h1-nEgDelSIexT93EA'
        const range = 'Payment Forecast!A11:X38'
        const response = await sheets.spreadsheets.values.get({ auth, spreadsheetId, range })
        const rows = response.data.values
        if (rows.length == 0) {
            console.log('No data found.')
            return
        }
        // return rows;
        console.log(rows);
    } catch (err) {
        console.log(`The API returned an error: ${err}`)
        return
    }
}

module.exports = {
    getSheetData,
    authorize
}