// In your mutations file, e.g., updateStatus.js
import { gql } from '@apollo/client';

export const UPDATE_STATUS = gql`
  mutation updateStatus($id: String!, $completed: Boolean!) {
    updateStatus (id: $id,updateTaskStatusInput:{completed: $completed}) {
      _id
      completed
    }
  }
`;
