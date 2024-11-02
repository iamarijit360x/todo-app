// src/graphql/mutations/signup.ts
import { gql } from '@apollo/client';

const SIGNUP_MUTATION = gql`
    mutation Signup($name: String!, $email: String!, $password: String!) {
        signup(name: $name, email: $email, password: $password) {
                _id
                name
                email
            
        }
    }
`;

export default SIGNUP_MUTATION;