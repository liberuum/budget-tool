// import { get } from './mongodb.js';
import Mustache from 'mustache';
// import fs from 'fs';


export default class MdExporter {
    expenseTags = []

    constructor(expenseTags) {
        this.expenseTags = expenseTags
    }

    actuals = []

    template = `
| Budget Category               | Forecast           | Actuals            | Difference          | Payments       |
| ---------------------------   | -----------------: | -----------------: | ------------------: | -------------: |
|                               | -                  | -                  | -                   |                |
`;

    tableRows = '';
    item = ''

    // async fetchActuals() {
    //     this.actuals = await get('novemberActuals');
    // }

    getActuals(actuals) {
        this.actuals = actuals;
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
        for (const obj of this.actuals) {
            // console.log(obj)
            for (const key in obj) {
                if (key === expenseTag)
                    // console.log(obj[key].toString())
                    if (typeof obj[key] === 'number') {
                        this.item += ` ${obj[key].toFixed(2)} |`
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

    // exportToMd() {
    //     let output = Mustache.render(this.template);
    //     fs.writeFileSync('./actuals.md', output);
    //     console.log('Created/Updated actuals.md')
    // }

}