// src/graphql/mutations/signup.ts
import { gql } from '@apollo/client';

const SIGNUP_MUTATION = gql`
    mutation Signup($createUserInput: CreateUserInput!) {
        signup(createUserInput: $createUserInput) {
            _id
            name
            email
        }
    }
`;

export default SIGNUP_MUTATION;
