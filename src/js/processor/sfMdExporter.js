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
| Expense Category              | Actual             | Forecast           | Budget              |
| ---------------------------   | -----------------: | -----------------: | ------------------: |
`;

    // create mds by months, create new object with months and md text under each month, 
    // later in the md view, we just pull current month and next 3 months. 
    // if month doesn't exists, we create new empty months. 

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

    buildRow() {
        this.expenseTags.forEach(tag => {
            this.item += `|${tag}|`
        })
    }

    loopOverExpenseTags() {
        this.months.forEach(month => {
            this.expenseTags.forEach(tag => {
                if (this.categoriesByMonth[tag][month] !== undefined) {
                    // console.log('tags', tag, this.categoriesByMonth[tag][month]['actual'])
                    this.item += `|${tag}|`
                    this.item += `${this.categoriesByMonth[tag][month]['actual'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|`
                    this.item += `${this.categoriesByMonth[tag][month]['forecast'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|`
                    this.item += `${this.categoriesByMonth[tag][month]['budget'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|`
                    this.item += `\n`;
                    this.tableRows += this.item;
                    this.item = ''
                }
            })
            let monthTemplate = this.template
            monthTemplate += this.tableRows;
            this.tableRows = ''

            this.mdByMonth[month] = Mustache.render(monthTemplate);

        })
        // console.log('mdByMonth', this.mdByMonth)
    }


    buildTableRowObject() {
        this.expenseTags.forEach(tag => {
            this.item += `|${tag}|`
            this.iterate(tag)
            this.item += '\n'
            this.tableRows += this.item;
            this.item = ''
        });

        this.item += '| **Total** |';
        this.iterate('total')
        this.tableRows += this.item;
        this.item = ''

        this.template += this.tableRows;
    }



    iterate(expenseTag) {
        for (const obj of this.categoriesByMonth) {
            // console.log(obj)
            for (const key in obj) {
                if (key === expenseTag)
                    // console.log(obj[key].toString())
                    if (typeof obj[key] === 'number') {
                        this.item += ` ${obj[key].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} |`
                    } else {
                        this.item += ` ${obj[key].toString()} |`
                    }
            }
        }
    }

    getMdData() {
        let output = Mustache.render(this.template);
        return output;
    }
}