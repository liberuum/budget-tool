import Processor from './processor.js'
import CrunchData from './crunchData.js';
import MdExporter from './mdExporter.js';

export default async function processData(rawData) {
    const processor = new Processor();
    processor.getRawData(rawData);
    const processedData = processor.processData()
   
    const crunchData = new CrunchData();
    const actuals = crunchData.crunchData(processedData);

    const mdExporter = new MdExporter(crunchData.expenseTags);
    mdExporter.getActuals(actuals)
    mdExporter.buildTableRowObject();
    mdExporter.getMdData()
}