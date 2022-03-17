import Mustache from 'mustache';

export default class SfMdExporter {

    constructor() {
    }
    months = [];
    categoriesByMonth;
    expenseTags = [];
    tableRows = '';
    item = '';
    mdByMonth = {}

    template = `
| Expense Category| Actual | Forecast | Budget  |Actual | Forecast  | Budget  |Actual | Forecast | Budget  |Actual | Forecast  | Budget  |
| ----------------| -----: | -------: | ------: |-----: | --------: | ------: |-----: | -------: | ------: |-----: | --------: | ------: |
`;

    getCategoriesByMonth(categoriesByMonth) {
        this.categoriesByMonth = categoriesByMonth;
        // console.log('categories by month', this.categoriesByMonth)
        this.getExpenseTags()
        this.getMonths()
        this.loopOverExpenseTags()
    }

    getExpenseTags() {
        let arrCategoriesByMonth = Object.entries(this.categoriesByMonth)

        for (let [key, value] of arrCategoriesByMonth) {
            this.expenseTags.push(key)
        }

        // console.log('expense Tags', this.expenseTags)
    }

    getMonths() {
        let months = []
        this.expenseTags.forEach(tag => {
            for (let [key, value] of Object.entries(this.categoriesByMonth[tag])) {
                months.push(key)
            }
        })
        this.months = [...new Set(months)]
        // console.log('months', this.months)
    }


    loopOverExpenseTags() {
        let months = this.months;
        for (let i = 0; i < months.length; i++) {
            let threeMonths = months.slice(i + 1, i + 4);
            console.log('threeExtraMonths', threeMonths)

            // adding month strings to table 
            this.item += `| | ${months[i]} | | |`
            threeMonths.forEach(newMonth => {
                this.item += `${newMonth} | | |`
            })
            this.item += `\n`;

            this.expenseTags.forEach(tag => {
                if (this.categoriesByMonth[tag][months[i]] !== undefined) {


                    // console.log('tags', tag, this.categoriesByMonth[tag][month]['actual'])
                    this.item += `|${tag}|`


                    this.item += `${this.categoriesByMonth[tag][months[i]]['actual'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|`
                    this.item += `${this.categoriesByMonth[tag][months[i]]['forecast'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|`
                    this.item += `${this.categoriesByMonth[tag][months[i]]['budget'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|`
                    // from month + 3 loop, add again 3 times the above actual, forecast and budget together
                    threeMonths.forEach(newMonth => {
                        this.item += `${this.categoriesByMonth[tag][newMonth]['actual'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|`
                        this.item += `${this.categoriesByMonth[tag][newMonth]['forecast'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|`
                        this.item += `${this.categoriesByMonth[tag][newMonth]['budget'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|`

                    })

                    this.item += `\n`;
                    this.tableRows += this.item;
                    this.item = ''
                }
            })
            let monthTemplate = this.template
            monthTemplate += this.tableRows;
            this.tableRows = ''

            this.mdByMonth[months[i]] = Mustache.render(monthTemplate);

        }



        console.log('mdByMonth', this.mdByMonth)
    }



    getMdData() {
        let output = Mustache.render(this.template);
        return output;
    }
}