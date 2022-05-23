import { addBudgetStatements } from '../../api/graphql';
let statementMonths;
let spreadSheetMonths;
let coreUnit;



export const validateMonthsInApi = (budgetStatements, months, cu) => {
    statementMonths = budgetStatements;
    spreadSheetMonths = months;
    coreUnit = cu;

    statementMonths = statementMonths.map(statement => {
        return statement.month;
    })

    spreadSheetMonths = spreadSheetMonths.map(month => {
        return month.concat('-01');
    })

    updateApiToMissingMonths()
}


// verify if API includes months from spreadsheets, add missing months to arr for api later update
const getMissingMonths = () => {
    let missingMonths = []
    for (let month of spreadSheetMonths) {
        if (statementMonths.includes(month) === false) {
            missingMonths.push(month)
        }
    }


    return missingMonths;
}

const updateApiToMissingMonths = async () => {
    const months = getMissingMonths();
    months.push("2021-01-01")
    months.push("2021-02-01")
    if (months.length == 0) {
        console.log('no need to add new data')
    } else {
        addBudgetStatementToApi(months)
    }
}

const addBudgetStatementToApi = (months) => {
    try {
        const rows = [];

        for (let month of months) {
            const row = {
                cuId: coreUnit.id,
                cuCode: coreUnit.code,
                month: month,
                comments: '',
                budgetStatus: 'Draft',
                publicationUrl: ''
            }
            rows.push(row)
        }
        addBudgetStatements(rows)
    } catch (error) {
        console.error(error)
    }
}
