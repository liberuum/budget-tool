import { getSheetData } from "./auth.js";
import { addData } from './mongodb.js';


export default class Processor {
    constructor() { };

    parserConfig = {
        itemName: 'String',
        budgetOwner: 'String',
        projectName: 'String',
        expenseTag: 'String',
        comment: 'String',
        approved: 'Boolean',
        paid: "String",
        variable: 'String',
        forecast: 'Number',
        currency: 'String',
        exchangeRate: 'Number',
        forecast2: 'Number',
        estimate: 'Number',
        actual: 'Number',
        difference: 'Number',
        allowedDifference: 'Number',
        owed: 'Number',
        payment: 'Number',
        account: 'String',
        subAccount: 'String',
        reportingNote: "String",
        auditorNote: "String",
        reportingMonth: "String"
    };
    rawData = [];
    cleanedSheet = [];
    dataObjects = [];
    parsedData = [];

    processData = () => {
        this.clearRawData()
        this.buildJson()
        this.parseTypes()
    }

    getRawData = async () => {
        this.rawData = await getSheetData()
    }

    clearRawData = () => {
        let data = this.rawData
        for (const arr of data) {
            let processor = this.getProcessor(arr);
            if (processor !== false) {
                processor(arr)
            } else {
                continue;
            }
        }
        // console.log('Cleaned Data', this.cleanedSheet);
    }

    getProcessor = (uncleanedArray) => {
        if (this.isBudgetLineItem(uncleanedArray)) return this.parseBudgetLineItem
        if (this.isBudgetHeader(uncleanedArray)) return this.parseBudgetHeaders // another function
        return false;
    }

    parseBudgetLineItem = (arr) => {
        for (let i = 0; i <= arr.length; i++) {
            if (arr[i] === '1') arr.splice(i, 1)
            if (arr[i] === '') arr[i] = ''
        }
        this.cleanedSheet.push(arr);
    }

    parseBudgetHeaders = () => {

    }

    // configurators determining what parser to use
    isBudgetLineItem = (row) => {
        return row[0] === '1'
    }

    isBudgetHeader = (row) => {
        return row[0] === '2'
    }

    buildJson = () => {
        let arrSheet = this.cleanedSheet;
        for (const arr of arrSheet) {
            let rowObject = {};
            for (let i = 0; i < arr.length; i++) {
                rowObject[Object.entries(this.parserConfig)[i][0]] = arr[i];
            }
            this.dataObjects.push(rowObject)
        }

        // console.log('dataObjects', this.dataObjects)
    }

    // corce data types
    parseNumber = (stringNumber) => {
        const regex = /[^,]/g;
        return parseFloat(stringNumber.match(regex).join(''));
    }

    parseTypes = async () => {
        for (const object of this.dataObjects) {
            let parsedObject = {};
            for (const item in object) {
                if (this.parserConfig[item] === 'Boolean') {
                    parsedObject[item] = Boolean(object[item])
                } else if (this.parserConfig[item] === 'Number') {
                    parsedObject[item] = this.parseNumber(object[item])
                }
                else {
                    parsedObject[item] = object[item]
                }
            }
            this.parsedData.push(parsedObject);
        }
        // console.log('parsedData', this.parsedData)
    }

    addDataToDb = async () => {
        if (this.parsedData.length !== 0) {
            console.log('Adding data to MongoDB')
            await addData(this.parsedData, 'budgetLineItems');
            console.log('finished adding parsed data to DB', this.parsedData.length)
        } else {
            console.log('no data found in parsedData', this.parsedData)
        }
    }

}