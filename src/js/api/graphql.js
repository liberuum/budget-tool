import {
    ApolloClient,
    InMemoryCache,
    gql
} from "@apollo/client";

let client;
setupClient()

async function setupClient() {
    const isDev = await electron.getIsDev();
    client = new ApolloClient({
        uri: isDev ? 'https://publish-dev-vpighsmr70zxa92r9w.herokuapp.com/graphql' : 'https://ecosystem-dashboard.herokuapp.com/graphql',
        cache: new InMemoryCache()
    });
}

export const GET_CORE_UNITS = gql`
    query getCoreUnits {
     coreUnits {
        id
        code
        name
  }
}
`;

export async function getCoreUnits() {
    const cus = client.query({
        query: gql`
            query getCoreUnits {
                coreUnits {
                     code
                     name
                 }
            }
            `
    });
    return cus;
}

export const GET_CORE_UNIT = gql`
    query getCoreUnit($filter: CoreUnitFilter) {
     coreUnit(filter: $filter) {
        id
        code
        name
  }
}
`;

export const getCoreUnit = async (id) => {
    try {
        const cu = client.query({
            query: gql`
                query getCoreUnit($filter: CoreUnitFilter){
                    coreUnit(filter: $filter) {
                        id
                        code
                        name
                        shortCode
                    }
                }
            `,
            variables: {
                filter: {
                    id
                }
            }
        });

        return cu;
    } catch (error) {
        console.error(error)
    }
}

export const getBudgetSatementInfo = async (cuId) => {
    try {
        const budgetStatements = client.query({
            query: gql`
                query BudgetStatement($filter: BudgetStatementFilter) {
                    budgetStatement(filter: $filter) {
                        id
                        cuId
                        month
                        budgetStatementWallet {
                            id
                            name
                            address
                            budgetStatementLineItem {
                                id
                                budgetStatementWalletId
                                month
                                position
                                group
                                budgetCategory
                                forecast
                                actual
                                comments
                            }
                        }
                    }
                }
            `,
            variables: {
                filter: {
                    cuId
                }
            },
            fetchPolicy: 'no-cache'
        });
        return budgetStatements;
    } catch (error) {
        console.error(error)
    }
}


export const addBudgetStatements = async (budgetStatements, authToken) => {
    try {
        const result = await client.mutate({
            mutation: gql`
                mutation BudgetStatementsBatchAdd($input: [BudgetStatementBatchAddInput]) {
                    budgetStatementsBatchAdd(input: $input) {
                            id
                            cuId
                            month
                            budgetStatementWallet {
                                id
                                name
                                address
                            }
                    }
                }
            `,
            variables: {
                input: budgetStatements
            },
            fetchPolicy: 'no-cache',
            context: {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        })
        return result;
    } catch (error) {
        console.error(error)
    }

}

export const deleteBudgetLineItems = async (lineItems, authToken) => {
    try {
        const result = await client.mutate({
            mutation: gql`
                mutation Mutation($input: [LineItemsBatchDeleteInput]) {
                    budgetLineItemsBatchDelete(input: $input) {
                        id
                    }
                }
            `,
            variables: {
                input: lineItems
            },
            fetchPolicy: 'no-cache',
            context: {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        })
        return result;
    } catch (error) {
        console.error(error)
    }
}

export const updateBudgetLineItem = async (lineItem, authToken) => {
    try {
        const result = await client.mutate({
            mutation: gql`
                mutation BudgetLineItemUpdate($input: LineItemUpdateInput) {
                    budgetLineItemUpdate(input: $input) {
                        id
                        budgetCategory
                    }
                }
            `,
            variables: {
                input: lineItem
            },
            fetchPolicy: 'no-cache',
            context: {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        })
        return result;
    } catch (error) {
        console.error(error)
    }
}

export const updateBudgetLineItems = async (lineItems, authToken) => {
    try {
        const result = await client.mutate({
            mutation: gql`
                mutation BudgetLineItemsBatchUpdate($input: [LineItemsBatchUpdateInput]) {
                    budgetLineItemsBatchUpdate(input: $input) {
                        id
                        comments
                        budgetCategory
                    }
                }
            `,
            variables: {
                input: lineItems
            },
            fetchPolicy: 'no-cache',
            context: {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        })
        return result;
    } catch (error) {
        console.error(error)
    }
}

export const addBudgetStatementWallets = async (budgetStatementWallets, authToken) => {
    try {
        const result = await client.mutate({
            mutation: gql`
                mutation BudgetStatementWalletBatchAdd($input: [BudgetStatementWalletBatchAddInput]) {
                    budgetStatementWalletBatchAdd(input: $input) {
                        id
                        budgetStatementId
                    }
                }
            `,
            variables: {
                input: budgetStatementWallets
            },
            context: {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        });
        return result;

    } catch (error) {
        console.error(error)
    }
};

export const getBudgetLineItems = async (walletId, month) => {
    try {
        const result = client.query({
            query: gql`
                query BudgetStatementLineItem($filter: BudgetStatementLineItemFilter) {
                    budgetStatementLineItem(filter: $filter) {
                        id
                        budgetStatementWalletId
                        month
                        position
                        group
                        budgetCategory
                        forecast
                        actual
                        comments
                    }
                }
            `,
            variables: {
                filter: {
                    budgetStatementWalletId: walletId,
                    month: month ? month : undefined
                }
            },
            fetchPolicy: 'no-cache'
        });
        return result;
    } catch (error) {
        console.error(error)
    }
}

export const getBudgetToolVersion = async () => {
    try {
        const result = client.query({
            query: gql`
                query latestQuery {
                    latestBudgetToolVersion {
                        id
                        version
                        link
                }
            }
            `
        });
        return result;
    } catch (error) {
        console.error(object)
    }
}