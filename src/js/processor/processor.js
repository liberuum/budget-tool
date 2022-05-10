

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
            parseFunction: 'tryParseBoolean'
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
            labels: ['!paid', 'Paid'],
            parseFunction: 'tryParseNumber'
        },
        budget: {
            column: null,
            index: null,
            certain: false,
            labels: ['!budget', 'Budget'],
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
            parseFunction: 'tryParseMonth'
        },
        transaction: {
            column: null,
            index: null,
            certain: false,
            labels: ['!transaction', 'Transaction'],
            parseFunction: null
        }
    }

    rawData = [];
    parsedRows = [];
    filteredByMonth = {};
    budgets = {};
    filteredByCategoryMonth = {};
    accountedMonths = [];
    leveledMonthsByCategory = {}

    // function calls are done in sequence
    processData = () => {
        this.updateFilter()
        this.parseRowData()
        this.filterByMonth()
        this.filteredByCategoryMonth = this.buildSESView(this.parsedRows)
        this.leveledMonthsByCategory = this.buildSFView(this.filteredByCategoryMonth)
        // console.log('leveledMonthsByCategory', this.leveledMonthsByCategory)
        // console.log('filteredByMonth', this.filteredByMonth)
    }

    getRawData = (data) => {
        this.rawData = data;
        // console.log('rawData', this.rawData)
    }

    updateFilter = () => {
        for (let i = 0; i < this.rawData.length; i++) {
            this.tryParseFilterRow(this.rawData[i], i)
        }
        // console.log('updated filters', this.filters)
    }


    isValidMonth(month) {
        return month instanceof Date;
    }

    isValidNumber(actual) {
        return typeof actual === 'number';
    }

    isValidExpenseRow(rowCandidate) {
        let result = this.isValidMonth(rowCandidate.month) && (this.isValidNumber(rowCandidate.actual) || this.isValidNumber(rowCandidate.forecast) || this.isValidNumber(rowCandidate.estimate) || this.isValidNumber(rowCandidate.paid))
        if (result == false) {
            // console.log('rejected rowCandidate', rowCandidate, this.isValidMonth(rowCandidate.month), this.isValidNumber(rowCandidate.actual), this.isValidNumber(rowCandidate.forecast), this.isValidNumber(rowCandidate.estimate))
        }
        return result;
    }

    isValidBudgetRow(rowCandidate) {
        let result = this.isValidMonth(rowCandidate.month) && this.isValidNumber(rowCandidate.budget);
        return result;
    }

    parseRowData = () => {
        this.budgets = {}
        this.resetFilterIndex();
        do {
            let arrFilter = Object.entries(this.currentFilter());
            let arr = {}
            // console.log('Parsing with filter,', this.currentFilter())
            // 0 should be replaced by first row where it has valid values
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
                // console.log('arr', arr.month)
                if (this.isValidExpenseRow(arr)) {
                    this.parsedRows.push(this.cleanExpenseRecord(arr, this.currentFilter(), this.budgets, this.filteredByCategoryMonth))
                    arr = {}
                } else if (this.isValidBudgetRow(arr)) {
                    this.processBudgetRow(arr, this.budgets)
                }
            }

            // console.log('budgets', this.budgets)
        }
        while (this.selectNextFilter(false))

        // console.log('parsedRows:', this.parsedRows)
        // console.log('filteredByCategoryMonth', this.filteredByCategoryMonth)

    }

    processBudgetRow(parsedRecord, budgets) {
        this.cleanBudgetRecord(parsedRecord, budgets)
        // console.log('matched budget row', parsedRecord, this.budgets)
    }

    cleanBudgetRecord(parsedRecord, budgets) {

        parsedRecord.monthString = this.getMonthString(parsedRecord.month)

        if (parsedRecord.category === '') {
            parsedRecord.category = 'payment topup';
        }
        if (parsedRecord.budget !== undefined) {
            parsedRecord.budget = this.parseNumber(parsedRecord.budget)
            if (budgets[parsedRecord.monthString] === undefined) {
                budgets[parsedRecord.monthString] = {}
            }
            if (budgets[parsedRecord.monthString][parsedRecord.category] === undefined) {
                budgets[parsedRecord.monthString][parsedRecord.category] = 0;
            }
            budgets[parsedRecord.monthString][parsedRecord.category] += parsedRecord.budget
        }

        // console.log('budgets', this.budgets)
        return parsedRecord
    }

    getMonthString(dateObj) {
        let leading0 = dateObj.getMonth() + 1 < 10 ? '0' : ''
        return `${dateObj.getFullYear()}-${leading0}${dateObj.getMonth() + 1}`
    }

    cleanExpenseRecord(parsedRecord, filter) {
        //Cleaning Month
        parsedRecord.monthString = this.getMonthString(parsedRecord.month)

        if (!filter.direct.certain) {
            parsedRecord.direct = true
        }

        // parsing empty string values
        let calculatedOwed = null;
        if (parsedRecord.estimate !== undefined) {
            parsedRecord.estimate = this.parseNumber(parsedRecord.estimate)
            calculatedOwed = parsedRecord.estimate
        }
        if (parsedRecord.actual !== undefined) {
            parsedRecord.actual = this.parseNumber(parsedRecord.actual)
            calculatedOwed = parsedRecord.actual
        }
        if (parsedRecord.owed !== undefined) {
            parsedRecord.owed = this.parseNumber(parsedRecord.owed)
        } else {
            parsedRecord.owed = calculatedOwed
        }

        if (!filter.paid.certain) {
            parsedRecord.paid = this.parseNumber(parsedRecord.actual)
        } else if (parsedRecord.paid !== undefined) {
            parsedRecord.paid = this.parseNumber(parsedRecord.paid)
        }
        if (parsedRecord.forecast !== undefined) {
            parsedRecord.forecast = this.parseNumber(parsedRecord.forecast)
        }
        if (parsedRecord.category === '') {
            parsedRecord.category = 'payment topup';
        }

        return parsedRecord
    }

    buildSESView = (parsedRows) => {
        let result = {}
        for (let i = 0; i < parsedRows.length; i++) {
            let row = parsedRows[i]
            if (!result.hasOwnProperty(row.category)) {
                result[row.category] = {}
            }

            if (!result[row.category].hasOwnProperty(row.monthString)) {
                result[row.category][row.monthString] = {
                    actual: 0,
                    forecast: 0,
                    budget: 0
                }
            }

            if (row.actual !== undefined) {
                result[row.category][row.monthString]['actual'] += row.actual
            }
            if (row.forecast !== undefined) {
                result[row.category][row.monthString]['forecast'] += row.forecast
            }
            if (row.budget !== undefined) {
                result[row.category][row.monthString]['budget'] += row.budget
            }

        }
        // console.log('result', result)
        return result;
    }

    buildSFView(indexByCategoryByMonth) {
        let months = this.addThreeMonths(this.getMonths())
        let result = {};

        months.forEach(month => {
            result = this.addSfTableSection(result, indexByCategoryByMonth, month);
        })
        delete result._newRow

        return result;
    }

    addSfTableSection(sfTable, indexByCategoryByMonth, month) {
        let result = JSON.parse(JSON.stringify(sfTable));

        if (result._newRow === undefined) {
            result._newRow = {}
        }

        result._newRow[month] = {
            actual: 0,
            forecast: 0,
            budget: 0
        }

        // not all categories have same month
        for (const category in indexByCategoryByMonth) {
            // console.log('category', category);
            if (result[category] === undefined) {
                result[category] = JSON.parse(JSON.stringify(result._newRow))
            }
            if (result[category][month] === undefined) {
                result[category][month] = {}
            }

            if (indexByCategoryByMonth[category][month] === undefined) {
                result[category][month]['actual'] = 0
                result[category][month]['forecast'] = 0
            } else {
                result[category][month].actual = indexByCategoryByMonth[category][month]['actual']
                result[category][month].forecast = indexByCategoryByMonth[category][month]['forecast']
            }

            if (this.budgets[month] === undefined || this.budgets[month][category] === undefined) {
                result[category][month]['budget'] = 0
            } else {
                result[category][month].budget = this.budgets[month][category]
            }
        }
        // console.log('new sfTable', result)

        return result;
    }



    addThreeMonths(monthsArr) {
        let months = [...monthsArr]
        let lastMonth = months[months.length - 1]
        let toNumber = lastMonth.split('-');
        let year = Number(toNumber[0])
        let month = Number(toNumber[1])

        let leading0 = month < 10 ? '0' : '';

        let monthString = leading0 + String(month);
        let yearString = String(year);


        for (let i = 1; i <= 3; i++) {
            let newMonth = month + i;
            let leading0 = newMonth < 10 ? '0' : '';
            monthString = leading0 + String(newMonth)

            if (newMonth > 12) {
                yearString = String(year + 1)
            }
            if (newMonth === 13) {
                monthString = '01'
            }
            if (newMonth === 14) {
                monthString = '02'
            }
            if (newMonth === 15) {
                monthString = '03'
            }
            let result = yearString.concat('-').concat(monthString)
            months.push(result)
        }
        return months;
    }

    filterByMonth = () => {
        let months = this.getMonths()
        for (let i = 0; i < months.length; i++) {
            let month = this.parsedRows.filter(object => {
                return object.monthString === months[i]
            })
            this.filteredByMonth[months[i]] = month;
        }
        // console.log('filteredByMonth', this.filteredByMonth)

    }

    getMonths = () => {
        let duplicateTags = [];
        for (const object of this.parsedRows) {
            if (object.monthString !== undefined)
                duplicateTags.push(object.monthString)
        }
        return [...new Set(duplicateTags)];

    }



    matchesFilterTag(cellData, tag) {
        let t = cellData.toString().toLowerCase().trim();
        return t == tag

    }

    tryParseFilterRow = (arr, rowIndex) => {
        // console.log('arr in tryParse', arr)
        this.resetFilterIndex();
        for (let i = 0; i < arr.length; i++) {
            if (this.matchesFilterTag(arr[i], '!next')) {
                this.selectNextFilter();
                // console.log('selecting next Filter', this.filterIndex)
            }
            let filterArr = Object.entries(this.currentFilter())
            for (let j = 0; j < filterArr.length; j++) {
                if (this.matchesFilterTag(arr[i], filterArr[j][1]['labels'][0])) {
                    this.currentFilter()[filterArr[j][0]].certain = true;
                    this.currentFilter()[filterArr[j][0]].column = i;
                    this.currentFilter()[filterArr[j][0]].index = rowIndex;
                    // console.log('Matched column', this.currentFilter()[filterArr[j][0]])
                }
            }
        }
    }

    // coerce data types
    parseNumber = (anyNumber) => {
        const regex = /[^,]*/g;
        let number = anyNumber;
        // console.log(`number ${number} state: ${number === ''}`)
        if (!isNaN(anyNumber)) {
            return anyNumber
        }
        if (number === '') {
            return 0
        } else if (typeof anyNumber === 'string' || anyNumber instanceof String) {
            return parseFloat(number.match(regex).join(''));
        } else {
            return 0;
        }
    }

    tryParseNumber(numberString) {
        const regex = /[^,]*/g;
        if (typeof numberString !== 'string' || numberString.length < 1) {
            if (numberString === '')
                return 0
            return numberString
        }

        let result = parseFloat(numberString.match(regex).join(''));
        return isNaN(result) ? numberString : result;

    }


    // parse the direct into boolean
    tryParseBoolean(directValue) {
        if (!isNaN(directValue)) {
            return directValue > 0
        }
        if (directValue === '1') {
            return true
        }
        return false
    }

    tryParseMonth(serialNum) {
        // console.log('input date ', serialNum)
        serialNum = String(serialNum).split(".");
        var ogDate;
        var oneDay = 24 * 60 * 60 * 1000;
        var firstDate = new Date(1899, 11, 30);
        // console.log('serialNum[0]', serialNum)
        var days = parseFloat(serialNum[0]);
        if (isNaN(days) || days < 40000 || days > 50000) {
            return null;
        }
        var ms = 0;
        if (serialNum.length > 1) {
            ms = parseFloat(serialNum[1]) * oneDay;
            ms = String(ms).substring(0, 8);
        }

        // console.log('firstDate', firstDate.getDate(), firstDate.getDate() + days, days)

        firstDate.setDate(firstDate.getDate() + days);


        ogDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), 0, 0, 0, ms);
        // console.log(ogDate);
        return ogDate;
    }

}


// it should only match rows after the tag is applied