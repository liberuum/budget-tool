import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();

const uri = process.env.CONNECTION_STRING;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();

        const database = client.db('cuBudgets');
        const budgetLineItems = database.collection('budgetLineItems');

        // query for a budget line item with 'Exchange Rate' itemName
        const query = { itemName: 'Exchange Rate' }
        const budgetItem = await budgetLineItems.findOne(query,)

        console.log('Result: ', budgetItem)

    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
}

export async function addData(data, collection) {
    try {
        await client.connect();
        let result;

        const database = client.db('cuBudgets');
        const collectionName = database.collection(collection);

        result = await collectionName.deleteMany({});

        const options = { ordered: true };
        result = await collectionName.insertMany(data, options);

        console.log(`${result.insertedCount} documents were inserted`)

    } catch (e) {
        console.error(e)
    }
    finally {
        await client.close()
    }
}

export async function get(collection) {
    let output = []
    try {
        await client.connect();

        const database = client.db('cuBudgets');
        const collectionName = database.collection(collection);

        let lineItems = collectionName.find({})

        for await (const lineItem of lineItems) {
            // console.log(lineItem)
            output.push(lineItem);
        }


        return output;
        // console.log(output)
    } catch (e) {
        console.error(e)
    } finally {
        await client.close();
    }
}

async function getAll() {
    let output = [];
    try {
        await client.connect();

        const database = client.db('cuBudgets');
        const budgetLineItems = database.collection('budgetLineItems');

        let lineItems = budgetLineItems.find({})

        for await (const lineItem of lineItems) {
            // console.log(lineItem)
            output.push(lineItem);
        }

        return output;
    } catch (e) {
        console.error(e)
    } finally {
        await client.close();
    }
}

// run().catch(console.dir);
// let dbData = await getAll()
// console.log('dbData: ', dbData);
