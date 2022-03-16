import Processor from './processor.js'
import CrunchData from './crunchData.js';
import MdExporter from './mdExporter.js';
import SfMdExporter from './sfMdExporter.js';

export default async function processData(rawData) {
    const processor = new Processor();
    processor.getRawData(rawData);
    processor.processData()

    // Getting actuals by month
    const crunchData = new CrunchData();
    const actualsByMonth = {};
    const expenseTagsByMonth = {}

    for (const month in processor.filteredByMonth) {
        crunchData.getData(processor.filteredByMonth[month])
        actualsByMonth[month] = crunchData.crunchData();
        expenseTagsByMonth[month] = crunchData.expenseTags
        crunchData.actuals = []
        crunchData.data = []
    }

    //Getting MDText by month
    let mdTextObj = {}
    const mdTextByMonth = []

    const sfMdExporter = new SfMdExporter()
    sfMdExporter.getCategoriesByMonth(processor.leveledMonthsByCategory)


    for (const month in actualsByMonth) {
        const mdExporter = new MdExporter(expenseTagsByMonth[month]);
        mdExporter.getActuals(actualsByMonth[month]);
        // console.log('actuals in md', mdExporter.actuals)
        // console.log('expenseTags in md', mdExporter.expenseTags)
        mdExporter.buildTableRowObject();
        mdTextObj[month] = mdExporter.getMdData();
        mdTextByMonth.push(mdTextObj);
        mdTextObj = {}
    }


    return { actualsByMonth, mdTextByMonth };
}