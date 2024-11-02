// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// Middleware to add authorization header dynamically
const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('token') || '';
    operation.setContext({
        headers: {
            authorization: token,
        },
    });
    return forward(operation);
});

// Link to your GraphQL server
const httpLink = new HttpLink({
    uri: 'http://localhost:5000/graphql', // Replace with your GraphQL API endpoint
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
