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

const GET_CORE_UNITS = gql`
    query getCoreUnits {
     coreUnits {
        code
        name
  }
}
`

export function getCoreUnits() {

    client.query({
        query: gql`
            query getCoreUnits {
                coreUnits {
                     code
                     name
                 }
            }
            `
    }).then(result => {
        console.log('result', result)
    })
    
}