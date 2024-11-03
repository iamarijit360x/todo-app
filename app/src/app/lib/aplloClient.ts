// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
console.log(process.env.REACT_APP_BACKEND_URL)

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
    uri: process.env.NEXT_PUBLIC_BACKEND_URL, // Replace with your GraphQL API endpoint
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
