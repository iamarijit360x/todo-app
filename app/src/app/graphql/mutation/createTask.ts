// src/app/graphql/mutations/createTask.ts
import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String!, $completed: Boolean!) {
    createTask(createTaskInput: {
      title: $title,
      description: $description,
      completed: $completed
    }) {
      _id
      title
      description
      completed
    }
  }
`;


// mutation{
//     removeTask(id:"67261591188adf937349f23c")
//     {
//       _id
//     }
//   }

// query {
//     tasks {
//       _id
//       title
//       description
//       completed
//     }
//   }
  