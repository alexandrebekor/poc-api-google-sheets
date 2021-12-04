require('dotenv').config()
const express = require('express')
const { google } = require('googleapis')

const app = express()

app.get('/', async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    })


    // Create client instance for auth
    const client = await auth.getClient()

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client })

    const spreadsheetId = process.env.SHEET_SPREADSHEET_ID
    // Get Metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    })

    // Filter sheet by ID
    const sheetById = sheetId => {
        const selectSheet = metaData.data.sheets.filter(item => item.properties.sheetId == sheetId)
        const sheet = selectSheet[0].properties
        return sheet
    }

    // Reading data
    const getMessage = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetById(0).title}!C4:C6`
    })

    const message = getMessage.data.values[0][0]
    const statusMessage = getMessage.data.values[2][0]

    res.send({
        message,
        statusMessage
    })
})

app.listen(3000, console.log('Running Server'))