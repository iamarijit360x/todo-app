// src/app/graphql/mutations/deleteTask.ts
import { gql } from '@apollo/client';

export const DELETE_TASK = gql`
  mutation RemoveTask($id: String!) {
    removeTask(id: $id) {
      _id
    }
  }
`;
