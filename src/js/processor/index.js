import Processor from './processor.js'
import CrunchData from './crunchData.js';
import MdExporter from './mdExporter.js';

const processor = new Processor();
await processor.getRawData()
processor.processData()
await processor.addDataToDb()

const crunchData = new CrunchData();
await crunchData.fetchDbData();
crunchData.crunchData();
await crunchData.uploadData()

const mdExporter = new MdExporter(crunchData.expenseTags);
await mdExporter.fetchActuals();
mdExporter.buildTableRowObject();
mdExporter.exportToMd();




//TODO
// add data json to database ( mongo) - DONE
// find best ways to coerce into right types - DONE
// line item from db and create report data- DONE
// push report data back to db in JSON - DONE
// as another process: pull report data and export as another output ( MD or JSON)
// push report back to database

 // look at DUX transparency report
 // Start with DUX OCtober
 // https://github.com/makerdao-dux/transparency-reporting/blob/main/Monthy%20Budget%20Statements/2021-10.md
 // permanent team table + actuals table = given current month as input




 // next steps:
 // publish code on github and document the process