import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query {
    tasks {
      _id
      title
      description
      completed
    }
  }
`;