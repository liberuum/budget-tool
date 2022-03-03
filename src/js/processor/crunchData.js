export default class CrunchData {
    data = [];
    expenseTags = [];

    actuals = [];

    constructor() { };



    sumValues(keyName, expenseTag, dataObject) {
        let total = 0;
        for (const object of dataObject) {
            if (object['category'] === expenseTag) {
                total += object[keyName]
            }
            // console.log(object[keyName])
        }
        return total;
    }

    getTotalByBudgetVariance(budgetVarianceObj) {
        let total = 0;
        for (const [key, value] of Object.entries(budgetVarianceObj)) {
            if (key !== 'type')
                total += value
        }
        total = Math.round((total + Number.EPSILON) * 100) / 100;
        return total;
        // console.log('total', total)
    }

    getTotalPaidDaiByEmptyBudgetCategory() {
        let total = 0;
        for (const obj of this.data) {
            if (obj['category'] === '' && obj['paid'] !== 0) {
                total += obj['paid']
            }
        }
        return total;
    }

    getExpenseTags() {
        let duplicateTags = [];
        let expenseTags = []
        for (const object of this.data) {
            if (object['category'] !== "") {
                duplicateTags.push(object['category'])

            }
        }
        // remove duplicates
        expenseTags = [...new Set(duplicateTags)];
        return expenseTags;

    }

    setForecastByExpenseTag() {
        const type = 'forecast';
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.data)
        }
        // console.log('total forecast', totalByExpenseTag)
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }

    setActualsByExpenseTag() {
        const type = 'actual';
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.data)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }

    setDifferenceByExpenseTag() {
        const type = 'difference';
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.data)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }

    setPaymentsByExpenseTag() {
        const type = 'paid'
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.data)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        totalByExpenseTag.total += this.getTotalPaidDaiByEmptyBudgetCategory()
        this.actuals.push(totalByExpenseTag)
    }

    getActAndDiff() {
        let actAndDiff = {};
        // extract actual and forecast object
        for (const type of ['actual', 'forecast'])
            for (const actual of this.actuals) {
                if (actual.type === type)
                    actAndDiff[type] = actual;
            }

        return actAndDiff

    }

    calcDifference() {
        let actAndDiff = this.getActAndDiff()
        let differenceObj = {
            type: 'difference'
        }
        for (const tag of this.expenseTags) {
            differenceObj[tag] = actAndDiff.actual[tag] - actAndDiff.forecast[tag];
        }
        differenceObj.total = actAndDiff.actual.total - actAndDiff.forecast.total;

        this.actuals.push(differenceObj)
    }


    crunchData() {
        this.setForecastByExpenseTag();
        this.setActualsByExpenseTag();
        this.calcDifference()
        this.setPaymentsByExpenseTag();
        return this.actuals;
    }

    // async uploadData() {
    //     console.log('Storing Actuals');
    //     await addData(this.actuals, 'novemberActuals')
    // }

    async getData(filteredByMonth) {
        this.data = []
        this.data = filteredByMonth
        this.expenseTags = this.getExpenseTags()
        // console.log('raw data for crunching',this.data)

    }

    // console.log(await get('novemberActuals')); 

}



