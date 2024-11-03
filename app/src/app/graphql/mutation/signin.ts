// src/graphql/mutations/login.ts
import { gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
    mutation Login($loginUserInput: LoginUserInput!) {
        login(loginUserInput: $loginUserInput) {
            token
            user {
                _id
                name
                email
            }
        }
    }
`;

export default LOGIN_MUTATION;
