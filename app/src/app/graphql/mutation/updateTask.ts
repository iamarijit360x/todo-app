// src/app/graphql/mutation/updateTask.ts
import { gql } from '@apollo/client';

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: String!, $title: String!, $description: String, $completed: Boolean!) {
    updateTask(id: $id, updateTaskInput: { title: $title, description: $description, completed: $completed }) {
      _id
      title
      description
      completed
    }
  }
`;
