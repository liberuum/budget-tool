import { get } from './mongodb.js';
import Mustache from 'mustache';
import fs from 'fs';


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

    async fetchActuals() {
        this.actuals = await get('novemberActuals');
    }

    buildTableRowObject() {
        this.expenseTags.forEach(tag => {
            // console.log(item += `|${tag}|`);
            this.item += `|${tag}|`
            this.iterate(tag)
            // console.log('item', item)
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

    // console.log('item', item)



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


    exportToMd() {
        let output = Mustache.render(this.template);
        fs.writeFileSync('./actuals.md', output);
        console.log('Created/Updated actuals.md')
    }



}


// const actuals = await get('novemberActuals');


// console.log('expenseTags', expenseTags);

// console.log('Actuals', actuals);


// let template = `
// | Budget Category               | Forecast           | Actuals            | Difference          | Payments       |
// | ---------------------------   | -----------------: | -----------------: | ------------------: | -------------: |
// |                               | -                  | -                  | -                   |                |
// `;


// let tableRows = '';
// let item = ''

// export function buildTableRowObject(expenseTags) {
//     expenseTags.forEach(tag => {
//         // console.log(item += `|${tag}|`);
//         item += `|${tag}|`
//         iterate(tag)
//         // console.log('item', item)
//         item += '\n'
//         tableRows += item;
//         item = ''
//     });

//     item += '| **Total** |';
//     iterate('total')
//     tableRows += item;
//     item = ''

//     template += tableRows;
// }

// console.log('item', item)



// function iterate(expenseTag) {
//     for (const obj of actuals) {
//         // console.log(obj)
//         for (const key in obj) {
//             if (key === expenseTag)
//                 // console.log(obj[key].toString())
//                 item += ` ${obj[key].toString()} |`
//         }
//     }
// }


// buildTableRowObject();
// console.log('tableRow', tableRows);

// console.log(template)


