import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
} from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://ecosystem-dashboard.herokuapp.com/graphql',
    cache: new InMemoryCache()
});

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
            }
        });
        return budgetStatements;
    } catch (error) {
        console.error(error)
    }
}


export const addBudgetStatements = async (budgetStatements) => {

    const client = new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        cache: new InMemoryCache()
    });

    try {
        client.mutate({
            mutation: gql`
                mutation BudgetStatementsBatchAdd($input: [BudgetStatementInput]) {
                    budgetStatementsBatchAdd(input: $input) {
                        errors {
                            message
                        }
                        budgetStatement {
                            id
                        }
                        
                    }
                }
            `,
            variables: {
                input: budgetStatements
            }
        })
    } catch (error) {
        console.error(error)
    }

}