

export default class Processor {
    constructor() { };

    filters = {
        direct: {
            column: null,
            index: null,
            certain: false,
            labels: ['!direct', 'Direct']
        },
        forecast: {
            column: null,
            index: null,
            certain: false,
            labels: ['!forecast', 'Forecast']
        },
        estimate: {
            column: null,
            index: null,
            certain: false,
            labels: ['!estimate', 'Estimate']
        },
        actual: {
            column: null,
            index: null,
            certain: false,
            labels: ['!actual', 'Actual']
        },
        owed: {
            column: null,
            index: null,
            certain: false,
            labels: ['!owed', 'Owed']
        },
        paid: {
            column: null,
            index: null,
            certain: false,
            labels: ['!paid', 'Paid (Dai)']
        },
        category: {
            column: null,
            index: null,
            certain: false,
            labels: ['!category', 'Budget Category']
        },
        month: {
            column: null,
            index: null,
            certain: false,
            labels: ['!month', 'Month']
        }
    }

    parserConfig = {
        Direct: 'Number',
        Forecast: 'Number',
        Estimate: 'Number',
        Actual: 'Number',
        Owed: 'Number',
        'Paid (Dai)': 'Number',
        'Budget Category': 'String',
        Month: 'String'
    };
    rawData = [];
    cleanedSheet = [];
    monthList = []
    dataObjects = [];
    parsedData = [];
    filteredByMonth = {}

    // function calls are done in sequence
    processData = () => {
        this.updateFilter()
        this.clearRawData()
        this.buildJson()
        this.getListOfMonths()
        this.parseTypes()
        this.filterByMonth()
    }

    getRawData = (data) => {
        this.rawData = data;
    }

    updateFilter = () => {
        for (let i = 0; i < this.rawData.length; i++) {
            this.isFilterRow(this.rawData[i], i)
        }
        // console.log('updated filters', this.filters)
    }

    clearRawData = () => {
        let arrFilter = Object.entries(this.filters);
        let arr = []

        for (let i = 7; i < this.rawData.length; i++) {
            for (let item = 0; item < arrFilter.length; item++) {
                let rowItem = this.rawData[i][arrFilter[item][1].column]
                if (rowItem === undefined) {
                    arr = []
                    break;
                }
                arr.push(rowItem)
            }
            this.cleanedSheet.push(arr)
            arr = []
        }

        // console.log('cleaned Sheet:', this.cleanedSheet)
    }

    buildJson = () => {
        Object.entries(this.filters)[0][1].labels[1]
        for (const arr of this.cleanedSheet) {
            let rowObject = {};
            for (let i = 0; i < arr.length; i++) {
                rowObject[Object.entries(this.filters)[i][1].labels[1]] = arr[i]
            }
            this.dataObjects.push(rowObject)
        }

        // console.log('dataObjects', this.dataObjects)
    }

    filterByMonth = () => {
        for (let i = 0; i < this.monthList.length; i++) {
            let month = this.parsedData.filter(object => {
                return object.Month === this.monthList[i]
            })
            this.filteredByMonth[this.monthList[i]] = month;
        }
        // console.log('filteredByMonth', this.filteredByMonth)

    }

    getListOfMonths = () => {
        let duplicateTags = [];
        for (const object of this.dataObjects) {
            if (object.Month !== undefined)
                duplicateTags.push(object.Month)
        }
        this.monthList = [...new Set(duplicateTags)];
    }


    isFilterRow = (arr, index) => {
        let filterArr = Object.entries(this.filters)
        for (let i = 0; i < filterArr.length; i++) {
            if (arr.includes(filterArr[i][1]['labels'][0])) {
                this.filters[filterArr[i][0]].column = arr.indexOf(filterArr[i][1]['labels'][0]);
                this.filters[filterArr[i][0]].certain = true;
                this.filters[filterArr[i][0]].index = index;
                // console.log(`Found Index nr: ${arr.indexOf(filterArr[i][1]['labels'][0])} of Column with label: ${filterArr[i][1]['labels'][0]}`);
            }
        }
        // return true;
    }

    // coerce data types
    parseNumber = (stringNumber) => {
        const regex = /[^,]/g;
        let number = stringNumber;
        // console.log(`number ${number} state: ${number === ''}`)
        if (number === '') {
            return 0
        } else {
            return parseFloat(number.match(regex).join(''));
        }
    }

    parseTypes = () => {
        for (const object of this.dataObjects) {
            let parsedObject = {};
            for (const item in object) {
                if (this.parserConfig[item] === 'Number') {
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


    // addDataToDb = async () => {
    //     if (this.parsedData.length !== 0) {
    //         console.log('Adding data to MongoDB')
    //         await addData(this.parsedData, 'budgetLineItems');
    //         console.log('finished adding parsed data to DB', this.parsedData.length)
    //     } else {
    //         console.log('no data found in parsedData', this.parsedData)
    //     }
    // }

}