import { getBudgetLineItems } from '../../api/graphql';

let lineItems = [];
const validatedLineItems = [
    {
        "budgetStatementWalletId": "146",
        "month": "2021-06-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Deposits",
        "forecast": 14754.1,
        "actual": 15754.1,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "146",
        "month": "2021-06-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Gas Fees",
        "forecast": 350,
        "actual": 350,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "146",
        "month": "2021-06-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Software Costs",
        "forecast": 250,
        "actual": 144,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "146",
        "month": "2021-06-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Contractor fees",
        "forecast": 17300,
        "actual": 17233,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "146",
        "month": "2021-06-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Employee salaries",
        "forecast": 4918.03,
        "actual": 4950,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "146",
        "month": "2021-06-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Fees & Salary costs",
        "forecast": 5850,
        "actual": 6223.02,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "146",
        "month": "2021-06-01",
        "position": 0,
        "group": "",
        "budgetCategory": "payment topup",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "146",
        "month": "2021-06-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Events & Activities",
        "forecast": 0,
        "actual": 1750,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "146",
        "month": "2021-06-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Travel Costs",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "147",
        "month": "2021-07-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Deposits",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "147",
        "month": "2021-07-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Gas Fees",
        "forecast": 450,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "147",
        "month": "2021-07-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Software Costs",
        "forecast": 226,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "147",
        "month": "2021-07-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Contractor fees",
        "forecast": 22915.81,
        "actual": 7198,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "147",
        "month": "2021-07-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Employee salaries",
        "forecast": 4918.03,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "147",
        "month": "2021-07-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Fees & Salary costs",
        "forecast": 5850,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "147",
        "month": "2021-07-01",
        "position": 0,
        "group": "",
        "budgetCategory": "payment topup",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "147",
        "month": "2021-07-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Events & Activities",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "147",
        "month": "2021-07-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Travel Costs",
        "forecast": 8000,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "148",
        "month": "2021-08-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Deposits",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "148",
        "month": "2021-08-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Gas Fees",
        "forecast": 450,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "148",
        "month": "2021-08-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Software Costs",
        "forecast": 226,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "148",
        "month": "2021-08-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Contractor fees",
        "forecast": 17300,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "148",
        "month": "2021-08-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Employee salaries",
        "forecast": 4918.03,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "148",
        "month": "2021-08-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Fees & Salary costs",
        "forecast": 6400,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "148",
        "month": "2021-08-01",
        "position": 0,
        "group": "",
        "budgetCategory": "payment topup",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "148",
        "month": "2021-08-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Events & Activities",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "148",
        "month": "2021-08-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Travel Costs",
        "forecast": 8000,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "149",
        "month": "2021-09-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Deposits",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "149",
        "month": "2021-09-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Gas Fees",
        "forecast": 450,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "149",
        "month": "2021-09-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Software Costs",
        "forecast": 226,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "149",
        "month": "2021-09-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Contractor fees",
        "forecast": 17300,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "149",
        "month": "2021-09-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Employee salaries",
        "forecast": 4918.03,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "149",
        "month": "2021-09-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Fees & Salary costs",
        "forecast": 6400,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "149",
        "month": "2021-09-01",
        "position": 0,
        "group": "",
        "budgetCategory": "payment topup",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "149",
        "month": "2021-09-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Events & Activities",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    },
    {
        "budgetStatementWalletId": "149",
        "month": "2021-09-01",
        "position": 0,
        "group": "",
        "budgetCategory": "Travel Costs",
        "forecast": 0,
        "actual": 0,
        "comments": ""
    }
]

const getWalletIds = (lineItems) => {
    let ids = [];
    for (let lineItem of lineItems) {
        ids.push(lineItem.budgetStatementWalletId);
    }
    const uniqueIds = [...new Set(ids)];
    return uniqueIds;
}

export const validateLineItems = async (selectedLineItems) => {
    lineItems = [...selectedLineItems];

    try {
        let lineItemsToUpload = [];
        let lineItemsToOverride = []
        const uniqueWalletIds = getWalletIds(lineItems)

        //Checking lineItems per month (walletId)
        for (let walletId of uniqueWalletIds) {
            const rawApiLineItems = await getBudgetLineItems(walletId);
            const apiLineItems = rawApiLineItems.data.budgetStatementLineItem
            const localLineItems = lineItems.filter(lineItem => {
                return lineItem.budgetStatementWalletId === walletId
            });

            if (!apiLineItems.length == 0) {
                for (let i = 0; i < localLineItems.length; i++) {
                    if (apiLineItems[i] == undefined) {
                        continue
                        
                    } else if (localLineItems[i].budgetCategory === apiLineItems[i].budgetCategory &&
                        localLineItems[i].forecast === apiLineItems[i].forecast &&
                        localLineItems[i].actual === apiLineItems[i].actual) {
                      
                    }
                    else {
                        if (localLineItems[i].budgetCategory === apiLineItems[i].budgetCategory) {
                            console.log('not same, adding to override list')
                            localLineItems[i].id = apiLineItems[i].id
                            lineItemsToOverride.push(localLineItems[i])
                        }
                    }
                }

            } else {
                lineItemsToUpload.push(...localLineItems)
            }
        }
        return { lineItemsToOverride, lineItemsToUpload }
    } catch (error) {
        console.error(error)
    }


};

validateLineItems(validatedLineItems);