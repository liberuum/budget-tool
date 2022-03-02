

export default class Processor {
    constructor() { };

    filterIndex = null;

    // having multiple filter templates
    filters = [];

    //deep copy
    addNewFilter() {
        let copy = JSON.parse(JSON.stringify(this.filterTemplate));
        this.filters.push(copy);
        this.filterIndex = this.filters.length - 1; // sets the index to filter 
    }

    resetFilterIndex() {
        if (this.filters.length < 1) {
            this.addNewFilter();
        } else {
            this.filterIndex = 0;
        }
    }

    selectNextFilter(addNewIfNeeded = true) {
        if (this.filters.length < 1 || this.filterIndex === this.filters.length - 1) {
            if (addNewIfNeeded) {
                this.addNewFilter()
                return true;
            }
            return false;
        } else {
            this.filterIndex++;
            return true;
        }
    }

    currentFilter() {
        if (this.filters.length < 1) {
            this.selectNextFilter()
        }
        return this.filters[this.filterIndex]
    }

    filterTemplate = {
        direct: {
            column: null,
            index: null,
            certain: false,
            labels: ['!direct', 'Direct'],
            parseFunction: null
        },
        forecast: {
            column: null,
            index: null,
            certain: false,
            labels: ['!forecast', 'Forecast'],
            parseFunction: 'tryParseNumber'
        },
        estimate: {
            column: null,
            index: null,
            certain: false,
            labels: ['!estimate', 'Estimate'],
            parseFunction: 'tryParseNumber'
        },
        actual: {
            column: null,
            index: null,
            certain: false,
            labels: ['!actual', 'Actual'],
            parseFunction: 'tryParseNumber'
        },
        owed: {
            column: null,
            index: null,
            certain: false,
            labels: ['!owed', 'Owed'],
            parseFunction: 'tryParseNumber'
        },
        paid: {
            column: null,
            index: null,
            certain: false,
            labels: ['!paid', 'Paid (Dai)'],
            parseFunction: 'tryParseNumber'
        },
        category: {
            column: null,
            index: null,
            certain: false,
            labels: ['!category', 'Budget Category'],
            parseFunction: null
        },
        month: {
            column: null,
            index: null,
            certain: false,
            labels: ['!month', 'Month'],
            parseFunction: null
        },
        transaction: {
            column: null,
            index: null,
            certain: false,
            labels: ['!transaction', 'Transaction'],
            parseFunction: null
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
    parsedRows = [];
    monthList = []
    dataObjects = [];
    parsedData = [];
    filteredByMonth = {}

    // function calls are done in sequence
    processData = () => {
        this.updateFilter()
        this.parseRowData()
        this.buildJson()
        this.getListOfMonths()
        this.parseTypes()
        this.filterByMonth()
    }

    getRawData = (data) => {
        console.log('raw data', data)
        this.rawData = data;
    }

    updateFilter = () => {
        for (let i = 0; i < this.rawData.length; i++) {
            this.tryParseFilterRow(this.rawData[i], i)
        }
        console.log('updated filters', this.filters)
    }


    isValidMonth(month) {
        if (typeof month != "string") return false // we only process strings!  
        return month.length > 0;
    }

    isValidNumber(actual) {
        return typeof actual === 'number';
    }

    isValidExpenseRow(rowCandidate) {
        let result = this.isValidMonth(rowCandidate.month) && (this.isValidNumber(rowCandidate.actual) || this.isValidNumber(rowCandidate.forecast) || this.isValidNumber(rowCandidate.estimate) || this.isValidNumber(rowCandidate.paid))
        if (result == false) {
            console.log('rejected rowCandidate', rowCandidate, this.isValidMonth(rowCandidate.month), this.isValidNumber(rowCandidate.actual), this.isValidNumber(rowCandidate.forecast), this.isValidNumber(rowCandidate.estimate))
        }
        return result;
    }

    parseRowData = () => {
        this.resetFilterIndex();
        do {
            let arrFilter = Object.entries(this.currentFilter());
            let arr = {}
            console.log('Parsing with filter,', this.currentFilter())
            for (let i = 0; i < this.rawData.length; i++) {
                for (let item = 0; item < arrFilter.length; item++) {
                    // console.log('this.rawData[i]', this.rawData[i])
                    // console.log('arrFilter', arrFilter[item][1])
                    if (arrFilter[item][1].certain) {
                        let cellValue = this.rawData[i][arrFilter[item][1].column]
                        if (arrFilter[item][1].parseFunction) {
                            arr[arrFilter[item][0]] = this[arrFilter[item][1].parseFunction](cellValue)
                        } else {
                            arr[arrFilter[item][0]] = cellValue;
                        }
                    }
                }
                // need wrap arounf if 
                if (this.isValidExpenseRow(arr)) {
                    this.parsedRows.push(arr)
                    arr = []
                }
            }

            console.log('parsedRows:', this.parsedRows)
        }
        while (this.selectNextFilter(false))

    }

    buildJson = () => {
        Object.entries(this.currentFilter())[0][1].labels[1]
        for (const arr of this.parsedRows) {
            let rowObject = {};
            for (let i = 0; i < arr.length; i++) {
                rowObject[Object.entries(this.currentFilter())[i][1].labels[1]] = arr[i]
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


    matchesFilterTag(cellData, tag) {
        let t = cellData.toLowerCase().trim();
        return t == tag

    }

    tryParseFilterRow = (arr, rowIndex) => {
        // console.log('arr in tryParse', arr)
        this.resetFilterIndex();
        for (let i = 0; i < arr.length; i++) {
            if (this.matchesFilterTag(arr[i], '!next')) {
                this.selectNextFilter();
                console.log('selecting next Filter', this.filterIndex)
            }
            let filterArr = Object.entries(this.currentFilter())
            for (let j = 0; j < filterArr.length; j++) {
                if (this.matchesFilterTag(arr[i], filterArr[j][1]['labels'][0])) {
                    this.currentFilter()[filterArr[j][0]].certain = true;
                    this.currentFilter()[filterArr[j][0]].column = i;
                    this.currentFilter()[filterArr[j][0]].index = rowIndex;
                    console.log('Matched column', this.currentFilter()[filterArr[j][0]])
                }
            }
        }
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

    tryParseNumber(numberString) {
        const regex = /[^,]*/g;
        if (typeof numberString !== 'string' || numberString.length < 1) {
            return numberString;
        }
        let result = parseFloat(numberString.match(regex).join(''));
        return isNaN(result) ? numberString : result;
    }


    // parse the direct into boolean

}